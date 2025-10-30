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
 * Retrieves the appropriate Svelte component for displaying real-time node values.
 * @param category - The node category to get the display component for
 * @returns Svelte component class for rendering real-time node data
 * @throws Error if no component is mapped for the given category
 */
export function getNodeRealTimeDisplayComponent(category: NodeCategory): typeof SvelteComponent<any> {
    const component = realTimeDisplayComponentMap[category];
    if (!component) {
        throw new Error(`${category} category real time component is not implemented.`);
    }

    return component;
}

/**
 * Retrieves the appropriate Svelte component for displaying node log graphs.
 * @param category - The node category to get the graph component for
 * @returns Svelte component class for rendering historical node data graphs, or null if not available
 */
export function getNodeLogGraphComponent(category: NodeCategory): typeof SvelteComponent<any> | null {
    let component = logsDisplayGraphComponentMap[category];
    return component;
}
