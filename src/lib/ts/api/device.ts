import { makeAPIRequest } from "$lib/ts/api/api";
import type { DeviceMeter } from "$lib/stores/devices";
import type { DeviceNode } from "$lib/stores/nodes";

/**
 * Gets all devices' state/config from server.
 * @param timeout - Request timeout (ms).
 * @returns Promise with status and data.
 */
export async function getAllDevicesState(timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/device/get_all_devices_state", "GET", {}, timeout);
}

/**
 * Gets a device's state/config from server.
 * @param id - Device ID.
 * @param timeout - Request timeout (ms).
 * @returns Promise with status and data.
 */
export async function getDeviceState(id: number, timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/device/get_device_state", "GET", { id }, timeout);
}

/**
 * Gets default device image from server.
 * @param timeout - Request timeout (ms).
 * @returns Promise with status and data.
 */
export async function getDefaultImage(timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/device/get_default_image", "GET", {}, timeout);
}

/**
 * Adds a new device to the server.
 * @param deviceData - Device config.
 * @param deviceImage - Optional image file.
 * @param deviceNodes - Associated nodes.
 * @param timeout - Request timeout (ms).
 * @returns Promise with status and data.
 */
export async function addDevice(
    deviceData: DeviceMeter,
    deviceImage: File | undefined,
    deviceNodes: Array<DeviceNode>,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/device/add_device", "POST", { deviceData, deviceNodes }, timeout, deviceImage, "deviceImage");
}

/**
 * Updates an existing device on the server.
 * @param deviceData - Device config.
 * @param deviceImage - Optional image file.
 * @param deviceNodes - Associated nodes.
 * @param timeout - Request timeout (ms).
 * @returns Promise with status and data.
 */
export async function editDevice(
    deviceData: DeviceMeter,
    deviceImage: File | undefined,
    deviceNodes: Array<DeviceNode>,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/device/edit_device", "POST", { deviceData, deviceNodes }, timeout, deviceImage, "deviceImage");
}

/**
 * Deletes a device from the server.
 * @param deviceName - Device name.
 * @param deviceID - Device ID.
 * @param timeout - Request timeout (ms).
 * @returns Promise with status and data.
 */
export async function deleteDevice(deviceName: string, deviceID: number, timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/device/delete_device", "DELETE", { deviceName, deviceID }, timeout);
}
