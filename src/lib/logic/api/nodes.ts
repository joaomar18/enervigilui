import { makeAPIRequest } from "$lib/logic/api/api";

/**
 * Gets config of nodes for a device.
 * @param id - Device ID.
 * @param timeout - Request timeout (ms).
 * @returns Promise with status and data.
 */
export async function getDeviceNodesConfig(id: number, timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/nodes/get_nodes_config", "GET", { id }, timeout);
}
