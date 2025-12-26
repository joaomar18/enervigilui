import { APICaller } from "$lib/logic/api/api";
import type { APIDescriptor } from "$lib/logic/api/api";
import type { Device, EditableDevice, DeviceHistory, DeviceInfo } from "$lib/types/device/base";
import type { NodeRecord } from "$lib/types/nodes/config";
import { processInitialDevice, convertToEditableDevice } from "../factory/device";
import { processDeviceHistory } from "../handlers/device";
import { navigateTo } from "../view/navigation";

/**
 * Retrieves all devices with their initial state and configuration.
 * Device images are excluded to reduce payload size and improve load time.
 *
 * @returns Object containing an array of processed devices, or null on failure.
 */
export function getAllDevicesAPI(): APIDescriptor<{ devices: Array<Device> } | null> {
    return {
        async call({ signal, timeout } = {}) {
            let devices: Array<Device>;

            const { sucess, data } = await APICaller.callAPI({
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
                return null;
            }

            return { devices };
        }
    };
}

/**
 * Retrieves all devices including their associated images.
 * Converts base64 image data into data URLs mapped by device ID.
 *
 * @returns Object containing processed devices and a map of device images, or null on failure.
 */
export function getAllDevicesWithImageAPI(): APIDescriptor<{ devices: Array<Device>; devicesImages: Record<number, string> } | null> {
    return {
        async call({ signal, timeout } = {}) {
            let devices: Array<Device>;
            let devicesImages: Record<number, string> = {};

            const { sucess, data } = await APICaller.callAPI({
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
                return null;
            }

            return { devices, devicesImages };
        }
    };
}

/**
 * Retrieves a single device with its initial configuration and state.
 * Image data is excluded.
 *
 * @param id - Device identifier.
 * @returns Object containing initial device data, or null on failure.
 */
export function getDeviceAPI(id: number): APIDescriptor<{ initialDeviceData: Device } | null> {
    return {
        async call({ signal, timeout } = {}) {
            let initialDeviceData: Device;
            const { sucess, data } = await APICaller.callAPI({
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
                return null;
            }

            return { initialDeviceData };
        }
    };
}

/**
 * Retrieves detailed device metadata along with processed historical data.
 *
 * @param id - Device identifier.
 * @returns Object containing device information and history, or null on failure.
 */
export function getDeviceInfoAPI(id: number): APIDescriptor<{ deviceInfo: DeviceInfo } | null> {
    return {
        async call({ signal, timeout } = {}) {
            let deviceInfo: DeviceInfo;
            let deviceHistory: DeviceHistory;

            const { sucess, data } = await APICaller.callAPI({
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
                return null;
            }
            return { deviceInfo };
        }
    };
}

/**
 * Retrieves a device including its image and editable configuration data.
 *
 * @param id - Device identifier.
 * @returns Object containing initial and editable device data, or null on failure.
 */
export function getDeviceWithImageAPI(id: number): APIDescriptor<{ initialDeviceData: Device; deviceData: EditableDevice } | null> {
    return {
        async call({ signal, timeout } = {}) {
            let initialDeviceData: Device;
            let deviceData: EditableDevice;
            const { sucess, data } = await APICaller.callAPI({
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
                return null;
            }

            return { initialDeviceData, deviceData };
        }
    };
}

/**
 * Retrieves detailed device information including image and processed history.
 *
 * @param id - Device identifier.
 * @returns Object containing device info and image URL, or null on failure.
 */
export function getDeviceInfoWithImageAPI(id: number): APIDescriptor<{ deviceInfo: DeviceInfo; deviceImageUrl: string } | null> {
    return {
        async call({ signal, timeout } = {}) {
            let deviceInfo: DeviceInfo;
            let deviceHistory: DeviceHistory;
            let deviceImageUrl: string;

            const { sucess, data } = await APICaller.callAPI({
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
                return null;
            }
            return { deviceInfo, deviceImageUrl };
        }
    };
}

/**
 * Retrieves the system default device image.
 * Converts the image data into a display-ready data URL.
 *
 * @returns Default device image URL, or null on failure.
 */
export function getDefaultImageAPI(): APIDescriptor<string | null> {
    return {
        async call({ signal, timeout } = {}) {
            let imageData: Record<string, string>;
            const { sucess, data } = await APICaller.callAPI({
                endpoint: "/api/device/get_default_image",
                method: "GET",
                setLoaded: true,
                signal,
                timeout,
            });
            if (sucess) {
                imageData = data as Record<string, string>;
            } else {
                return null;
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
            const { sucess, data } = await APICaller.callAPI({
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
            const { sucess, data } = await APICaller.callAPI({
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
            const { sucess, data } = await APICaller.callAPI({
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
