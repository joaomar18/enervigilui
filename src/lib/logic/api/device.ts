import { callAPI } from "$lib/logic/api/api";
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
export async function getAllDevices(): Promise<{ devices: Array<Device> }> {
    let devices: Array<Device>;

    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_all_devices",
        method: "GET",
        setLoaded: true,
    });
    if (sucess) {
        devices = data.map((data: Device & { image: Record<string, string> }) => {
            const { ...requestDeviceData } = data as Device;
            let deviceData: Device = processInitialDevice(requestDeviceData as Device);
            return deviceData;
        }) as Array<Device>;
    } else {
        throw new Error("Get all devices error");
    }

    return { devices };
}

/**
 * Retrieves all devices objects from the server.
 * Processes device data and converts base64 images to data URLs.
 *
 * @returns Object containing processed devices array and device images mapped by ID.
 * @throws Error if the API request fails.
 */
export async function getAllDevicesWithImage(): Promise<{ devices: Array<Device>; devicesImages: Record<number, string> }> {
    let devices: Array<Device>;
    let devicesImages: Record<number, string> = {};

    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_all_devices_with_image",
        method: "GET",
        setLoaded: true,
    });
    if (sucess) {
        devices = data.map((data: Device & { image: Record<string, string> }) => {
            const { image: deviceImage, ...requestDeviceData } = data as Device & { image: Record<string, string> };
            let deviceData: Device = processInitialDevice(requestDeviceData as Device);
            devicesImages[deviceData.id] = `data:${deviceImage["type"]};base64,${deviceImage["data"]}`;
            return deviceData;
        }) as Array<Device>;
    } else {
        throw new Error("Get all devices state images error");
    }

    return { devices, devicesImages };
}

/**
 * Retrieves a specific device object with state and configuration data.
 * Returns only the initial device data without image information.
 *
 * @param id - The unique identifier of the device to retrieve.
 * @returns Object containing the initial device data.
 * @throws Error if the API request fails.
 */
export async function getDevice(id: number): Promise<{ initialDeviceData: Device }> {
    let initialDeviceData: Device;
    let deviceData: EditableDevice;
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_device",
        method: "GET",
        params: { id },
        setLoaded: true,
    });
    if (sucess) {
        const { ...requestDeviceData } = data as Device;
        initialDeviceData = processInitialDevice(requestDeviceData as Device);
    } else {
        throw new Error("Get device error");
    }

    return { initialDeviceData };
}

export async function getDeviceInfo(id: number): Promise<{ deviceInfo: DeviceInfo }> {
    let deviceInfo: DeviceInfo;
    let deviceHistory: DeviceHistory;

    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_device_info",
        method: "GET",
        params: { id },
    });
    if (sucess) {
        const { ...requestDeviceInfo } = data;
        deviceHistory = requestDeviceInfo.history as DeviceHistory;
        deviceInfo = requestDeviceInfo as DeviceInfo;
        deviceInfo.history = processDeviceHistory(deviceHistory);
    } else {
        throw new Error("Get device info error");
    }
    return { deviceInfo };
}

/**
 * Retrieves a specific device object with state and configuration data.
 * Returns both the initial device data and an editable version for modifications.
 *
 * @param id - The unique identifier of the device to retrieve.
 * @returns Object containing initial device data and editable device configuration.
 * @throws Error if the API request fails.
 */
export async function getDeviceWithImage(id: number): Promise<{ initialDeviceData: Device; deviceData: EditableDevice }> {
    let initialDeviceData: Device;
    let deviceData: EditableDevice;
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_device_with_image",
        method: "GET",
        params: { id },
        setLoaded: true,
    });
    if (sucess) {
        const { image: deviceImage, ...requestDeviceData } = data as Device & { image: Record<string, string> };
        initialDeviceData = processInitialDevice(requestDeviceData as Device);
        deviceData = convertToEditableDevice(initialDeviceData, deviceImage);
    } else {
        throw new Error("Get device with image error");
    }

    return { initialDeviceData, deviceData };
}

export async function getDeviceInfoWithImage(id: number): Promise<{ deviceInfo: DeviceInfo; deviceImageUrl: string }> {
    let deviceInfo: DeviceInfo;
    let deviceHistory: DeviceHistory;
    let deviceImageUrl: string;

    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_device_info_with_image",
        method: "GET",
        params: { id },
    });
    if (sucess) {
        const { image: requestDeviceImage, ...requestDeviceInfo } = data as DeviceInfo & { image: Record<string, string> };
        deviceHistory = requestDeviceInfo.history as DeviceHistory;
        deviceInfo = requestDeviceInfo as DeviceInfo;
        deviceInfo.history = processDeviceHistory(deviceHistory);
        deviceImageUrl = `data:${requestDeviceImage["type"]};base64,${requestDeviceImage["data"]}`;
    } else {
        throw new Error("Get device info with image error");
    }
    return { deviceInfo, deviceImageUrl };
}

/**
 * Retrieves the default device image from the server.
 * Converts base64 image data to a data URL for display.
 *
 * @returns Data URL string of the default device image.
 * @throws Error if the API request fails.
 */
export async function getDefaultImage(): Promise<string> {
    let imageData: Record<string, string>;
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_default_image",
        method: "GET",
        setLoaded: true,
    });
    if (sucess) {
        imageData = data as Record<string, string>;
    } else {
        throw new Error("Get default image error");
    }
    return `data:${imageData["type"]};base64,${imageData["data"]}`;
}

/**
 * Creates a new device with configuration data, optional image, and associated nodes.
 * Navigates to devices page on successful creation.
 *
 * @param deviceData - Complete device configuration and settings.
 * @param deviceImage - Optional image file to associate with the device.
 * @param deviceNodes - Array of nodes/variables associated with the device.
 */
export async function addDevice(deviceData: Device, deviceImage: File | undefined, deviceNodes: Array<NodeRecord>) {
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/add_device",
        method: "POST",
        params: { deviceData, deviceNodes },
        file: deviceImage,
        fileFieldName: "deviceImage",
    });
    if (sucess) {
        await navigateTo("/devices", {});
    }
}

/**
 * Updates an existing device with modified configuration data, image, and nodes.
 * Navigates to devices page on successful update.
 *
 * @param deviceData - Updated device configuration and settings.
 * @param deviceImage - Optional new image file for the device.
 * @param deviceNodes - Updated array of nodes/variables for the device.
 */
export async function editDevice(deviceData: Device, deviceImage: File | undefined, deviceNodes: Array<NodeRecord>) {
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/edit_device",
        method: "POST",
        params: { deviceData, deviceNodes },
        file: deviceImage,
        fileFieldName: "deviceImage",
    });
    if (sucess) {
        await navigateTo("/devices", {});
    }
}

/**
 * Permanently deletes a device from the system.
 * Navigates to devices page on successful deletion.
 *
 * @param deviceID - Unique identifier of the device to delete.
 */
export async function deleteDevice(deviceID: number) {
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/delete_device",
        method: "DELETE",
        params: { deviceID },
    });
    if (sucess) {
        await navigateTo("/devices", {});
    }
}
