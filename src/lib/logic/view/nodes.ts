import { NodeSubSection, NodeType } from "$lib/types/nodes/base";
import { realTimeComponentMap } from "$lib/types/view/device";
import type { BaseLogPoint, NodeState, ProcessedNodeState } from "$lib/types/nodes/base";
import type { SvelteComponent } from "svelte";


export function getNodeSubSection(nodeState: NodeState | ProcessedNodeState) {
    let subsection: NodeSubSection;

    if (nodeState.type === NodeType.FLOAT || nodeState.type === NodeType.INT) {
        if (nodeState.incremental) {
            subsection = NodeSubSection.Counters;
        } else {
            subsection = NodeSubSection.Measurements;
        }
    } else if (nodeState.type === NodeType.BOOLEAN) {
        subsection = NodeSubSection.States;
    } else if (nodeState.type === NodeType.STRING) {
        subsection = NodeSubSection.Texts;
    } else {
        subsection = NodeSubSection.Other;
    }

    return subsection;
}

export function getNodeRealTimeDisplayComponent(nodeState: NodeState | ProcessedNodeState): typeof SvelteComponent<any> {
    let subSection = getNodeSubSection(nodeState);

    const component = realTimeComponentMap[subSection];
    if (component === null || component === undefined) {
        throw Error(`${subSection} subsection component not implemented.`);
    }

    return component;
}

export function getNodeLogDisplayComponents(nodeLog: BaseLogPoint): { graphComponent: typeof SvelteComponent<any>, metricsComponent: typeof SvelteComponent<any> } {
     //TODO
}
