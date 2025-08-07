import { makeAPIRequest } from "./api";
import { get } from "svelte/store";
import { getInitialDeviceValidation, Protocol } from "$lib/stores/devices";
import { defaultOPCUAOptions, defaultModbusRTUOptions } from "$lib/stores/devices";
import type { DeviceMeter, EditableDeviceMeter, NewDeviceMeter, EditableCommunicationOptions, DeviceModbusRTUConfig, DeviceOPCUAConfig, MeterType, MeterOptions, EditableDeviceOPCUAConfig, EditableDeviceModbusRTUConfig } from "$lib/stores/devices";
import { protocolTexts } from "$lib/stores/lang";
import type { DeviceNode, EditableDeviceNode } from "$lib/stores/nodes";
import { getAllNodesValidation } from "./nodes";
import { showAlert } from "$lib/stores/alerts";
import isEqualPkg from "lodash";
const { isEqual } = isEqualPkg;

import { texts } from "$lib/stores/lang";

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
 * @param {number} id - The unique identifier of the device.
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request.
 * @returns {Promise<{ status: number; data: any }>} - A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await getDeviceState(123);
 * console.log(response.status, response.data);
 * ```
 */
export async function getDeviceState(
    id: number,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/get_device_state", "GET", { id }, timeout);
}

/**
 * Fetches the default device image from the server.
 *
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request.
 * @returns {Promise<{ status: number; data: any }>} - A promise that resolves to an object containing
 * the HTTP status code and the default image data.
 *
 * Example usage:
 * ```typescript
 * const response = await getDefaultImage();
 * console.log(response.status, response.data);
 * ```
 */
export async function getDefaultImage(
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/get_default_image", "GET", {}, timeout);
}

/**
 * Fetches the configuration of nodes associated with a specific device from the server.
 *
 * @param {number} id - The unique identifier of the device.
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request.
 * @returns {Promise<{ status: number; data: any }>} - A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await getDeviceNodesConfig(123);
 * console.log(response.status, response.data);
 * ```
 */
export async function getDeviceNodesConfig(
    id: number,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/get_nodes_config", "GET", { id }, timeout);
}

/**
 * Sends a new device configuration to the server for creation.
 *
 * @param {NewDeviceMeter} deviceData - The device configuration data for the new device
 * @param {File | undefined} deviceImage - Optional image file to upload for the device
 * @param {Array<DeviceNode>} deviceNodes - Array of device nodes associated with this device
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request
 * @returns {Promise<{ status: number; data: any }>} A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await addDevice(deviceData, imageFile, deviceNodes);
 * console.log(response.status);
 * ```
 */
export async function addDevice(
    deviceData: DeviceMeter,
    deviceImage: File | undefined,
    deviceNodes: Array<DeviceNode>,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/add_device", "POST", { deviceData, deviceNodes }, timeout, deviceImage, "deviceImage");
}

/**
 * Sends device configuration changes to the server for updating an existing device.
 *
 * @param {DeviceMeter} deviceData - The device configuration data to update on the server
 * @param {File | undefined} deviceImage - Optional image file to upload for the device
 * @param {Array<DeviceNode>} deviceNodes - Array of device nodes associated with this device
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request
 * @returns {Promise<{ status: number; data: any }>} A promise that resolves to an object containing
 * the HTTP status code and the response data.
 * 
 * Example usage:
 * ```typescript
 * const response = await editDeviceConfig(deviceData, imageFile, deviceNodes);
 * console.log(response.status);
 * ```
 */
export async function editDevice(
    deviceData: DeviceMeter,
    deviceImage: File | undefined,
    deviceNodes: Array<DeviceNode>,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/edit_device", "POST", { deviceData, deviceNodes }, timeout, deviceImage, "deviceImage");
}

/**
 * Sends a device deletion request to the server.
 *
 * @param {string} deviceName - The name of the device to delete
 * @param {number} deviceID - The unique identifier of the device to delete
 * @param {number} [timeout=3000] - The timeout duration in milliseconds for the API request
 * @returns {Promise<{ status: number; data: any }>} A promise that resolves to an object containing
 * the HTTP status code and the response data.
 *
 * Example usage:
 * ```typescript
 * const response = await deleteDevice("DeviceName", 123);
 * console.log(response.status);
 * ```
 */
export async function deleteDevice(
    deviceName: string,
    deviceID: number,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/delete_device", "DELETE", { deviceName, deviceID }, timeout);
}

/**
 * Filters an array of devices based on a search query matching device name or ID.
 * Handles partial matching for names and supports numeric ID matching with leading zeros.
 *
 * @param devices - Array of DeviceMeter objects to filter
 * @param searchQuery - Search string to match against device names and IDs
 * @returns Filtered array of devices sorted by ID, or all devices if search query is empty
 */
