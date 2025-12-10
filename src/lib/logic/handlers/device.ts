import { get } from "svelte/store";
import type { EditableDevice, NewDevice, DeviceHistory } from "$lib/types/device/base";
import type { EditableNodeRecord } from "$lib/types/nodes/config";
import { changeNodeProtocol } from "./nodes/base";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { convertDateToLocalDate } from "../util/date";

/**
 * Handles device protocol changes by updating communication options and converting all nodes to the new protocol.
 * @param deviceData - The device configuration being edited.
 * @param nodes - Array of device nodes to update with the new protocol.
 */
export function deviceProtocolChange(deviceData: EditableDevice | NewDevice, nodes: Array<EditableNodeRecord>): void {
    let newDefaultOptions = { ...get(protocolPlugins)[deviceData.protocol].defaultOptions };
    deviceData.communication_options = newDefaultOptions;

    for (let node of nodes) {
        if (deviceData.protocol !== node.protocol && !node.config.calculated) {
            changeNodeProtocol(deviceData.protocol, node);
        }
    }

    nodes = [...nodes];
}

/**
 * Processes device history timestamps by converting them to local timezone format.
 * @param initialDeviceHistory - Raw device history data with UTC timestamps.
 * @returns DeviceHistory object with timestamps converted to local timezone.
 */
export function processDeviceHistory(initialDeviceHistory: DeviceHistory): DeviceHistory {
    let newDeviceHistory: DeviceHistory = {
        connection_on_datetime: convertDateToLocalDate(initialDeviceHistory.connection_on_datetime ?? ""),
        connection_off_datetime: convertDateToLocalDate(initialDeviceHistory.connection_off_datetime ?? ""),
        created_at: convertDateToLocalDate(initialDeviceHistory.created_at ?? ""),
        updated_at: convertDateToLocalDate(initialDeviceHistory.updated_at ?? ""),
    };
    return newDeviceHistory;
}
