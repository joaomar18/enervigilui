import { get } from "svelte/store";
import type { EditableDevice, NewDevice, MeterType, DeviceHistory } from "$lib/types/device/base";
import type { EditableNodeRecord, NodeRecord } from "$lib/types/nodes/base";
import { changeNodeProtocol } from "./nodes";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { convertDateToLocalDate } from "../util/generic";



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


export function processDeviceHistory(initialDeviceHistory: DeviceHistory): DeviceHistory {
    let newDeviceHistory: DeviceHistory = {
        connection_on_datetime: convertDateToLocalDate(initialDeviceHistory.connection_on_datetime ?? ""),
        connection_off_datetime: convertDateToLocalDate(initialDeviceHistory.connection_off_datetime ?? ""),
        created_at: convertDateToLocalDate(initialDeviceHistory.created_at ?? ""),
        updated_at: convertDateToLocalDate(initialDeviceHistory.updated_at ?? ""),
    }
    return newDeviceHistory;
}