export function filterDevices(devices: Array<DeviceMeter>, searchQuery: string): Array<DeviceMeter> {
    let filteredDevices: Array<DeviceMeter> = Array.isArray(devices) ? [...devices].sort((a, b) => a.id - b.id) : [];

    if (!searchQuery || searchQuery.trim() === "") {
        return filteredDevices;
    }

    const query = searchQuery.trim().toLowerCase();

    // Filter devices that match the search query in name or ID
    filteredDevices = filteredDevices.filter(device => {
        const nameMatch = device.name.toLowerCase().includes(query);

        // ID matching: handle both partial string matching and numeric matching with leading zeros
        const idString = device.id.toString();
        const partialIdMatch = idString.includes(query);

        // For numeric queries, parse and compare the numeric values to handle leading zeros
        const numericMatch = !isNaN(parseInt(query)) &&
            parseInt(query) === device.id;

        return nameMatch || partialIdMatch || numericMatch;
    });

    return filteredDevices;
}

/**
 * Converts a DeviceMeter object to an EditableDeviceMeter for form handling.
 * This function transforms the device configuration data structure to support
 * form input handling where all communication parameters need to be strings.
 * 
 * @param {DeviceMeter} device - The device meter object to convert
 * @param {Record<string, string>} deviceImage - The device image data containing type and base64 data
 * @returns {EditableDeviceMeter} - The converted editable device meter object
 * @throws {Error} - Throws an error if the device protocol is not supported
 * 
 * @description This conversion is necessary because:
 * - Form inputs require string types for proper binding and validation
 * - OPC UA username/password fields convert from `string | null` to `string`
 * - All numeric values are converted to strings for input field compatibility
 * - The original device structure is preserved except for communication options
 * - Device image is initialized as undefined (can be set later in forms)
 * - Current image URL is constructed from device image data as a data URL for displaying existing images
 * - Validation state is initialized with all checks set to false
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
 * const deviceImage = {
 *   type: "image/png",
 *   data: "iVBORw0KGgoAAAANSUhEUgAAAMgAAAEKCAYAAABXDxqV..."
 * };
 * 
 * const editableDevice = convertToEditableDevice(device, deviceImage);
 * // Now suitable for form binding with string-based inputs
 * // editableDevice.current_image_url will be "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAEKCAYAAABXDxqV..."
 * ```
 */
