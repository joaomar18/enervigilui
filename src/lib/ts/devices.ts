import { makeAPIRequest } from "./api";
import { Protocol } from "$lib/stores/devices";
import type { DeviceMeter, EditableDeviceMeter, EditableCommunicationOptions, OPCUAConfig, ModbusRTUConfig } from "$lib/stores/devices";

/**
 * Fetches the state and configuration of a specific device from the server.
 *
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request.
 * @returns {Promise<{ status: number; data: any }>} - A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await getAllDevicesState();
 * console.log(response.status, response.data);
 * ```
 */
export async function getAllDevicesState(
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/get_all_device_state", "GET", {}, timeout);
}

/**
 * Fetches the state and configuration of a specific device from the server.
 *
 * @param {string} name - The name of the device.
 * @param {number} id - The unique identifier of the device.
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request.
 * @returns {Promise<{ status: number; data: any }>} - A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await getDeviceState("DeviceName", 123);
 * console.log(response.status, response.data);
 * ```
 */
export async function getDeviceState(
    name: string,
    id: number,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/get_device_state", "GET", { name, id }, timeout);
}

/**
 * Fetches the configuration of nodes associated with a specific device from the server.
 *
 * @param {string} name - The name of the device.
 * @param {number} id - The unique identifier of the device.
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request.
 * @returns {Promise<{ status: number; data: any }>} - A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await getDeviceNodesConfig("DeviceName", 123);
 * console.log(response.status, response.data);
 * ```
 */
export async function getDeviceNodesConfig(
    name: string,
    id: number,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/get_nodes_config", "GET", { name, id }, timeout);
}

/**
 * Converts a DeviceMeter object to an EditableDeviceMeter for form handling.
 * This function transforms the device configuration data structure to support
 * form input handling where all communication parameters need to be strings.
 * 
 * @param {DeviceMeter} device - The device meter object to convert
 * @returns {EditableDeviceMeter} - The converted editable device meter object
 * @throws {Error} - Throws an error if the device protocol is not supported
 * 
 * @description This conversion is necessary because:
 * - Form inputs require string types for proper binding and validation
 * - OPC UA username/password fields convert from `string | null` to `string`
 * - All numeric values are converted to strings for input field compatibility
 * - The original device structure is preserved except for communication options
 * 
 * @example
 * ```typescript
 * const device: DeviceMeter = {
 *   id: 1,
 *   name: "Test Meter",
 *   protocol: Protocol.OPC_UA,
 *   // ... other properties
 * };
 * 
 * const editableDevice = convertToEditableDevice(device);
 * // Now suitable for form binding with string-based inputs
 * ```
 */
export function convertToEditableDevice(device: DeviceMeter): EditableDeviceMeter {
    let editableCommunicationOptions: EditableCommunicationOptions;

    if (device.protocol === Protocol.OPC_UA) {
        const opcuaConfig = device.communication_options as OPCUAConfig;
        editableCommunicationOptions = {
            username: opcuaConfig.username || "",
            password: opcuaConfig.password || "",
            read_period: opcuaConfig.read_period.toString(),
            timeout: opcuaConfig.timeout.toString(),
            url: opcuaConfig.url,
        };
    } else if (device.protocol === Protocol.MODBUS_RTU) {
        const modbusConfig = device.communication_options as ModbusRTUConfig;
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
        };
    } else {
        throw new Error("Unsupported Protocol");
    }

    return {
        connected: device.connected,
        id: device.id,
        name: device.name,
        protocol: device.protocol,
        type: device.type,
        options: device.options,
        communication_options: editableCommunicationOptions,
    };
}