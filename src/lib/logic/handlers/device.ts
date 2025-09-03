import { get } from "svelte/store";
import type { EditableDeviceMeter, NewDeviceMeter } from "$lib/types/device/base";
import type { EditableDeviceNode } from "$lib/types/nodes/base";
import { changeNodeProtocol } from "./nodes";
import { protocolPlugins } from "$lib/stores/device/protocol";

/**
 * Updates device communication options and synchronizes protocol for all nodes when device protocol changes.
 * @param deviceData Editable device or New device meter object.
 * @param nodes Array of editable device nodes.
 */
export function deviceProtocolChange(deviceData: EditableDeviceMeter | NewDeviceMeter, nodes: Array<EditableDeviceNode>): void {
    let newDefaultOptions = { ...get(protocolPlugins)[deviceData.protocol].defaultOptions };
    deviceData.communication_options = newDefaultOptions;

    for (let node of nodes) {
        if (deviceData.protocol !== node.protocol && !node.config.calculated) {
            changeNodeProtocol(deviceData.protocol, node);
        }
    }

    nodes = [...nodes];
}
