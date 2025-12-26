import { get } from "svelte/store";
import { removeKeysFromRecord } from "../util/generic";
import { showToast } from "../view/toast";
import { AlertType } from "$lib/stores/view/toast";
import { loadedDone, userAuthenticated, uiSynchronized, latestAPIMessage } from "$lib/stores/view/navigation";
import { convertDateToLocalTime } from "../util/date";
import { navigateTo } from "../view/navigation";
import type { AlertTextList } from "$lib/stores/view/toast";

/**
 * Configuration object for executing an HTTP API request.
 * Defines all parameters required to perform a backend call, including
 * request data, timeout control, cancellation support, and optional
 * multipart upload handling.
 *
 * @type CallAPIOptions
 * @property {string} endpoint - API endpoint path (e.g., "/api/device/get")
 * @property {"GET" | "POST" | "PUT" | "DELETE"} method - HTTP method used for the request
 * @property {Record<string, any>} [params] - Request parameters (query params for GET, body otherwise)
 * @property {number} [timeout] - Optional request timeout in milliseconds
 * @property {File} [file] - Optional file for multipart/form-data uploads
 * @property {string} [fileFieldName] - Form field name for the uploaded file
 * @property {boolean} [setLoaded] - Whether to update the global loaded state on success
 * @property {AbortSignal} [signal] - Optional abort signal for request cancellation
 * @property {typeof fetch} [fetchFn] - Fetch implementation override (e.g., for SSR)
 */
export type CallAPIOptions = {
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    params?: Record<string, any>;
    timeout?: number;
    file?: File;
    fileFieldName?: string;
    setLoaded?: boolean;
    signal?: AbortSignal;
    fetchFn?: typeof fetch;
};

/**
 * API execution descriptor interface.
 * Represents a reusable, execution-agnostic definition of an API endpoint,
 * allowing callers to control execution behavior such as cancellation and
 * timeout without embedding policy into the API definition itself.
 *
 * @interface APIDescriptor
 * @template T - Type of the resolved response payload
 * @property {Function} call - Executes the API request with optional execution controls
 * @property {AbortSignal} [call.options.signal] - Optional abort signal for lifecycle cancellation
 * @property {number} [call.options.timeout] - Optional execution timeout in milliseconds
 */
export interface APIDescriptor<T> {
    call(
        options?: {
            signal?: AbortSignal;
            timeout?: number;
        }): Promise<T>
}

/**
 * Reason why an API request was aborted.
 */
enum AbortReason {
    MANUAL = "MANUAL",
    TIMEOUT = "TIMEOUT",
}

/**
 * Result of an API call: sucessful response, handled error, or intentionally aborted request.
 */
type APIResult =
    | { kind: "sucess"; status: number; data: any }
    | { kind: "error"; status: number; data: Record<string, any> }
    | { kind: "aborted"; abortReason: AbortReason }
    | { kind: "exception"; message: string };

/**
 * Centralized HTTP API orchestration layer.
 *
 * Provides a unified interface for executing backend API requests with
 * consistent application-level behavior, including request deduplication,
 * cooperative cancellation, timeout handling, authentication redirects,
 * error normalization, and user notification dispatch.
 *
 * The class tracks in-flight requests per endpoint to ensure only the most
 * recent request remains active, automatically aborting superseded ones.
 * It also coordinates UI-side effects such as global loading state updates
 * and deferred toast notifications during navigation transitions.
 *
 * This class is intended to be the single entry point for all HTTP-based
 * backend communication in the application.
 */
export class APICaller {

    static #inFlight: Map<string, AbortController> = new Map<string, AbortController>();

