import { NodeCategory, NodeType } from "$lib/types/nodes/base";
import { GraphType } from "./graph/base";
import { logsDisplayGraphTypeMap, realTimeDisplayComponentMap } from "$lib/types/view/device";
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
 * Retrieves the appropriate graph type for displaying historical node log data.
 * @param category - The node category to get the graph type for
 * @returns GraphType identifier for rendering the appropriate chart visualization, or null if no graph type is mapped
 */
export function getNodeLogGraphType(category: NodeCategory): GraphType | null {
    let component = logsDisplayGraphTypeMap[category];
    return component;
}
