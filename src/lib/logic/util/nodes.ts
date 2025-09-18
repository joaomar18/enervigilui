import { get } from "svelte/store";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { Protocol } from "$lib/types/device/base";
import { NodePrefix, NodePhase, NodeType, phaseOrder } from "$lib/types/nodes/base";
import { defaultRealTimeCardSectionsState } from "$lib/types/view/device";
import type { BaseNodeConfig, EditableBaseNodeConfig, NodeRecord, EditableNodeRecord, NodeState } from "$lib/types/nodes/base";
import type { RealTimeCardSectionsState } from "$lib/types/view/device";
import { RealTimeCardSubSections, emptyRealTimeCardSubSections } from "$lib/types/view/device";
import { assignRealTimeCardSectionsStateToAllPhases } from "../view/device";

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

/**
 * Extracts unique phases from an array of nodes.
 * @param nodes Array of editable or regular node records.
 * @returns Array of unique node phases found in the provided nodes.
 */
export function getAvailablePhasesFromNodes(nodes: Array<EditableNodeRecord> | Array<NodeRecord>): Array<NodePhase> {
    return Array.from(
        new Set(
            Object.values(nodes)
                .map((node) => node.attributes.phase)
                .filter((phase) => phase !== null && phase !== undefined)
        )
    ) as NodePhase[];
}

/**
 * Extracts unique phases from a nodes state record.
 * @param nodesState Record mapping node keys to their state information.
 * @returns Array of unique node phases found in the provided nodes state.
 */
export function getAvailablePhasesFromNodesState(nodesState: Record<string, NodeState>): Array<NodePhase> {
    return Array.from(
        new Set(
            Object.values(nodesState)
                .map((nodeState) => nodeState.phase)
                .filter((phase) => phase !== null && phase !== undefined)
        )
    ) as NodePhase[];
}

/**
 * Organizes nodes state by phase and subsection, categorizing them based on their data types.
 *
 * This function takes a flat record of node states and organizes them into a hierarchical structure
 * grouped by phase (L1, L2, L3, etc.) and then by subsection type (Measurements, Counters, States,
 * Texts, Other) based on the node's data type and characteristics.
 *
 * Categorization rules:
 * - Numeric incremental nodes → Counters
 * - Numeric non-incremental nodes → Measurements
 * - Boolean nodes → States
 * - String nodes → Texts
 * - Other types → Other
 *
 * @param nodesState Record mapping node keys to their state information.
 * @returns Object containing the organized nodes by subsection and available subsections per phase.
 */
export function getNodesStateBySubSection(nodesState: Record<string, NodeState>): {
    nodesStateBySubSection: Record<NodePhase, Record<RealTimeCardSubSections, Record<string, NodeState>>>;
    availableSubSections: Record<NodePhase, RealTimeCardSectionsState>;
} {
    let availableSubSections: Record<NodePhase, RealTimeCardSectionsState> = assignRealTimeCardSectionsStateToAllPhases(defaultRealTimeCardSectionsState);

    const nodesStateBySubSection: Record<NodePhase, Record<RealTimeCardSubSections, Record<string, NodeState>>> = Object.fromEntries(
        phaseOrder.map((phase) => [phase, { ...emptyRealTimeCardSubSections }])
    ) as Record<NodePhase, Record<RealTimeCardSubSections, Record<string, NodeState>>>;

    for (const [nodeKey, nodeState] of Object.entries(nodesState)) {
        const phase = nodeState.phase;
        let subsection: RealTimeCardSubSections;
        if (nodeState.type === NodeType.FLOAT || nodeState.type === NodeType.INT) {
            if (nodeState.incremental) {
                subsection = RealTimeCardSubSections.Counters;
            } else {
                subsection = RealTimeCardSubSections.Measurements;
            }
        } else if (nodeState.type === NodeType.BOOLEAN) {
            subsection = RealTimeCardSubSections.States;
        } else if (nodeState.type === NodeType.STRING) {
            subsection = RealTimeCardSubSections.Texts;
        } else {
            subsection = RealTimeCardSubSections.Other;
        }
        nodesStateBySubSection[phase][subsection][nodeKey] = nodeState;
        availableSubSections[phase][subsection] = true;
    }
    return { nodesStateBySubSection, availableSubSections };
}
