import { callAPI } from "$lib/logic/api/api";
import type { APIDescriptor } from "$lib/logic/api/api";
import type { Device, EditableDevice, DeviceHistory, DeviceInfo } from "$lib/types/device/base";
import type { NodeRecord } from "$lib/types/nodes/config";
import { processInitialDevice, convertToEditableDevice } from "../factory/device";
import { processDeviceHistory } from "../handlers/device";
import { navigateTo } from "../view/navigation";

/**
 * Retrieves all devices objects from the server with their state and configuration.
 * Processes device data without including images for faster loading.
 *
 * @returns Object containing array of processed device data.
 * @throws Error if the API request fails.
 */
export function getAllDevicesAPI(): APIDescriptor<{ devices: Array<Device> }> {
    return {
        async call({ signal, timeout } = {}) {
            let devices: Array<Device>;

            const { sucess, data } = await callAPI({
                endpoint: "/api/device/get_all_devices",
                method: "GET",
                setLoaded: true,
                signal,
                timeout,
            });
            if (sucess) {
                devices = data.map((data: Device & { image: Record<string, string> }) => {
                    const { ...requestDeviceData } = data as Device;
                    let deviceData: Device = processInitialDevice(requestDeviceData as Device);
                    return deviceData;
                }) as Array<Device>;
            } else {
                throw new Error("Get all devices data error.");
            }

            return { devices };
        }
    };
}

/**
 * Retrieves all devices objects from the server.
 * Processes device data and converts base64 images to data URLs.
 *
 * @returns Object containing processed devices array and device images mapped by ID.
 * @throws Error if the API request fails.
 */
export function getAllDevicesWithImageAPI(): APIDescriptor<{ devices: Array<Device>; devicesImages: Record<number, string> }> {
    return {
        async call({ signal, timeout } = {}) {
            let devices: Array<Device>;
            let devicesImages: Record<number, string> = {};

            const { sucess, data } = await callAPI({
                endpoint: "/api/device/get_all_devices_with_image",
                method: "GET",
                setLoaded: true,
                signal,
                timeout,
            });
            if (sucess) {
                devices = data.map((data: Device & { image: Record<string, string> }) => {
                    const { image: deviceImage, ...requestDeviceData } = data as Device & { image: Record<string, string> };
                    let deviceData: Device = processInitialDevice(requestDeviceData as Device);
                    devicesImages[deviceData.id] = `data:${deviceImage["type"]};base64,${deviceImage["data"]}`;
                    return deviceData;
                }) as Array<Device>;
            } else {
                throw new Error("Get all devices data with images error.");
            }

            return { devices, devicesImages };
        }
    };
}

/**
 * Retrieves a specific device object with state and configuration data.
 * Returns only the initial device data without image information.
 *
 * @param id - The unique identifier of the device to retrieve.
 * @returns Object containing the initial device data.
 * @throws Error if the API request fails.
 */
export function getDeviceAPI(id: number): APIDescriptor<{ initialDeviceData: Device }> {
    return {
        async call({ signal, timeout } = {}) {
            let initialDeviceData: Device;
            const { sucess, data } = await callAPI({
                endpoint: "/api/device/get_device",
                method: "GET",
                params: { id },
                setLoaded: true,
                signal,
                timeout,
            });
            if (sucess) {
                const { ...requestDeviceData } = data as Device;
                initialDeviceData = processInitialDevice(requestDeviceData as Device);
            } else {
                throw new Error("Get device data error.");
            }

            return { initialDeviceData };
        }
    };
}

/**
 * Retrieves detailed device information including processed historical data.
 * Returns device metadata along with its associated history.
 *
 * @param id - The unique identifier of the device to retrieve information for.
 * @returns Object containing the device information and processed history.
 * @throws Error if the API request fails.
 */
export function getDeviceInfoAPI(id: number): APIDescriptor<{ deviceInfo: DeviceInfo }> {
    return {
        async call({ signal, timeout } = {}) {
            let deviceInfo: DeviceInfo;
            let deviceHistory: DeviceHistory;

            const { sucess, data } = await callAPI({
                endpoint: "/api/device/get_device_info",
                method: "GET",
                params: { id },
                signal,
                timeout,
            });
            if (sucess) {
                const { ...requestDeviceInfo } = data;
                deviceHistory = requestDeviceInfo.history as DeviceHistory;
                deviceInfo = requestDeviceInfo as DeviceInfo;
                deviceInfo.history = processDeviceHistory(deviceHistory);
            } else {
                throw new Error("Get device information and history error.");
            }
            return { deviceInfo };
        }
    };
}

/**
 * Retrieves a specific device object with state and configuration data.
 * Returns both the initial device data and an editable version for modifications.
 *
 * @param id - The unique identifier of the device to retrieve.
 * @returns Object containing initial device data and editable device configuration.
 * @throws Error if the API request fails.
 */
