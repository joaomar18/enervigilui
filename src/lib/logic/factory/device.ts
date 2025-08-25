import { get } from "svelte/store";
import { Protocol } from "$lib/types/device/base";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { MeterType } from "$lib/types/device/base";
import type { DeviceMeter, EditableDeviceMeter, NewDeviceMeter, MeterOptions, EditableBaseCommunicationConfig, BaseCommunicationConfig } from "$lib/types/device/base";
import type { DeviceModbusRTUConfig, EditableDeviceModbusRTUConfig } from "$lib/types/device/modbusRtu";
import type { DeviceOPCUAConfig, EditableDeviceOPCUAConfig } from "$lib/types/device/opcUa";
import { getInitialDeviceValidation } from "../validation/device/base";

/**
 * Converts DeviceMeter to EditableDeviceMeter for form handling.
 * @param device - DeviceMeter object.
 * @param deviceImage - Image data.
 * @returns EditableDeviceMeter.
 */
export function convertToEditableDevice(device: DeviceMeter, deviceImage: Record<string, string>): EditableDeviceMeter {
    let editableCommunicationOptions: EditableBaseCommunicationConfig;

    if (device.protocol === Protocol.OPC_UA) {
        const opcuaConfig = device.communication_options as DeviceOPCUAConfig;
        editableCommunicationOptions = {
            username: opcuaConfig.username || "",
            password: opcuaConfig.password || "",
            read_period: opcuaConfig.read_period.toString(),
            timeout: opcuaConfig.timeout.toString(),
            url: opcuaConfig.url,
            valid: false,
        } as EditableDeviceOPCUAConfig;
    } else if (device.protocol === Protocol.MODBUS_RTU) {
        const modbusConfig = device.communication_options as DeviceModbusRTUConfig;
        editableCommunicationOptions = {
            baudrate: modbusConfig.baudrate.toString(),
            bytesize: modbusConfig.bytesize.toString(),
            parity: modbusConfig.parity,
            port: modbusConfig.port,
            read_period: modbusConfig.read_period.toString(),
            retries: modbusConfig.retries.toString(),
            slave_id: modbusConfig.slave_id.toString(),
            stopbits: modbusConfig.stopbits.toString(),
            timeout: modbusConfig.timeout.toString(),
            valid: false,
        } as EditableDeviceModbusRTUConfig;
    } else {
        throw new Error("Unsupported Protocol");
    }

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
    let communicationOptions: BaseCommunicationConfig;

    if (device.protocol === Protocol.OPC_UA) {
        const editableConfig = device.communication_options as EditableDeviceOPCUAConfig;
        communicationOptions = {
            username: editableConfig.username || null,
            password: editableConfig.password || null,
            read_period: parseInt(editableConfig.read_period),
            timeout: parseInt(editableConfig.timeout),
            url: editableConfig.url,
        } as DeviceOPCUAConfig;
    } else if (device.protocol === Protocol.MODBUS_RTU) {
        const editableConfig = device.communication_options as EditableDeviceModbusRTUConfig;
        communicationOptions = {
            baudrate: parseInt(editableConfig.baudrate),
            bytesize: parseInt(editableConfig.bytesize),
            parity: editableConfig.parity,
            port: editableConfig.port,
            read_period: parseInt(editableConfig.read_period),
            retries: parseInt(editableConfig.retries),
            slave_id: parseInt(editableConfig.slave_id),
            stopbits: parseInt(editableConfig.stopbits),
            timeout: parseInt(editableConfig.timeout),
        } as DeviceModbusRTUConfig;
    } else {
        throw new Error("Unsupported Protocol");
    }

    const baseDevice = {
        name: device.name,
        protocol: device.protocol,
        type: device.type,
        options: { ...device.options },
        communication_options: communicationOptions,
    };

    // Handle different device types - EditableDeviceMeter has id and connected, NewDeviceMeter doesn't
    if ("id" in device) {
        // EditableDeviceMeter case
        return {
            ...baseDevice,
            connected: device.connected,
            id: device.id,
        } as DeviceMeter;
    } else {
        // NewDeviceMeter case - assume defaults for server-assigned properties
        return {
            ...baseDevice,
            connected: false, // New devices start disconnected
            id: 0, // Will be assigned by server
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
    let communication_options: EditableBaseCommunicationConfig;
    let protocolPlugin = get(protocolPlugins)[protocol];

    if (protocolPlugin) {
        communication_options = { ...(protocolPlugin.defaultOptions) };
    } else {
        throw new Error("Unsupported Protocol");
    }

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