    /**
     * Low-level HTTP utility for performing API requests with unified timeout
     * and cancellation control.
     *
     * Builds and executes a fetch request using query parameters, JSON bodies,
     * or multipart form data depending on the HTTP method and inputs.
     *
     * The request lifecycle is controlled via an internally owned AbortController.
     * All requests must provide an external AbortSignal, which represents manual
     * cancellation (e.g. component lifecycle, request replacement). Requests may
     * also be aborted automatically due to a timeout; the abort reason is tracked
     * explicitly.
     *
     * An injectable fetch implementation is supported to allow use in different
     * runtimes (e.g. SSR or testing).
     *
     * @param endpoint - API endpoint path (e.g. "/api/resource")
     * @param method - HTTP method ("GET", "POST", "PUT", "DELETE")
     * @param params - Request parameters (query params for GET, body otherwise)
     * @param externalSignal - AbortSignal used for manual cancellation (required)
     * @param timeout - Optional timeout in milliseconds
     * @param file - Optional file for multipart/form-data uploads
     * @param fileFieldName - Form field name for the uploaded file
     * @param fetchFn - Fetch implementation to use (defaults to global fetch)
     *
     * @returns APIResult indicating success, handled error, or aborted request
     * (including the abort reason).
     */
    private static async makeAPIRequest(
        endpoint: string,
        method: string,
        params: Record<string, any> = {},
        externalSignal: AbortSignal,
        timeout?: number,
        file?: File,
        fileFieldName: string = "file",
        fetchFn: typeof fetch = fetch,
    ): Promise<APIResult> {
        const controller = new AbortController();
        const { signal } = controller;
        let abortReason: AbortReason = AbortReason.MANUAL;

        if (externalSignal.aborted) {
            controller.abort();
        }
        else {
            externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
        }

        // Automatically abort the request after `timeout` milliseconds if a timeout is given.
        let timeoutId: number | null = null;
        if (timeout !== undefined) {
            timeoutId = setTimeout(() => {
                abortReason = AbortReason.TIMEOUT;
                controller.abort();
            },
                timeout);
        }
        try {
            if (method !== "GET" && method !== "POST" && method !== "PUT" && method !== "DELETE") {
                throw new Error("Unsupported HTTP method");
            }

            let url = endpoint;
            let options: RequestInit = {
                method: method,
                signal,
            };

            // Handle GET requests by appending params to URL
            if (method === "GET" && Object.keys(params).length > 0) {
                const queryParams = Object.entries(params)
                    .map(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
                        }
                        return null;
                    })
                    .filter((param) => param !== null)
                    .join("&");

                url = queryParams ? `${endpoint}?${queryParams}` : endpoint;
            }
            // For non-GET requests, add params to the body
            else if (method !== "GET") {
                if (file) {
                    const formData = new FormData();
                    formData.append(fileFieldName, file);

                    Object.entries(params).forEach(([key, value]) => {
                        formData.append(key, JSON.stringify(value));
                    });

                    options.body = formData;
                } else if (Object.keys(params).length > 0) {
                    options.headers = {
                        "Content-Type": "application/json",
                    };
                    options.body = JSON.stringify(params);
                }
            }