export function getDeviceWithImageAPI(id: number): APIDescriptor<{ initialDeviceData: Device; deviceData: EditableDevice }> {
    return {
        async call({ signal, timeout } = {}) {
            let initialDeviceData: Device;
            let deviceData: EditableDevice;
            const { sucess, data } = await callAPI({
                endpoint: "/api/device/get_device_with_image",
                method: "GET",
                params: { id },
                setLoaded: true,
                signal,
                timeout,
            });
            if (sucess) {
                const { image: deviceImage, ...requestDeviceData } = data as Device & { image: Record<string, string> };
                initialDeviceData = processInitialDevice(requestDeviceData as Device);
                deviceData = convertToEditableDevice(initialDeviceData, deviceImage);
            } else {
                throw new Error("Get device data with image error.");
            }

            return { initialDeviceData, deviceData };
        }
    };
}

/**
 * Retrieves detailed information and historical data for a specific device.
 * Returns the device metadata along with its processed history data.
 *
 * @param id - The unique identifier of the device to retrieve information for.
 * @returns Object containing the device information and processed history.
 * @throws Error if the API request fails.
 */
export function getDeviceInfoWithImageAPI(id: number): APIDescriptor<{ deviceInfo: DeviceInfo; deviceImageUrl: string }> {
    return {
        async call({ signal, timeout } = {}) {
            let deviceInfo: DeviceInfo;
            let deviceHistory: DeviceHistory;
            let deviceImageUrl: string;

            const { sucess, data } = await callAPI({
                endpoint: "/api/device/get_device_info_with_image",
                method: "GET",
                params: { id },
                signal,
                timeout,
            });
            if (sucess) {
                const { image: requestDeviceImage, ...requestDeviceInfo } = data as DeviceInfo & { image: Record<string, string> };
                deviceHistory = requestDeviceInfo.history as DeviceHistory;
                deviceInfo = requestDeviceInfo as DeviceInfo;
                deviceInfo.history = processDeviceHistory(deviceHistory);
                deviceImageUrl = `data:${requestDeviceImage["type"]};base64,${requestDeviceImage["data"]}`;
            } else {
                throw new Error("Get device information and history with image error.");
            }
            return { deviceInfo, deviceImageUrl };
        }
    };
}

/**
 * Retrieves the default device image from the server.
 * Converts base64 image data to a data URL for display.
 *
 * @returns Data URL string of the default device image.
 * @throws Error if the API request fails.
 */
export function getDefaultImageAPI(): APIDescriptor<string> {
    return {
        async call({ signal, timeout } = {}) {
            let imageData: Record<string, string>;
            const { sucess, data } = await callAPI({
                endpoint: "/api/device/get_default_image",
                method: "GET",
                setLoaded: true,
                signal,
                timeout,
            });
            if (sucess) {
                imageData = data as Record<string, string>;
            } else {
                throw new Error("Get default device image error.");
            }
            return `data:${imageData["type"]};base64,${imageData["data"]}`;
        }
    };
}

/**
 * Creates a new device with configuration data, optional image, and associated nodes.
 * Navigates to devices page on successful creation.
 *
 * @param deviceData - Complete device configuration and settings.
 * @param deviceImage - Optional image file to associate with the device.
 * @param deviceNodes - Array of nodes/variables associated with the device.
 */
export function addDeviceAPI(deviceData: Device, deviceImage: File | undefined, deviceNodes: Array<NodeRecord>): APIDescriptor<void> {
    return {
        async call({ signal, timeout } = {}) {
            const { sucess, data } = await callAPI({
                endpoint: "/api/device/add_device",
                method: "POST",
                params: { device_data: deviceData, device_nodes: deviceNodes },
                file: deviceImage,
                fileFieldName: "device_image",
                signal,
                timeout,
            });
            if (sucess) {
                await navigateTo("/devices", {});
            }
        }
    };
}

/**
 * Updates an existing device with modified configuration data, image, and nodes.
 * Navigates to devices page on successful update.
 *
 * @param deviceData - Updated device configuration and settings.
 * @param deviceImage - Optional new image file for the device.
 * @param deviceNodes - Updated array of nodes/variables for the device.
 */
export function editDeviceAPI(deviceData: Device, deviceImage: File | undefined, deviceNodes: Array<NodeRecord>): APIDescriptor<void> {
    return {
        async call({ signal, timeout } = {}) {
            const { sucess, data } = await callAPI({
                endpoint: "/api/device/edit_device",
                method: "POST",
                params: { device_data: deviceData, device_nodes: deviceNodes },
                file: deviceImage,
                fileFieldName: "device_image",
                signal,
                timeout,
            });
            if (sucess) {
                await navigateTo("/devices", {});
            }
        }
    };
}

/**
 * Permanently deletes a device from the system.
 * Navigates to devices page on successful deletion.
 *
 * @param deviceID - Unique identifier of the device to delete.
 */
export function deleteDeviceAPI(deviceID: number): APIDescriptor<void> {
    return {
        async call({ signal, timeout } = {}) {
            const { sucess, data } = await callAPI({
                endpoint: "/api/device/delete_device",
                method: "DELETE",
                params: { id: deviceID },
                signal,
                timeout,
            });
            if (sucess) {
                await navigateTo("/devices", {});
            }
        }
    };
}
