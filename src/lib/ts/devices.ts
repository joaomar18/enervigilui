/**
 * Fetches the state of all devices from the server, with an optional timeout to abort the request.
 *
 * @param timeout - Maximum time in milliseconds to wait for the server response before aborting. Defaults to 3000 ms.
 * @returns A promise that resolves to an object containing:
 *   - `status`: the HTTP status code of the response, or -1 if the request was aborted or failed.
 *   - `data`: the parsed JSON payload from the server, or `null` if the request failed or was aborted.
 *
 * @example
 * getAllDevicesState(5000)
 *   .then(({ status, data }) => {
 *     if (status === 200) {
 *       console.log('Device states:', data);
 *     } else {
 *       console.error('Failed to fetch device states. Status:', status);
 *     }
 *   });
 */
export async function getAllDevicesState(
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const signal = controller.signal;

    // Automatically abort the request after `timeout` milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch("/api/get_all_device_state", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        });

        clearTimeout(timeoutId); // cancel timeout if response arrives in time
        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        return {
            status: -1,
            data: null,
        };
    }
}
