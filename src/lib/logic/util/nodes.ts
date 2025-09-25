import { get } from "svelte/store";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { defaultVariableNames } from "$lib/stores/device/variables";
import { Protocol } from "$lib/types/device/base";
import { NodePrefix, NodePhase, NodeType, phaseOrder } from "$lib/types/nodes/base";
import { defaultRealTimeCardSectionsState } from "$lib/types/view/device";
import { RealTimeCardSubSections } from "$lib/types/view/device";
import { assignRealTimeCardSectionsStateToAllPhases, createEmptyRealTimeCardSubSectionsArrays, getNodeSubSection } from "../view/device";
import type { BaseNodeConfig, EditableBaseNodeConfig, NodeRecord, EditableNodeRecord, NodeState, ProcessedNodeState } from "$lib/types/nodes/base";
import type { RealTimeCardSectionsState } from "$lib/types/view/device";

/**
 * Checks if a node is configured as incremental (accumulating values over time).
 * @param node - The node to check (supports EditableNodeRecord, NodeRecord, or ProcessedNodeState).
 * @returns True if the node is incremental, false otherwise.
 */
export function isIncremental(node: EditableNodeRecord | NodeRecord | ProcessedNodeState): boolean {
    if ("config" in node) {
        return Boolean(node.config.incremental_node);
    } else if ("incremental" in node) {
        return node.incremental;
    } else {
        throw Error("Couldn't obtain incremental property from node.");
    }
}

/**
 * Checks if a node has a numeric data type (FLOAT or INT).
 * @param node - The node to check (supports EditableNodeRecord, NodeRecord, or ProcessedNodeState).
 * @returns True if the node type is numeric, false otherwise.
 */
export function isNumeric(node: EditableNodeRecord | NodeRecord | ProcessedNodeState): boolean {
    if ("config" in node) {
        return node.config.type === NodeType.FLOAT || node.config.type === NodeType.INT;
    } else if ("type" in node) {
        return node.type === NodeType.FLOAT || node.type === NodeType.INT;
    } else {
        throw Error("Couldn't obtain type property from node.");
    }
}

/**
 * Checks if a node is custom (user-defined) rather than a default system variable.
 * @param node - The node to check (supports EditableNodeRecord, NodeRecord, or ProcessedNodeState).
 * @returns True if the node is custom, false if it's a default variable.
 */
export function isCustom(node: EditableNodeRecord | NodeRecord | ProcessedNodeState): boolean {
    if ("config" in node) {
        return node.config.custom;
    } else {
        const defaultNames = get(defaultVariableNames);
        return !defaultNames.includes(node.name);
    }
}

/**
 * Checks if a node is a default system variable (opposite of custom).
 * @param node - The node to check (supports EditableNodeRecord, NodeRecord, or ProcessedNodeState).
 * @returns True if the node is a default variable, false if it's custom.
 */
export function isDefault(node: EditableNodeRecord | NodeRecord | ProcessedNodeState): boolean {
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
 * Gets the index of a specific editable node in an array by reference comparison.
 * @param node - The editable node to find in the array.
 * @param nodesArray - Array of editable nodes to search in.
 * @returns Index of the node in the array, or -1 if not found.
 */
export function getNodeIndex(node: EditableNodeRecord, nodesArray: Array<EditableNodeRecord>): number {
    return nodesArray.findIndex((n) => n === node);
}

/**
 * Maps a NodePhase to its corresponding prefix string for node naming.
 * @param phase - The electrical phase to get the prefix for.
 * @returns The prefix string corresponding to the phase.
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
 * Removes the electrical phase prefix from a node name with smart prefix detection.
 * @param name - The full node name including prefix.
 * @returns The node name without the phase prefix.
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
 * Adds an electrical phase prefix to a node name.
 * @param name - The base node name without prefix.
 * @param prefix - The NodePrefix or prefix to prepend to the name.
 * @returns The node name with the prefix added.
 */
export function addPrefix(name: string, prefix: string | NodePrefix): string {
    return prefix + name;
}

/**
 * Gets the communication ID for a node using the appropriate protocol plugin.
 * @param protocol - The communication protocol for the node.
 * @param config - The node configuration containing communication settings.
 * @param no_format - If true, returns plain number format for certain protocols.
 * @returns The communication ID string for the node.
 */
export function getCommunicationID(protocol: Protocol, config: BaseNodeConfig | EditableBaseNodeConfig, no_format: boolean = false): string {
    let plugin = get(protocolPlugins)[protocol];
    return plugin.getCommID(config, no_format);
}

/**
 * Extracts the electrical phase from different node object types.
 * @param node - The node object to extract phase from.
 * @returns The NodePhase of the node.
 * @throws Error if phase cannot be extracted from the node object.
 */
export function getNodePhaseFromRecordOrState(node: EditableNodeRecord | NodeRecord | ProcessedNodeState | NodeState): NodePhase {
    if ("attributes" in node) {
        return node.attributes.phase;
    } else if ("phase" in node) {
        return node.phase;
    } else {
        throw new Error("Couldn't obtain phase from node record or state.");
    }
}

/**
 * Extracts unique phases from an array of mixed node records and states.
 * @param nodes - Array of mixed node types (EditableNodeRecord, NodeRecord, ProcessedNodeState, or NodeState).
 * @returns Array of unique node phases found in the provided nodes.
 */
export function getAvailablePhasesFromRecordsOrStates(nodes: Array<EditableNodeRecord | NodeRecord | ProcessedNodeState | NodeState>): Array<NodePhase> {
    return Array.from(
        new Set(nodes.map((node) => getNodePhaseFromRecordOrState(node)).filter((phase) => phase !== null && phase !== undefined))
    ) as NodePhase[];
}

/**
 * Normalizes a node record by sorting its configuration properties alphabetically for consistent comparison.
 * @param node - The NodeRecord to normalize.
 * @returns Normalized NodeRecord with sorted configuration properties.
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
 * Organizes processed node state data by electrical phase and subsection type for UI display.
 * @param processedNodesState - Array of processed node states to organize.
 * @returns Object containing nodes organized by phase/subsection and available subsection flags.
 */
export function getNodesStateBySubSection(processedNodesState: Array<ProcessedNodeState>): {
    nodesStateBySubSection: Record<NodePhase, Record<RealTimeCardSubSections, Array<ProcessedNodeState>>>;
    availableSubSections: Record<NodePhase, RealTimeCardSectionsState>;
} {
    let availableSubSections: Record<NodePhase, RealTimeCardSectionsState> = assignRealTimeCardSectionsStateToAllPhases(defaultRealTimeCardSectionsState);

    const nodesStateBySubSection: Record<NodePhase, Record<RealTimeCardSubSections, Array<ProcessedNodeState>>> = Object.fromEntries(
        phaseOrder.map((phase) => [phase, createEmptyRealTimeCardSubSectionsArrays()])
    ) as Record<NodePhase, Record<RealTimeCardSubSections, Array<ProcessedNodeState>>>;

    for (const nodeState of processedNodesState) {
        const subsection = getNodeSubSection(nodeState);
        nodesStateBySubSection[nodeState.phase][subsection].push(nodeState);
        availableSubSections[nodeState.phase][subsection] = true;
    }

    return { nodesStateBySubSection, availableSubSections };
}
