import { get } from "svelte/store";
import { showToast } from "../view/toast";
import { AlertType } from "$lib/stores/view/toast";
import { loadedDone } from "$lib/stores/view/navigation";
import { convertDateToLocalTime } from "../util/date";
import { navigateTo } from "../view/navigation";
import { userAuthenticated } from "$lib/stores/view/navigation";
import type { AlertTextList } from "$lib/stores/view/toast";

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

export interface APIDescriptor<T> {
    call(
        options?: {
            signal?: AbortSignal;
            timeout?: number;
        }): Promise<T>
}

/**
 * Low-level HTTP utility for performing API requests with unified timeout
 * and cancellation control.
 *
 * Builds and executes a fetch request using query parameters, JSON bodies,
 * or multipart form data depending on the HTTP method and provided inputs.
 *
 * The request lifecycle is controlled via an internally owned AbortController,
 * which can be aborted either by:
 * - an optional external AbortSignal (e.g. from a poller, retrier, or component lifecycle), or
 * - an optional timeout, if provided.
 *
 * Both cancellation sources are merged so that the underlying fetch request
 * is aborted deterministically and only once.
 *
 * The fetch implementation can be injected to support framework-specific
 * environments (e.g. SvelteKit SSR or testing).
 *
 * @param endpoint - API endpoint path (e.g. "/api/resource")
 * @param method - HTTP method ("GET", "POST", "PUT", "DELETE")
 * @param params - Request parameters (query params for GET, request body otherwise)
 * @param timeout - Optional request timeout in milliseconds; if undefined, no timeout is applied
 * @param file - Optional file for multipart/form-data upload requests
 * @param fileFieldName - Form field name used for the uploaded file
 * @param externalSignal - Optional AbortSignal to cancel the request externally
 * @param fetchFn - Fetch implementation to use (defaults to global fetch)
 *
 * @returns Promise resolving to an object containing:
 *  - `status`: the HTTP status code returned by the server, or `-1` if the request
 *    was aborted, timed out, or failed before a response was received
 *  - `data`: the parsed JSON response body, or `null` on failure
 */
export async function makeAPIRequest(
    endpoint: string,
    method: string,
    params: Record<string, any> = {},
    timeout?: number,
    file?: File,
    fileFieldName: string = "file",
    externalSignal?: AbortSignal,
    fetchFn: typeof fetch = fetch,
): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const { signal } = controller;

    if (externalSignal) {
        if (externalSignal.aborted) {
            controller.abort();
        }
        else {
            externalSignal.addEventListener("abort", () => controller.abort(), { once: true })
        }
    }
    // Automatically abort the request after `timeout` milliseconds if a timeout is given.
    let timeoutId: number | null = null;
    if (timeout !== undefined) {
        timeoutId = setTimeout(() => controller.abort(), timeout);
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
        return {
            status: response.status,
            data: data,
        };
    } catch (error) {
        if (timeoutId != null) {
            clearTimeout(timeoutId); // cancel timeout if error occurs
            timeoutId = null;
        }
        return {
            status: -1,
            data: null,
        };
    }
}

/**
 * Centralized API execution wrapper that performs HTTP requests and applies
 * consistent application-level behavior.
 *
 * This function delegates the low-level HTTP request to `makeAPIRequest`
 * and then interprets the response to handle:
 * - Authentication failures and automatic redirects
 * - Backend error codes and sections
 * - User-facing toast notifications
 * - Global loading state updates
 *
 * It supports cooperative cancellation via AbortSignal and optional timeout
 * control, allowing callers such as pollers or retriers to manage execution
 * policy externally.
 *
 * @param options - API call configuration object
 * @param options.endpoint - API endpoint path (e.g. "/api/devices")
 * @param options.method - HTTP method ("GET", "POST", "PUT", "DELETE")
 * @param options.params - Request parameters (query params for GET, body otherwise)
 * @param options.timeout - Optional request timeout in milliseconds
 * @param options.file - Optional file for multipart/form-data upload requests
 * @param options.fileFieldName - Form field name for file uploads
 * @param options.setLoaded - Whether to update the global loaded state on success
 * @param options.signal - Optional AbortSignal for lifecycle-controlled cancellation
 * @param options.fetchFn - Fetch implementation to use (defaults to global fetch)
 *
 * @returns Promise resolving to an object containing:
 *          - `sucess`: Boolean indicating whether the request completed successfully
 *          - `data`: Parsed response payload on success, or null on failure
 */
export async function callAPI({
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
    const { status, data }: { status: number; data: any } = await makeAPIRequest(endpoint, method, params, timeout, file, fileFieldName, signal, fetchFn);
    try {
        let error_code = data?.error_code;
        let error_section = data?.error_section;
        let details: Record<string, string> = data;
        if (status !== 200) {
            let authenticationError = status === 401 || status === 429;
            if (authenticationError) { // Unauthorized acess
                userAuthenticated.set(false);
                await navigateTo("/login", {}, true, true);
            }
            if (endpoint === "/api/auth/auto_login" && authenticationError) return { sucess: false, data: data };
            if (status === -1) throw new Error(`API Request timed out.`);
            if (!error_code) throw new Error(`Got an error id with an undefined section.`);
            if (details?.unlocked_date !== undefined) {
                details.unlocked_date = convertDateToLocalTime(details?.unlocked_date) as string;
                if (details?.remaining_attempts !== undefined && details?.remaining_attempts == "0") {
                    error_code = "BLOCKED_CLIENT"; // Set error code to blocked client in ui to show the user it is already blocked
                }
            }
            let textList: AlertTextList;
            switch (error_section) {
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
                    throw new Error(`Got an unknown error section: ${error_section}.`)
            }
            let autoClose = status !== 401 && status !== 429;
            showToast(error_code, AlertType.ALERT, details, textList, autoClose);
            return { sucess: false, data: null };
        }
        if (setLoaded && !get(loadedDone)) {
            loadedDone.set(true);
        }
        return { sucess: true, data: data };
    } catch (e) {
        if (status === -1) {
            showToast("timeoutError", AlertType.ALERT);
        }
        else {
            showToast("unexpectedError", AlertType.ALERT, { message: String(e) }, "general");

        }
        console.error(`Error processing request: ${e}`);
        return { sucess: false, data: null };
    }
}
