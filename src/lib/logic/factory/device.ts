import { get } from "svelte/store";
import { Protocol } from "$lib/types/device/base";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { MeterType } from "$lib/types/device/base";
import type {
    Device,
    EditableDevice,
    NewDevice,
    MeterOptions,
    EditableBaseCommunicationConfig,
    BaseCommunicationConfig,
} from "$lib/types/device/base";
import { getInitialDeviceValidation } from "../validation/device/base";
import { normalizeDevice } from "../util/device";


export function convertToEditableDevice(device: Device, deviceImage: Record<string, string>): EditableDevice {
    let plugin = get(protocolPlugins)[device.protocol];
    let editableCommunicationOptions: EditableBaseCommunicationConfig = plugin.convertCommOptionsToEditable(device.communication_options);

    return {
        connected: device.connected,
        id: device.id,
        name: device.name,
        protocol: device.protocol,
        type: device.type,
        options: { ...device.options },
        communication_options: editableCommunicationOptions,
        device_image: undefined,
        current_image_url: `data:${deviceImage["type"]};base64,${deviceImage["data"]}`,
        validation: getInitialDeviceValidation(),
    };
}


export function convertToDevice(device: EditableDevice | NewDevice): Device {
    let plugin = get(protocolPlugins)[device.protocol];
    let communicationOptions: BaseCommunicationConfig = plugin.convertCommOptionsToNormal(device.communication_options);

    const baseDevice = {
        name: device.name,
        protocol: device.protocol,
        type: device.type,
        options: { ...device.options },
        communication_options: communicationOptions,
    };

    // Handle different device types - EditableDeviceMeter has id and connected, NewDeviceMeter doesn't
    if ("id" in device) {
        return {
            ...baseDevice,
            connected: device.connected,
            id: device.id,
        } as Device;
    } else {
        return {
            ...baseDevice,
            connected: false,
            id: 0,
        } as Device;
    }
}


export function processInitialDevice(device: Device | NewDevice): Device {
    const baseDevice = {
        name: device.name,
        protocol: device.protocol,
        type: device.type,
        options: device.options,
        communication_options: device.communication_options,
    };

    let deviceMeter: Device;
    // Handle different device types - EditableDeviceMeter has id and connected, NewDeviceMeter doesn't
    if ("id" in device) {
        deviceMeter = {
            ...baseDevice,
            connected: device.connected,
            id: device.id,
        };
    } else {
        deviceMeter = {
            ...baseDevice,
            connected: false,
            id: 0,
        };
    }

    return normalizeDevice(deviceMeter);
}


export function createNewDevice(protocol: Protocol, meter_type: MeterType, meter_options: MeterOptions): NewDevice {
    let protocolPlugin = get(protocolPlugins)[protocol];
    let communication_options: EditableBaseCommunicationConfig = { ...protocolPlugin.defaultOptions };

    let new_device: NewDevice = {
        name: "",
        protocol: protocol,
        type: meter_type,
        options: { ...meter_options },
        communication_options: communication_options,
        device_image: undefined,
        current_image_url: undefined,
        validation: getInitialDeviceValidation(),
    };

    return new_device;
}
