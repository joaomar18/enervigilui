import { get } from "svelte/store";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { MeterType, Protocol } from "$lib/types/device/base";
import { NodePrefix, NodePhase } from "$lib/types/nodes/base";
import type { BaseNodeConfig, EditableBaseNodeConfig, DeviceNode, EditableDeviceNode } from "$lib/types/nodes/base";

/**
 * Sorts nodes alphabetically by display name (without prefix).
 * @param nodes Array of nodes.
 * @returns Sorted array.
 */
export function sortNodesByName(nodes: Array<EditableDeviceNode | DeviceNode>): Array<EditableDeviceNode | DeviceNode> {
    return nodes.sort((a, b) => removePrefix(a.name).localeCompare(removePrefix(b.name)));
}

/**
 * Gets index of a node in an array.
 * @param node Node to find.
 * @param nodesArray Array of nodes.
 * @returns Index or -1.
 */
export function getNodeIndex(node: EditableDeviceNode, nodesArray: Array<EditableDeviceNode>): number {
    return nodesArray.findIndex((n) => n === node);
}

/**
 * Gets node phase from name and meter type.
 * @param name Node name.
 * @param meter_type Meter type.
 * @returns Node phase.
 */
export function getNodePhase(name: string, meter_type: MeterType): NodePhase {
    if (meter_type === MeterType.SINGLE_PHASE) {
        return NodePhase.SINGLEPHASE;
    } else if (meter_type === MeterType.THREE_PHASE) {
        if (name.startsWith(NodePrefix.L1) && !name.startsWith(NodePrefix.L1_L2) && !name.startsWith(NodePrefix.L1_L3)) {
            return NodePhase.L1;
        } else if (name.startsWith(NodePrefix.L2) && !name.startsWith(NodePrefix.L2_L1) && !name.startsWith(NodePrefix.L2_L3)) {
            return NodePhase.L2;
        } else if (name.startsWith(NodePrefix.L3) && !name.startsWith(NodePrefix.L3_L1) && !name.startsWith(NodePrefix.L3_L2)) {
            return NodePhase.L3;
        } else if (name.startsWith(NodePrefix.TOTAL)) {
            return NodePhase.TOTAL;
        } else {
            return NodePhase.GENERAL;
        }
    } else {
        throw new Error(`Invalid meter type ${meter_type}`);
    }
}

/**
 * Maps NodePhase to prefix string.
 * @param phase NodePhase.
 * @returns Prefix string.
 */
export function getNodePrefix(phase: NodePhase): string {
    switch (phase) {
        case NodePhase.L1:
            return NodePrefix.L1;
        case NodePhase.L2:
            return NodePrefix.L2;
        case NodePhase.L3:
            return NodePrefix.L3;
        case NodePhase.TOTAL:
            return NodePrefix.TOTAL;
        case NodePhase.GENERAL:
            return NodePrefix.GENERAL;
        case NodePhase.SINGLEPHASE:
            return NodePrefix.SINGLEPHASE;
        default:
            return "";
    }
}

/**
 * Removes prefix from node name.
 * @param name Node name.
 * @returns Name without prefix.
 */
export function removePrefix(name: string): string {
    const prefixes = Object.values(NodePrefix).sort((a, b) => b.length - a.length);

    for (const prefix of prefixes) {
        if (name.startsWith(prefix)) {
            if (name.startsWith(NodePrefix.L1) && !name.startsWith(NodePrefix.L1_L2) && !name.startsWith(NodePrefix.L1_L3)) {
                return name.slice(prefix.length);
            } else if (name.startsWith(NodePrefix.L2) && !name.startsWith(NodePrefix.L2_L1) && !name.startsWith(NodePrefix.L2_L3)) {
                return name.slice(prefix.length);
            } else if (name.startsWith(NodePrefix.L3) && !name.startsWith(NodePrefix.L3_L1) && !name.startsWith(NodePrefix.L3_L2)) {
                return name.slice(prefix.length);
            } else if (
                name.startsWith(NodePrefix.L1_L2) ||
                name.startsWith(NodePrefix.L1_L3) ||
                name.startsWith(NodePrefix.L2_L1) ||
                name.startsWith(NodePrefix.L2_L3) ||
                name.startsWith(NodePrefix.L3_L1) ||
                name.startsWith(NodePrefix.L3_L2)
            ) {
                return name;
            } else {
                return name.slice(prefix.length);
            }
        }
    }

    return name;
}

/**
 * Adds prefix to node name.
 * @param name Node name.
 * @param prefix Prefix to add.
 * @returns Prefixed name.
 */
export function addPrefix(name: string, prefix: NodePrefix): string {
    return prefix + name;
}

/**
 * Gets communication ID for node based on protocol and config.
 * @param protocol Protocol.
 * @param config Node config.
 * @param no_format If true, returns plain number for Modbus RTU.
 * @returns Communication ID.
 */
export function getCommunicationID(protocol: Protocol, config: BaseNodeConfig | EditableBaseNodeConfig, no_format: boolean = false): string {
    let plugin = get(protocolPlugins)[protocol];
    return plugin.getCommID(config, no_format);
}

/**
 * Normalizes a DeviceNode for comparison.
 * @param node DeviceNode.
 * @returns Normalized node.
 */
export function normalizeNode(node: DeviceNode): DeviceNode {
    return {
        device_id: node.device_id,
        name: node.name,
        protocol: node.protocol,
        config: Object.fromEntries(Object.entries(node.config).sort(([a], [b]) => a.localeCompare(b))) as BaseNodeConfig,
    };
}
