import { callAPI } from "$lib/logic/api/api";
import type { DeviceMeter, EditableDeviceMeter } from "$lib/types/device/base";
import type { DeviceNode } from "$lib/types/nodes/base";
import { processInitialDevice, convertToEditableDevice } from "../factory/device";
import { navigateTo } from "../view/navigation";

/**
 * Retrieves all devices and their current state from the server.
 * Processes device data without including images for faster loading.
 *
 * @returns Object containing array of processed device data.
 * @throws Error if the API request fails.
 */
export async function getAllDevicesState(): Promise<{ devices: Array<DeviceMeter> }> {
    let devices: Array<DeviceMeter>;

    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_all_devices_state",
        method: "GET",
        setLoaded: true,
    });
    if (sucess) {
        devices = data.map((data: DeviceMeter & { image: Record<string, string> }) => {
            const { ...requestDeviceData } = data as DeviceMeter;
            let deviceData: DeviceMeter = processInitialDevice(requestDeviceData as DeviceMeter);
            return deviceData;
        }) as Array<DeviceMeter>;
    } else {
        throw new Error("Get all devices state error");
    }

    return { devices };
}

/**
 * Retrieves all devices and their current state from the server.
 * Processes device data and converts base64 images to data URLs.
 *
 * @returns Object containing processed devices array and device images mapped by ID.
 * @throws Error if the API request fails.
 */
export async function getAllDevicesStateWithImage(): Promise<{ devices: Array<DeviceMeter>; devicesImages: Record<number, string> }> {
    let devices: Array<DeviceMeter>;
    let devicesImages: Record<number, string> = {};

    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_all_devices_state_with_image",
        method: "GET",
        setLoaded: true,
    });
    if (sucess) {
        devices = data.map((data: DeviceMeter & { image: Record<string, string> }) => {
            const { image: deviceImage, ...requestDeviceData } = data as DeviceMeter & { image: Record<string, string> };
            let deviceData: DeviceMeter = processInitialDevice(requestDeviceData as DeviceMeter);
            devicesImages[deviceData.id] = `data:${deviceImage["type"]};base64,${deviceImage["data"]}`;
            return deviceData;
        }) as Array<DeviceMeter>;
    } else {
        throw new Error("Get all devices state with images error");
    }

    return { devices, devicesImages };
}

/**
 * Retrieves a specific device's state and configuration data.
 * Returns only the initial device data without image information.
 *
 * @param id - The unique identifier of the device to retrieve.
 * @returns Object containing the initial device data.
 * @throws Error if the API request fails.
 */
export async function getDeviceState(id: number): Promise<{ initialDeviceData: DeviceMeter }> {
    let initialDeviceData: DeviceMeter;
    let deviceData: EditableDeviceMeter;
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_device_state",
        method: "GET",
        params: { id },
        setLoaded: true,
    });
    if (sucess) {
        const { ...requestDeviceData } = data as DeviceMeter;
        initialDeviceData = processInitialDevice(requestDeviceData as DeviceMeter);
    } else {
        throw new Error("Get device state error");
    }

    return { initialDeviceData };
}

export async function getDeviceInfo(id: number): Promise<any> {
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_device_info",
        method: "GET",
        params: { id },
    });
    if (sucess) {
        return data;
    }
    else {
        throw new Error("Get device info error");
    }
}

/**
 * Retrieves a specific device's state and configuration data.
 * Returns both the initial device data and an editable version for modifications.
 *
 * @param id - The unique identifier of the device to retrieve.
 * @returns Object containing initial device data and editable device configuration.
 * @throws Error if the API request fails.
 */
export async function getDeviceStateWithImage(id: number): Promise<{ initialDeviceData: DeviceMeter; deviceData: EditableDeviceMeter }> {
    let initialDeviceData: DeviceMeter;
    let deviceData: EditableDeviceMeter;
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_device_state_with_image",
        method: "GET",
        params: { id },
        setLoaded: true,
    });
    if (sucess) {
        const { image: deviceImage, ...requestDeviceData } = data as DeviceMeter & { image: Record<string, string> };
        initialDeviceData = processInitialDevice(requestDeviceData as DeviceMeter);
        deviceData = convertToEditableDevice(initialDeviceData, deviceImage);
    } else {
        throw new Error("Get device state with image error");
    }

    return { initialDeviceData, deviceData };
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
export async function addDevice(deviceData: DeviceMeter, deviceImage: File | undefined, deviceNodes: Array<DeviceNode>) {
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
export async function editDevice(deviceData: DeviceMeter, deviceImage: File | undefined, deviceNodes: Array<DeviceNode>) {
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
 * @param deviceName - Name of the device to delete (for confirmation).
 * @param deviceID - Unique identifier of the device to delete.
 */
export async function deleteDevice(deviceName: string, deviceID: number) {
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/delete_device",
        method: "DELETE",
        params: { deviceName, deviceID },
    });
    if (sucess) {
        await navigateTo("/devices", {});
    }
}
