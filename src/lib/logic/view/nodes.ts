import { NodeCategory, NodeType } from "$lib/types/nodes/base";
import { logsDisplayGraphComponentMap, realTimeDisplayComponentMap } from "$lib/types/view/device";
import type { NodeState, ProcessedNodeState } from "$lib/types/nodes/realtime";
import type { NodeLogs } from "$lib/types/nodes/logs";
import type { SvelteComponent } from "svelte";

/**
 * Determines the category of a node based on its type and incremental flag.
 * @param nodeType - The data type of the node (FLOAT, INT, BOOLEAN, STRING)
 * @param incrementalNode - Whether the node accumulates values over time
 * @returns The appropriate node category for UI organization
 */
export function getNodeCategory(nodeType: NodeType, incrementalNode: boolean): NodeCategory {
    let category: NodeCategory;

    if (nodeType === NodeType.FLOAT || nodeType === NodeType.INT) {
        if (incrementalNode) {
            category = NodeCategory.Counters;
        } else {
            category = NodeCategory.Measurements;
        }
    } else if (nodeType === NodeType.BOOLEAN) {
        category = NodeCategory.States;
    } else if (nodeType === NodeType.STRING) {
        category = NodeCategory.Texts;
    } else {
        category = NodeCategory.Other;
    }

    return category;
}

/**
 * Gets the Svelte component for displaying a node in real-time cards.
 * @param nodeState - The node state to get the display component for
 * @returns The Svelte component for rendering this node in real-time view
 * @throws Error if the component for the node's category is not implemented
 */
export function getNodeRealTimeDisplayComponent(nodeState: NodeState | ProcessedNodeState): typeof SvelteComponent<any> {
    let category = getNodeCategory(nodeState.type, nodeState.incremental);

    const component = realTimeDisplayComponentMap[category];
    if (!component) {
        throw new Error(`${category} category real time component is not implemented.`);
    }

    return component;
}

/**
 * Gets the graph component for displaying node log data.
 * @param nodeLogs - The node logs to get display component for
 * @returns The Svelte component for log visualization
 * @throws Error if the components for the node's category are not implemented
 */
export function getNodeLogDisplayComponents(nodeLogs: NodeLogs): typeof SvelteComponent<any> {
    let category = getNodeCategory(nodeLogs.type, nodeLogs.incremental);
    let component = logsDisplayGraphComponentMap[category];
    if (!component) {
        throw new Error(`${category} category graphics component is not implemented.`);
    }

    return component;
}
