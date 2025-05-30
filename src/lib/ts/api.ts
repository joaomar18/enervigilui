/**
 * Makes an HTTP request to the specified API endpoint with the given parameters.
 *
 * @param endpoint - The API endpoint to send the request to (e.g., "/api/resource").
 * @param method - The HTTP method to use for the request (e.g., "GET", "POST", "PUT", "DELETE").
 *   Only these methods are supported; an error will be thrown for unsupported methods.
 * @param params - An object containing the parameters to include in the request.
 *   - For GET requests, the parameters are appended to the URL as query parameters.
 *   - For non-GET requests, the parameters are included in the request body as JSON.
 * @param timeout - The maximum time in milliseconds to wait for a server response
 *   before aborting the request. Defaults to 3000ms (3 seconds).
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
 * // Example with a custom timeout
 * const { status, data } = await makeAPIRequest("/api/resource", "GET", {}, 5000); // 5-second timeout
 */
export async function makeAPIRequest(
    endpoint: string,
    method: string,
    params: Record<string, any> = {},
    timeout: number = 3000
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
            headers: {
                "Content-Type": "application/json",
            },
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
        else if (method !== "GET" && Object.keys(params).length > 0) {
            options.body = JSON.stringify(params);
        }

        const response = await fetch(url, options);
        clearTimeout(timeoutId); // cancel timeout if response arrives in time

        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        clearTimeout(timeoutId);
        return {
            status: -1,
            data: null,
        };
    }
}
