import { get } from "svelte/store";
import type { DeviceMeter, EditableDeviceMeter, NewDeviceMeter } from "$lib/stores/devices";
import type { EditableDeviceNode } from "$lib/stores/nodes";
import { normalizeDevice } from "$lib/ts/util/device";
import { getAllNodesValidation } from "$lib/ts/validation/nodes";
import { showAlert } from "$lib/ts/view/notification";
import { texts, protocolTexts } from "$lib/stores/lang";
import isEqualPkg from "lodash";
const { isEqual } = isEqualPkg;

/**
 * Validates a device name.
 * @param name - Device name.
 * @returns True if valid.
 */
export function validateDeviceName(name: string): boolean {
    if (typeof name !== "string") return false;
    if (name !== name.trim()) return false;
    if (name.length < 3 || name.length > 64) return false;
    if (!/^[a-zA-Z0-9 _-]+$/.test(name)) return false;
    return true;
}

/**
 * Validates an OPC UA endpoint URL.
 * @param url - Endpoint URL.
 * @returns True if valid.
 */
export function validateOpcUaUrl(url: string): boolean {
    if (typeof url !== "string" || url.trim().length === 0) return false;
    const trimmed = url.trim();
    const protoMatch = trimmed.match(/^(opc\.(tcp|http):\/\/)/i);
    if (!protoMatch) return false;
    const rest = trimmed.slice(protoMatch[0].length);
    const hostPortPath = rest.match(/^([^\/\:?#]+)(:(\d+))?(\/.*)?$/);
    if (!hostPortPath) return false;
    const host = hostPortPath[1];
    const port = hostPortPath[3];
    const hostnamePattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$/;
    const ipv4Pattern = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    const ipv6Pattern = /^\[[0-9a-fA-F:]+\]$/;
    let isValidHost = false;
    if (host.length > 0) {
        if (ipv4Pattern.test(host)) {
            const octets = host.split(".").map(Number);
            isValidHost = octets.length === 4 && octets.every((o) => o >= 0 && o <= 255);
        } else if (ipv6Pattern.test(host)) {
            isValidHost = true;
        } else {
            const labels = host.split(".");
            isValidHost = labels.every((part) => hostnamePattern.test(part));
            if (isValidHost) {
                const allNumeric = labels.every((part) => /^\d+$/.test(part));
                const hasAlpha = labels.some((part) => /[a-zA-Z]/.test(part));
                if (allNumeric && !hasAlpha) {
                    isValidHost = false;
                }
            }
        }
    }
    if (!isValidHost) return false;
    if (port !== undefined) {
        const portNum = Number(port);
        if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) return false;
    }
    return true;
}

/**
 * Validates a Modbus RTU serial port name.
 * @param port - Serial port name.
 * @returns True if valid.
 */
export function validateModbusRtuPort(port: string): boolean {
    if (typeof port !== "string" || port.trim().length === 0) return false;
    const trimmed = port.trim();
    const windowsPattern = /^COM([1-9]|[1-9]\d|1\d{2}|2([0-4]\d|5[0-6]))$/i;
    const unixPattern = /^\/dev\/(tty(S|USB|ACM|AMA|XRUSB)[0-9]+)$/i;
    if (/\s/.test(trimmed) || /[^\x20-\x7E]/.test(trimmed)) return false;
    return windowsPattern.test(trimmed) || unixPattern.test(trimmed);
}

/**
 * Updates device validation state.
 * @param deviceData - Device config.
 * @param nodes - Associated nodes.
 */
export function updateDeviceValidation(deviceData: EditableDeviceMeter | NewDeviceMeter, nodes: Array<EditableDeviceNode>): void {
    deviceData.validation.deviceName = validateDeviceName(deviceData.name);
    deviceData.validation.deviceProtocol = Object.keys(get(protocolTexts)).includes(deviceData.protocol);
    deviceData.validation.communicationOptions = deviceData.communication_options.valid;
    deviceData.validation.nodes = getAllNodesValidation(nodes);
}

/**
 * Validates device config and shows error alerts.
 * @param deviceData - Device config.
 * @returns True if valid, else false.
 */
export function validDeviceOperation(deviceData: EditableDeviceMeter | NewDeviceMeter): boolean {
    if (deviceData.validation.isValid()) {
        return true;
    }
    if (!deviceData.validation.deviceName) {
        showAlert(get(texts).invalidDeviceName); // Invalid device name
    } else if (!deviceData.validation.deviceProtocol) {
        showAlert(get(texts).invalidProtocol); // Invalid device protocol
    } else if (!deviceData.validation.communicationOptions) {
        showAlert(get(texts).invalidCommunicationOptions); // Invalid Communication Options
    } else if (!deviceData.validation.meterOptions) {
        showAlert(get(texts).invalidMeterOptions); // Invalid Meter Options
    } else if (!deviceData.validation.nodes) {
        showAlert(get(texts).invalidDeviceNodes); // Invalid Device Nodes
    }
    return false;
}

/**
 * Compares two DeviceMeter objects for equality.
 * @param a - First device.
 * @param b - Second device.
 * @returns True if equal.
 */
export function areDevicesEqual(a: DeviceMeter, b: DeviceMeter): boolean {
    return isEqual(normalizeDevice(a), normalizeDevice(b));
}
