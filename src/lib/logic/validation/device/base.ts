import { get } from "svelte/store";
import type { DeviceValidation, DeviceMeter, EditableDeviceMeter, NewDeviceMeter } from "$lib/types/device/base";
import type { EditableDeviceNode } from "$lib/types/nodes/base";
import { normalizeDevice } from "$lib/logic/util/device";
import { getAllNodesValidation } from "../nodes/base";
import { showToast } from "$lib/logic/view/toast";
import { ToastType } from "$lib/stores/view/toast";
import { protocolTexts } from "$lib/stores/lang/energyMeterTexts";
import isEqualPkg from "lodash";
const { isEqual } = isEqualPkg;

/**
 * Creates and returns a new DeviceValidation object with all validation properties set to false.
 * Used to initialize the validation state for new devices or reset validation during editing.
 *
 * @returns {DeviceValidation} A fresh validation object with all checks set to false
 */
export function getInitialDeviceValidation(): DeviceValidation {
    return {
        deviceName: false,
        deviceProtocol: false,
        communicationOptions: false,
        meterOptions: false,
        nodes: false,
        isValid() {
            return this.deviceName && this.deviceProtocol && this.communicationOptions && this.meterOptions && this.nodes;
        },
    };
}

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
        showToast("invalidDeviceName", ToastType.ALERT); // Invalid device name
    } else if (!deviceData.validation.deviceProtocol) {
        showToast("invalidProtocol", ToastType.ALERT); // Invalid device protocol
    } else if (!deviceData.validation.communicationOptions) {
        showToast("invalidCommunicationOptions", ToastType.ALERT); // Invalid Communication Options
    } else if (!deviceData.validation.meterOptions) {
        showToast("invalidMeterOptions", ToastType.ALERT); // Invalid Meter Options
    } else if (!deviceData.validation.nodes) {
        showToast("invalidDeviceNodes", ToastType.ALERT); // Invalid Device Nodes
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
    //console.log("Debug, Devices are equal: ", isEqual(normalizeDevice(a), normalizeDevice(b)));
    return isEqual(normalizeDevice(a), normalizeDevice(b));
}