            const response = await fetchFn(url, options);
            const data = await response.json();
            if (timeoutId != null) {
                clearTimeout(timeoutId); // cancel timeout if response arrives in time
                timeoutId = null;
            }
            return { kind: response.status === 200 ? "sucess" : "error", status: response.status, data: data };
        } catch (error) {
            if (timeoutId != null) {
                clearTimeout(timeoutId); // cancel timeout if error occurs
                timeoutId = null;
            }
            if ((error as any)?.name === "AbortError") return { kind: "aborted", abortReason }
            return { kind: "exception", message: String(error) };
        }
    }

    /**
     * Executes an API request with centralized application-level handling.
     *
     * Wraps a low-level HTTP request with standardized behavior for request
     * deduplication, cooperative cancellation, authentication redirects,
     * error normalization, toast notification dispatch, and optional global
     * loading-state updates.
     *
     * In-flight requests are tracked per endpoint to ensure only the latest
     * request remains active, with previous ones aborted when replaced.
     * UI notifications are either displayed immediately or deferred until
     * UI synchronization completes.
     *
     * @param options - API call configuration
     * @param options.endpoint - Backend API endpoint path
     * @param options.method - HTTP method ("GET", "POST", "PUT", "DELETE")
     * @param options.params - Request parameters (query params for GET, body otherwise)
     * @param options.timeout - Optional request timeout in milliseconds
     * @param options.file - Optional file for multipart/form-data uploads
     * @param options.fileFieldName - Form field name for file uploads
     * @param options.setLoaded - Whether to mark the global loaded state on success
     * @param options.signal - Optional AbortSignal for lifecycle cancellation
     * @param options.fetchFn - Fetch implementation override (defaults to global fetch)
     *
     * @returns Promise resolving to a success flag and response payload on success,
     *          or a failure flag with null data on error or early termination.
     */
    static async callAPI({
        endpoint,
        method,
        params = {},
        timeout,
        file,
        fileFieldName = "file",
        setLoaded = false,
        signal,
        fetchFn = fetch,
    }: CallAPIOptions): Promise<{ sucess: boolean; data: any }> {

        const abortController = APICaller.handleInFlightRequests(endpoint, signal);
        const apiResult = await APICaller.makeAPIRequest(endpoint, method, params, abortController.signal, timeout, file, fileFieldName, fetchFn);
        try {
            if (apiResult.kind === "sucess") {
                if (setLoaded && !get(loadedDone)) loadedDone.set(true); // Set loaded done
                return { sucess: true, data: apiResult.data };
            }
            else { // Process Error
                const redirectedToLogin = await APICaller.redirectToLogin(apiResult);
                if (APICaller.returnEarly(apiResult, endpoint, redirectedToLogin)) return { sucess: false, data: null };
                let errorMessage = APICaller.getAPIMessageCode(apiResult);
                if (get(uiSynchronized)) {
                    showToast(errorMessage.code, AlertType.ALERT, errorMessage.details, errorMessage.textList, errorMessage.autoClose);
                }
                else {
                    latestAPIMessage.set(errorMessage);
                }
                return { sucess: false, data: null };
            }
        } catch (e) {
            console.error(`Error calling API ${endpoint}: ${e}`);
            return { sucess: false, data: null };
        }
        finally {
            APICaller.#inFlight.delete(endpoint);
        }
    }

    /**
     * Manages in-flight requests for a given endpoint.
     *
     * Aborts any previous request associated with the same endpoint, creates a new
     * AbortController for the current request, and links it to an optional external
     * AbortSignal so caller-initiated aborts are propagated.
     *
     * @param endpoint - Unique key used to identify and replace in-flight requests
     * @param signal - Optional external AbortSignal to chain cancellation from the caller
     * @returns AbortController controlling the lifetime of the new request
     */
    private static handleInFlightRequests(endpoint: string, signal?: AbortSignal): AbortController {
        const prevRequest = APICaller.#inFlight.get(endpoint);
        if (prevRequest) prevRequest.abort();
        const controller = new AbortController();
        signal?.addEventListener("abort", () => controller.abort());
        APICaller.#inFlight.set(endpoint, controller);
        return controller;
    }

    /**
     * Handles authentication-related API failures by redirecting the user to the login page.
     *
     * Inspects an APIResult and, if it represents an authentication error
     * (e.g. unauthorized or rate-limited access), clears the authenticated state
     * and performs a navigation redirect to the login view.
     *
     * @param apiResult - Result returned by an API request
     * @returns True if a redirect to the login page was performed, false otherwise
     */
    private static async redirectToLogin(apiResult: APIResult): Promise<boolean> {
        let authenticationError = apiResult.kind === "error" && (apiResult.status === 401 || apiResult.status === 429);
        if (authenticationError) { // Unauthorized acess
            userAuthenticated.set(false);
            await navigateTo("/login", {}, true, true);
            return true;
        }
        return false;
    }

    /**
     * Determines whether API result handling should stop early.
     *
     * Returns true when further processing is unnecessary or undesirable, such as
     * when a redirect to the login page has already occurred for auto-login requests,
     * or when a request was intentionally aborted due to manual cancellation.
     *
     * @param apiResult - Result returned by an API request
     * @param endpoint - API endpoint associated with the request
     * @param redirectedToLogin - Whether a login redirect has already been performed
     * @returns True if the caller should return early, false otherwise
     */
    private static returnEarly(apiResult: APIResult, endpoint: string, redirectedToLogin: boolean): boolean {
        if (redirectedToLogin && endpoint === "/api/auth/auto_login") return true;
        if (apiResult.kind === "aborted" && apiResult.abortReason === AbortReason.MANUAL) return true;
        return false;
    }

    /**
     * Translates an APIResult into a UI-ready error message configuration.
     *
     * Normalizes API error responses, maps backend error codes and sections to
     * localized alert groups, enriches error details where required, and determines
     * whether the resulting alert should auto-close.
     *
     * Aborted and exception results are handled explicitly and converted into
     * generic, user-facing error messages.
     *
     * @param apiResult - Result returned by an API request
     * @returns Structured error message data for toast/alert display
     */
    private static getAPIMessageCode(apiResult: APIResult): { code: string, details: Record<string, string>, textList: AlertTextList, autoClose: boolean } {

        if (apiResult.kind === "aborted") return { code: "timeoutError", details: {}, textList: "general", autoClose: false };
        if (apiResult.kind === "exception") return { code: "unexpectedError", details: { message: apiResult.message }, textList: "general", autoClose: false };
        let errorCode: string | undefined = apiResult.data?.error_code;
        let errorSection: string | undefined = apiResult.data?.error_section;
        let details = removeKeysFromRecord(apiResult.data, ["error_code", "error_section"]);
        if (!errorCode) return { code: "unexpectedError", details: { message: "Got an undefined error code." }, textList: "general", autoClose: false };
        if (details?.unlocked_date != undefined) {
            details.unlocked_date = convertDateToLocalTime(details?.unlocked_date);
            if (details?.remaining_attempts != undefined && details?.remaining_attempts == "0") {
                errorCode = "BLOCKED_CLIENT"; // Set error code to blocked client in ui to show the user it is already blocked
            }
        }
        let textList: AlertTextList;
        switch (errorSection) {
            case "GLOBAL":
                textList = "apiGeneral";
                break;
            case "AUTH":
                textList = "apiAuthorization";
                break;
            case "DEVICE":
                textList = "apiDevice";
                break;
            case "NODES":
                textList = "apiNodes";
                break;
            default:
                return { code: "unexpectedError", details: { message: "Got an unknown error section." }, textList: "general", autoClose: false };
        }
        let autoClose = apiResult.status !== 401 && apiResult.status !== 429;
        return { code: errorCode, details, textList, autoClose };
    }
}
