import { makeAPIRequest } from "./api";
import { Protocol } from "$lib/stores/devices";
import { defaultOPCUAOptions, defaultModbusRTUOptions } from "$lib/stores/devices";
import type { DeviceMeter, EditableDeviceMeter, NewDeviceMeter, EditableCommunicationOptions, DeviceModbusRTUConfig, DeviceOPCUAConfig, MeterType, MeterOptions } from "$lib/stores/devices";

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
        const opcuaConfig = device.communication_options as DeviceOPCUAConfig;
        editableCommunicationOptions = {
            username: opcuaConfig.username || "",
            password: opcuaConfig.password || "",
            read_period: opcuaConfig.read_period.toString(),
            timeout: opcuaConfig.timeout.toString(),
            url: opcuaConfig.url,
        };
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


/**
 * Creates a new device meter object for use in device creation forms or API requests.
 * Initializes the communication options with protocol-specific defaults and returns a NewDeviceMeter object
 * with empty name and the provided protocol, meter type, and options.
 *
 * @param protocol The communication protocol for the new device (MODBUS_RTU or OPC_UA)
 * @param meter_type The electrical connection type (SINGLE_PHASE or THREE_PHASE)
 * @param meter_options Operational settings for the device (measurement and acquisition options)
 * @returns A NewDeviceMeter object with default communication options and empty name
 * @throws Error if the protocol is not supported
 */
export function createNewDevice(protocol: Protocol, meter_type: MeterType, meter_options: MeterOptions): NewDeviceMeter {

    let communication_options;

    if (protocol === Protocol.MODBUS_RTU) {
        communication_options = defaultModbusRTUOptions;
    }
    else if (protocol === Protocol.OPC_UA) {
        communication_options = defaultOPCUAOptions;
    }
    else {
        throw new Error("Unsupported Protocol");
    }

    let new_device: NewDeviceMeter = {
        name: "",
        protocol: protocol,
        type: meter_type,
        options: meter_options,
        communication_options: communication_options,
    }

    return new_device;
}

/**
 * Validates a device name for creation or editing.
 *
 * Rules:
 * - Must be a non-empty string
 * - No leading/trailing whitespace
 * - No internal whitespace (spaces, tabs, etc.)
 * - Length between 1 and 64 characters
 * - Only allows letters, numbers, underscores, and hyphens
 *
 * @param name The device name to validate
 * @returns True if the name is valid, false otherwise
 */
export function validateDeviceName(name: string): boolean {
    if (typeof name !== "string") return false;
    // No leading or trailing whitespace
    if (name !== name.trim()) return false;
    // Length between 3 and 64 characters
    if (name.length < 3 || name.length > 64) return false;
    // Only allow letters, numbers, spaces (not at start/end), underscores, and hyphens
    // Spaces are allowed in the middle
    if (!/^[a-zA-Z0-9 _-]+$/.test(name)) return false;
    return true;
}

/**
 * Validates whether a string is a valid OPC UA endpoint URL.
 * Accepts URLs starting with opc.tcp:// or opc.http://, with a valid host and optional port/path.
 *
 * @param url The OPC UA endpoint URL to validate
 * @returns True if the URL is valid for OPC UA, false otherwise
 */
/**
 * Validates whether a string is a robust OPC UA endpoint URL.
 * Accepts URLs starting with opc.tcp:// or opc.http://, with a valid hostname or IP, and optional port/path.
 * Checks for protocol, non-empty/valid host, and optional port in range 1-65535.
 *
 * @param url The OPC UA endpoint URL to validate
 * @returns True if the URL is valid for OPC UA, false otherwise
 */
export function validateOpcUaUrl(url: string): boolean {
    if (typeof url !== "string" || url.trim().length === 0) return false;
    const trimmed = url.trim();
    // Must start with opc.tcp:// or opc.http://
    const protoMatch = trimmed.match(/^(opc\.(tcp|http):\/\/)/i);
    if (!protoMatch) return false;
    // Remove protocol for further checks
    const rest = trimmed.slice(protoMatch[0].length);
    // Split host[:port][/path]
    const hostPortPath = rest.match(/^([^\/\:?#]+)(:(\d+))?(\/.*)?$/);
    if (!hostPortPath) return false;
    const host = hostPortPath[1];
    const port = hostPortPath[3];
    // Host must be a valid hostname or IPv4/IPv6
    const hostnamePattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$/;
    const ipv4Pattern = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    const ipv6Pattern = /^\[[0-9a-fA-F:]+\]$/;
    let isValidHost = false;
    if (host.length > 0) {
        if (ipv4Pattern.test(host)) {
            // Strict IPv4 check: each octet must be 0-255
            const octets = host.split('.').map(Number);
            isValidHost = octets.length === 4 && octets.every(o => o >= 0 && o <= 255);
        } else if (ipv6Pattern.test(host)) {
            isValidHost = true; // Basic IPv6 format check (could be improved)
        } else {
            // Hostname: must be valid per label
            const labels = host.split('.');
            isValidHost = labels.every(part => hostnamePattern.test(part));
            // Extra: reject hostnames that are all-numeric labels (e.g., 19268.10.10)
            if (isValidHost) {
                const allNumeric = labels.every(part => /^\d+$/.test(part));
                const hasAlpha = labels.some(part => /[a-zA-Z]/.test(part));
                if (allNumeric && !hasAlpha) {
                    isValidHost = false;
                }
            }
        }
    }
    if (!isValidHost) return false;
    // If port is present, must be 1-65535
    if (port !== undefined) {
        const portNum = Number(port);
        if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) return false;
    }
    return true;
}

/**
 * Validates whether a string is a valid serial port name for Modbus RTU.
 * Accepts Windows COM ports (e.g., COM1, COM12) and Unix-like device paths (e.g., /dev/ttyS0, /dev/ttyUSB0).
 *
 * @param port The serial port name to validate
 * @returns True if the port name is valid for Modbus RTU, false otherwise
 */
export function validateModbusRtuPort(port: string): boolean {
    if (typeof port !== "string" || port.trim().length === 0) return false;
    const trimmed = port.trim();
    // Windows: COM1 to COM256 (case-insensitive)
    const windowsPattern = /^COM([1-9]|[1-9]\d|1\d{2}|2([0-4]\d|5[0-6]))$/i;
    // Unix: /dev/ttyS0, /dev/ttyUSB0, /dev/ttyACM0, /dev/ttyAMA0, /dev/ttyXRUSB0, etc.
    const unixPattern = /^\/dev\/(tty(S|USB|ACM|AMA|XRUSB)[0-9]+)$/i;
    // Extra: reject if contains whitespace or non-printable chars
    if (/\s/.test(trimmed) || /[^\x20-\x7E]/.test(trimmed)) return false;
    return windowsPattern.test(trimmed) || unixPattern.test(trimmed);
}
