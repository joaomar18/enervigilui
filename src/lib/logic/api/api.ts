import { get } from "svelte/store";
import { showToast } from "../view/toast";
import { ToastType } from "$lib/stores/view/toast";
import { navigateTo } from "../view/navigation";
import { selectedLang } from "$lib/stores/lang/definition";
import { loadedDone } from "$lib/stores/view/navigation";

export type CallAPIOptions = {
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    params?: Record<string, any>;
    timeout?: number;
    loginPage?: boolean;
    file?: File;
    fileFieldName?: string;
    setLoaded?: boolean;
};

/**
 * Makes an HTTP request to the specified API endpoint with the given parameters.
 *
 * @param endpoint - The API endpoint to send the request to (e.g., "/api/resource").
 * @param method - The HTTP method to use for the request (e.g., "GET", "POST", "PUT", "DELETE").
 *   Only these methods are supported; an error will be thrown for unsupported methods.
 * @param params - An object containing the parameters to include in the request.
 *   - For GET requests, the parameters are appended to the URL as query parameters.
 *   - For non-GET requests without files, the parameters are included in the request body as JSON.
 *   - For non-GET requests with files, the parameters are included in FormData along with the file.
 * @param timeout - The maximum time in milliseconds to wait for a server response
 *   before aborting the request. Defaults to 3000ms (3 seconds).
 * @param file - Optional file to upload. When provided, the request will be sent as FormData
 *   instead of JSON, and the file will be included in the form data.
 * @param fileFieldName - The field name for the file in the FormData. Defaults to "file".
 *   This allows the server to identify the file with the expected field name.
 * @returns A promise that resolves to an object containing:
 *   - `status`: HTTP status code from the server response, or -1 if the request failed/timed out.
 *   - `data`: The data returned by the server, or null if the request failed.
 *
 * @throws An error if the HTTP method is unsupported or if the request fails.
 *
 * @example
 * // Example GET request with query parameters
 * const { status, data } = await makeAPIRequest("/api/resource", "GET", { id: 123 });
 *
 * @example
 * // Example POST request with a JSON body
 * const { status, data } = await makeAPIRequest("/api/resource", "POST", { name: "John", age: 30 });
 *
 * @example
 * // Example file upload with additional parameters
 * const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
 * const file = fileInput.files?.[0];
 * if (file) {
 *   const { status, data } = await makeAPIRequest(
 *     "/api/devices/123/image",
 *     "POST",
 *     { deviceId: 123, description: "Device photo" },
 *     10000,
 *     file,
 *     "deviceImage"
 *   );
 * }
 *
 * @example
 * // Example with a custom timeout
 * const { status, data } = await makeAPIRequest("/api/resource", "GET", {}, 5000); // 5-second timeout
 */
export async function makeAPIRequest(
    endpoint: string,
    method: string,
    params: Record<string, any> = {},
    timeout: number = 3000,
    file?: File,
    fileFieldName: string = "file"
): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const signal = controller.signal;

    // Automatically abort the request after `timeout` milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);
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

        const response = await fetch(url, options);
        const data = await response.json();
        clearTimeout(timeoutId); // cancel timeout if response arrives in time

        return {
            status: response.status,
            data: data,
        };
    } catch (error) {
        clearTimeout(timeoutId);
        console.error(error);
        return {
            status: -1,
            data: null,
        };
    }
}

/**
 * High-level API wrapper that handles HTTP requests with automatic error handling and user feedback.
 *
 * Provides centralized error handling, toast notifications, authentication redirects, and loading state management.
 *
 * @param options - Configuration object for the API call
 * @param options.endpoint - API endpoint path (e.g., "/api/devices")
 * @param options.method - HTTP method ("GET", "POST", "PUT", "DELETE")
 * @param options.params - Request parameters (query params for GET, body for others)
 * @param options.timeout - Request timeout in milliseconds (default: 3000)
 * @param options.loginPage - Whether this is a login page request (affects error handling)
 * @param options.file - Optional file for upload requests
 * @param options.fileFieldName - Form field name for file uploads (default: "file")
 * @param options.setLoaded - Whether to set loadedDone state to true on success
 * @returns Promise with success status and response data
 */
export async function callAPI({
    endpoint,
    method,
    params = {},
    timeout = 3000,
    loginPage = false,
    file = undefined,
    fileFieldName = "file",
    setLoaded = false,
}: CallAPIOptions): Promise<{ sucess: boolean; data: any }> {
    try {
        const { status, data }: { status: number; data: any } = await makeAPIRequest(endpoint, method, params, timeout, file, fileFieldName);
        if (status !== 200) {
            switch (status) {
                case -1:
                    showToast("timeout", ToastType.ALERT);
                    break;
                case 401:
                    if (loginPage) {
                        showToast("wrongCredentials", ToastType.ALERT, { remaining: String(data.remaining) });
                    } else {
                        await navigateTo("/login", {}, true);
                    }
                    break;
                case 429:
                    const date = new Date(data.unlocked ?? "");
                    const localTime = date.toLocaleTimeString(get(selectedLang) === "PT" ? "pt-PT" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    showToast("tooManyAttempts", ToastType.ALERT, { localTime: localTime });
                    break;
                default:
                    showToast("unknownError", ToastType.ALERT);
                    break;
            }
            return { sucess: false, data: null };
        }
        if (setLoaded && !get(loadedDone)) {
            loadedDone.set(true);
        }
        return { sucess: true, data: data };
    } catch (e) {
        showToast("unexpectedError", ToastType.ALERT);
        console.error(`Error processing request: ${e}`);
        return { sucess: false, data: null };
    }
}
