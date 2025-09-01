import { get } from "svelte/store";
import { Protocol } from "$lib/types/device/base";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { MeterType } from "$lib/types/device/base";
import type {
    DeviceMeter,
    EditableDeviceMeter,
    NewDeviceMeter,
    MeterOptions,
    EditableBaseCommunicationConfig,
    BaseCommunicationConfig,
} from "$lib/types/device/base";
import { getInitialDeviceValidation } from "../validation/device/base";

/**
 * Converts DeviceMeter to EditableDeviceMeter for form handling.
 * @param device - DeviceMeter object.
 * @param deviceImage - Image data.
 * @returns EditableDeviceMeter.
 */
export function convertToEditableDevice(device: DeviceMeter, deviceImage: Record<string, string>): EditableDeviceMeter {
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

/**
 * Converts EditableDeviceMeter/NewDeviceMeter to DeviceMeter for API.
 * @param device - EditableDeviceMeter or NewDeviceMeter.
 * @returns DeviceMeter.
 */
export function convertToDevice(device: EditableDeviceMeter | NewDeviceMeter): DeviceMeter {
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
        } as DeviceMeter;
    } else {
        return {
            ...baseDevice,
            connected: false,
            id: 0,
        } as DeviceMeter;
    }
}

/**
 * Processes initial data for a device, normalizing it into a DeviceMeter object for backend/API use.
 * Handles both DeviceMeter and NewDeviceMeter types.
 * @param device Initial device data object.
 * @returns Normalized DeviceMeter object.
 */
export function processInitialDevice(device: DeviceMeter | NewDeviceMeter): DeviceMeter {
    const baseDevice = {
        name: device.name,
        protocol: device.protocol,
        type: device.type,
        options: device.options,
        communication_options: device.communication_options,
    };

    // Handle different device types - EditableDeviceMeter has id and connected, NewDeviceMeter doesn't
    if ("id" in device) {
        return {
            ...baseDevice,
            connected: device.connected,
            id: device.id,
        } as DeviceMeter;
    } else {
        return {
            ...baseDevice,
            connected: false,
            id: 0,
        } as DeviceMeter;
    }
}

/**
 * Creates a new device meter object with protocol defaults.
 * @param protocol - Device protocol.
 * @param meter_type - Meter type.
 * @param meter_options - Meter options.
 * @returns NewDeviceMeter.
 */
export function createNewDevice(protocol: Protocol, meter_type: MeterType, meter_options: MeterOptions): NewDeviceMeter {
    let protocolPlugin = get(protocolPlugins)[protocol];
    let communication_options: EditableBaseCommunicationConfig = { ...protocolPlugin.defaultOptions };

    let new_device: NewDeviceMeter = {
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