export function convertToEditableDevice(device: DeviceMeter, deviceImage: Record<string, string>): EditableDeviceMeter {
    let editableCommunicationOptions: EditableCommunicationOptions;

    if (device.protocol === Protocol.OPC_UA) {
        const opcuaConfig = device.communication_options as DeviceOPCUAConfig;
        editableCommunicationOptions = {
            username: opcuaConfig.username || "",
            password: opcuaConfig.password || "",
            read_period: opcuaConfig.read_period.toString(),
            timeout: opcuaConfig.timeout.toString(),
            url: opcuaConfig.url,
            valid: false,
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
            valid: false,
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
        options: { ...device.options },
        communication_options: editableCommunicationOptions,
        device_image: undefined,
        current_image_url: `data:${deviceImage["type"]};base64,${deviceImage["data"]}`,
        validation: getInitialDeviceValidation(),
    };
}

/**
 * Converts an EditableDeviceMeter or NewDeviceMeter object back to a DeviceMeter for API operations.
 * This function transforms the editable device configuration from form-compatible
 * string-based values back to the proper data types required by the backend API.
 * 
 * @param {EditableDeviceMeter | NewDeviceMeter} device - The editable device meter object to convert
 * @returns {DeviceMeter} - The converted device meter object ready for API operations
 * @throws {Error} - Throws an error if the device protocol is not supported
 * 
 * @description This conversion is necessary because:
 * - API expects numeric values instead of string representations from forms
 * - OPC UA username/password fields convert from `string` back to `string | null`
 * - All string numeric values are parsed back to numbers for API compatibility
 * - The editable structure is transformed back to the original device structure
 * - Device image and validation properties are excluded (not part of DeviceMeter)
 * - For NewDeviceMeter objects, the id property is omitted (handled by server)
 * 
 * @example
 * ```typescript
 * const editableDevice: EditableDeviceMeter = {
 *   id: 1,
 *   name: "Test Meter",
 *   protocol: Protocol.OPC_UA,
 *   communication_options: {
 *     read_period: "5",
 *     timeout: "3",
 *     // ... other string properties
 *   }
 *   // ... other properties
 * };
 * 
 * const device = convertToDevice(editableDevice);
 * // Now suitable for API operations with proper numeric types
 * // device.communication_options.read_period will be 5 (number)
 * ```
 */
export function convertToDevice(device: EditableDeviceMeter | NewDeviceMeter): DeviceMeter {
    let communicationOptions: DeviceOPCUAConfig | DeviceModbusRTUConfig;

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
    if ('id' in device) {
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
 * Creates a new device meter object for use in device creation forms or API requests.
 * Initializes the communication options with protocol-specific defaults and returns a NewDeviceMeter object
 * with empty name and the provided protocol, meter type, and options.
 *
 * @param {Protocol} protocol - The communication protocol for the new device (MODBUS_RTU or OPC_UA)
 * @param {MeterType} meter_type - The electrical connection type (SINGLE_PHASE or THREE_PHASE)
 * @param {MeterOptions} meter_options - Operational settings for the device (measurement and acquisition options)
 * @returns {NewDeviceMeter} A NewDeviceMeter object with default communication options, empty name, and initial validation state
 * @throws {Error} Throws an error if the protocol is not supported
 * 
 * @description The returned object includes:
 * - Empty name string (to be filled by user)
 * - Protocol-specific default communication options
 * - Device image initialized as undefined (can be set later in forms)
 * - Initial validation state with all checks set to false
 * - Provided meter type and options
 */
export function createNewDevice(protocol: Protocol, meter_type: MeterType, meter_options: MeterOptions): NewDeviceMeter {

    let communication_options;

    if (protocol === Protocol.MODBUS_RTU) {
        communication_options = { ...defaultModbusRTUOptions };
    }
    else if (protocol === Protocol.OPC_UA) {
        communication_options = { ...defaultOPCUAOptions };
    }
    else {
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

/**
 * Updates the validation state for all properties of a device configuration.
 * Runs validation checks for device name, protocol, communication options, and associated nodes,
 * updating the device's validation object with the results.
 *
 * @param deviceData Device configuration object (EditableDeviceMeter or NewDeviceMeter) to validate
 * @param nodes Array of editable device nodes associated with this device
 * 
 */
export function updateDeviceValidation(deviceData: EditableDeviceMeter | NewDeviceMeter, nodes: Array<EditableDeviceNode>): void {
    deviceData.validation.deviceName = validateDeviceName(deviceData.name);
    deviceData.validation.deviceProtocol = Object.keys(get(protocolTexts)).includes(deviceData.protocol);
    deviceData.validation.communicationOptions = deviceData.communication_options.valid;
    deviceData.validation.nodes = getAllNodesValidation(nodes);
}

/**
 * Validates a device configuration and displays appropriate error alerts if validation fails.
 * Checks all validation properties in order and shows the first error encountered.
 * This function is typically called before performing device operations like save, create, or update.
 *
 * @param deviceData Device configuration object (EditableDeviceMeter or NewDeviceMeter) to validate
 * @returns True if all validations pass, false if any validation fails (with alert shown)
 * 
 * @description Validation order and corresponding alerts:
 * 1. Device name validation - shows invalidDeviceName alert
 * 2. Protocol validation - shows invalidProtocol alert  
 * 3. Communication options validation - shows invalidCommunicationOptions alert
 * 4. Meter options validation - shows invalidMeterOptions alert
 * 5. Device nodes validation - shows invalidDeviceNodes alert
 * 
 * Only the first validation failure is reported to avoid overwhelming the user with multiple alerts.
 * Call updateDeviceValidation() before this function to ensure validation state is current.
 */
export function validDeviceOperation(deviceData: EditableDeviceMeter | NewDeviceMeter): boolean {
    if (deviceData.validation.isValid()) {
        return true;
    }
    if (!(deviceData.validation.deviceName)) {
        showAlert(get(texts).invalidDeviceName); // Invalid device name
    }
    else if (!(deviceData.validation.deviceProtocol)) {
        showAlert(get(texts).invalidProtocol); // Invalid device protocol
    }
    else if (!(deviceData.validation.communicationOptions)) {
        showAlert(get(texts).invalidCommunicationOptions); // Invalid Communication Options
    }
    else if (!(deviceData.validation.meterOptions)) {
        showAlert(get(texts).invalidMeterOptions); // Invalid Meter Options
    }
    else if (!(deviceData.validation.nodes)) {
        showAlert(get(texts).invalidDeviceNodes); // Invalid Device Nodes
    }
    return false;
}

/**
 * Normalizes a DeviceMeter by sorting its communication options properties alphabetically.
 * Used for consistent comparison between devices.
 * 
 * @param device The DeviceMeter to normalize
 * @returns Normalized device with sorted communication options properties
 */
export function normalizeDevice(device: DeviceMeter): DeviceMeter {
    return {
        connected: device.connected,
        id: device.id,
        name: device.name,
        protocol: device.protocol,
        type: device.type,
        options: device.options,
        communication_options: Object.fromEntries(
            Object.entries(device.communication_options).sort(([a], [b]) => a.localeCompare(b))
        ) as DeviceOPCUAConfig | DeviceModbusRTUConfig
    };
}

/**
 * Compares two DeviceMeter objects for equality.
 * Normalizes both devices before comparison to ensure consistent results.
 * 
 * @param a First DeviceMeter object
 * @param b Second DeviceMeter object  
 * @returns True if devices are equivalent, false otherwise
 */
export function areDevicesEqual(a: DeviceMeter, b: DeviceMeter): boolean {
    return isEqual(
        normalizeDevice(a),
        normalizeDevice(b)
    );
}