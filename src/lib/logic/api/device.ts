import { callAPI } from "$lib/logic/api/api";
import type { DeviceMeter, EditableDeviceMeter } from "$lib/types/device/base";
import type { DeviceNode } from "$lib/types/nodes/base";
import { processInitialDevice, convertToEditableDevice } from "../factory/device";
import { navigateTo } from "../view/navigation";

export async function getAllDevicesState(): Promise<{ devices: Array<DeviceMeter>; devicesImages: Record<number, string> }> {
    let devices: Array<DeviceMeter>;
    let devicesImages: Record<number, string> = {};

    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_all_devices_state",
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
        throw new Error("Get all devices state error");
    }

    return { devices, devicesImages };
}

export async function getDeviceState(id: number): Promise<{ initialDeviceData: DeviceMeter; deviceData: EditableDeviceMeter }> {
    let initialDeviceData: DeviceMeter;
    let deviceData: EditableDeviceMeter;
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/get_device_state",
        method: "GET",
        params: { id },
        setLoaded: true,
    });
    if (sucess) {
        const { image: deviceImage, ...requestDeviceData } = data as DeviceMeter & { image: Record<string, string> };
        initialDeviceData = processInitialDevice(requestDeviceData as DeviceMeter);
        deviceData = convertToEditableDevice(initialDeviceData, deviceImage);
    } else {
        throw new Error("Get device state error");
    }

    return { initialDeviceData, deviceData };
}

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
    return data;
}

export async function deleteDevice(deviceName: string, deviceID: number) {
    const { sucess, data } = await callAPI({
        endpoint: "/api/device/delete_device",
        method: "DELETE",
        params: { deviceName, deviceID },
    });
    if (sucess) {
        await navigateTo("/devices", {});
    }
    return data;
}
