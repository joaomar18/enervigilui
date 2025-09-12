import { get } from "svelte/store";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { Protocol } from "$lib/types/device/base";
import { NodePrefix, NodePhase, NodeType, phaseOrder } from "$lib/types/nodes/base";
import type { BaseNodeConfig, EditableBaseNodeConfig, NodeRecord, EditableNodeRecord } from "$lib/types/nodes/base";

/**
 * Determines if a node is incremental (e.g., energy counters).
 * @param node The node to check.
 * @returns True if the node is incremental, false otherwise.
 */
export function isIncremental(node: EditableNodeRecord | NodeRecord): boolean {
    return Boolean(node.config.incremental_node);
}

/**
 * Determines if a node's value is numeric (float or integer).
 * @param node The node to check.
 * @returns True if the node is numeric, false otherwise.
 */
export function isNumeric(node: EditableNodeRecord | NodeRecord): boolean {
    return node.config.type === NodeType.FLOAT || node.config.type === NodeType.INT;
}

/**
 * Determines if a node is custom (user-defined).
 * @param node The node to check.
 * @returns True if the node is custom, false otherwise.
 */
export function isCustom(node: EditableNodeRecord | NodeRecord): boolean {
    return node.config.custom;
}

/**
 * Determines if a node is a default (not custom) node.
 * @param node The node to check.
 * @returns True if the node is default, false otherwise.
 */
export function isDefault(node: EditableNodeRecord | NodeRecord): boolean {
    return !isCustom(node);
}

/**
 * Returns the index of the given phase in the phaseOrder array for sorting purposes.
 *
 * @param phase The node phase to evaluate.
 * @returns The sorting priority index.
 */
export function getNodePhasePriority(phase: NodePhase): number {
    return phaseOrder.indexOf(phase);
}

/**
 * Returns the priority group for a node name, used for sorting.
 * Lower numbers have higher priority.
 * @param nodeName The node name.
 * @returns The priority number.
 */
export function getNodePriority(nodeName: string): number {
    const name = nodeName.toLowerCase();
    if (name.includes("power_factor")) return 4;
    else if (name.includes("power")) return 0;
    else if (name.includes("energy")) return 3;
    else if (name.includes("voltage")) return 1;
    else if (name.includes("current")) return 2;
    else if (name.includes("frequency")) return 5;
    return 99;
}

/**
 * Returns the sub-priority group for a node name, used for sorting within a group.
 * Lower numbers have higher priority.
 * @param nodeName The node name.
 * @returns The sub-priority number.
 */
export function getNodeSubPriority(nodeName: string): number {
    const name = nodeName.toLowerCase();
    if (name.includes("active")) return 0;
    else if (name.includes("reactive")) return 1;
    else if (name.includes("apparent")) return 2;
    return 99;
}

/**
 * Sorts nodes alphabetically by display name (without prefix).
 * @param nodes Array of nodes.
 * @returns Sorted array.
 */
export function sortNodesByName(nodes: Array<EditableNodeRecord | NodeRecord>): Array<EditableNodeRecord | NodeRecord> {
    return nodes.sort((a, b) => removePrefix(a.name).localeCompare(removePrefix(b.name)));
}

/**
 * Gets index of a node in an array.
 * @param node Node to find.
 * @param nodesArray Array of nodes.
 * @returns Index or -1.
 */
export function getNodeIndex(node: EditableNodeRecord, nodesArray: Array<EditableNodeRecord>): number {
    return nodesArray.findIndex((n) => n === node);
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
export function normalizeNode(node: NodeRecord): NodeRecord {
    return {
        device_id: node.device_id,
        name: node.name,
        protocol: node.protocol,
        config: Object.fromEntries(Object.entries(node.config).sort(([a], [b]) => a.localeCompare(b))) as BaseNodeConfig,
        attributes: node.attributes,
    };
}