import { makeAPIRequest } from "./api";

/**
 * Fetches the state and configuration of a specific device from the server.
 *
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request.
 * @returns {Promise<{ status: number; data: any }>} - A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await getAllDevicesState();
 * console.log(response.status, response.data);
 * ```
 */
export async function getAllDevicesState(
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/get_all_device_state", "GET", {}, timeout);
}

/**
 * Fetches the state and configuration of a specific device from the server.
 *
 * @param {string} name - The name of the device.
 * @param {number} id - The unique identifier of the device.
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request.
 * @returns {Promise<{ status: number; data: any }>} - A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await getDeviceState("DeviceName", 123);
 * console.log(response.status, response.data);
 * ```
 */
export async function getDeviceState(
    name: string,
    id: number,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/get_device_state", "GET", { name, id }, timeout);
}

/**
 * Fetches the configuration of nodes associated with a specific device from the server.
 *
 * @param {string} name - The name of the device.
 * @param {number} id - The unique identifier of the device.
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request.
 * @returns {Promise<{ status: number; data: any }>} - A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await getDeviceNodesConfig("DeviceName", 123);
 * console.log(response.status, response.data);
 * ```
 */
export async function getDeviceNodesConfig(
    name: string,
    id: number,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/get_nodes_config", "GET", { name, id }, timeout);
}
