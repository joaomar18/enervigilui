import { callAPI } from "$lib/logic/api/api";
import { processInitialNodes, initNodes } from "../factory/nodes";
import { NodePhase } from "$lib/types/nodes/base";
import type { NodeRecord, EditableNodeRecord, NodeState } from "$lib/types/nodes/base";
import { getAvailablePhasesFromNodesState } from "../util/nodes";
import { nodeSections } from "$lib/types/nodes/base";
import { navigateTo } from "../view/navigation";

/**
 * Fetches and processes the configuration for all nodes of a device by its ID.
 * Calls the backend API, converts the response to DeviceNode and EditableDeviceNode arrays,
 * and navigates away if initialization fails.
 *
 * @param id The unique identifier of the device.
 * @returns A promise resolving to an object containing the initial DeviceNode array and the processed EditableDeviceNode array.
 * @throws Error if the API call fails.
 */
export async function getDeviceNodesConfig(id: number): Promise<{ initialNodes: Array<NodeRecord>, nodes: Array<EditableNodeRecord> }> {
    let initialNodes: Array<NodeRecord> = [];
    let nodes: Array<EditableNodeRecord> = [];
    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_nodes_config",
        method: "GET",
        params: { id },
    });

    if (sucess) {
        let requestDeviceNodes: Record<string, NodeRecord> = data;
        initialNodes = processInitialNodes(Object.values(requestDeviceNodes) as Array<NodeRecord>);
        const { sucess, editableNodes } = initNodes(initialNodes);
        if (sucess) {
            nodes = editableNodes;
        } else {
            await navigateTo("/devices");
        }
    } else {
        throw new Error("Get device nodes config error");
    }

    return { initialNodes, nodes };
}

export async function getDeviceNodesState(id: number): Promise<{ nodesStateBySection: Record<NodePhase, Record<string, NodeState>>, availablePhases: Array<NodePhase> }> {
    let nodesStateBySection: Record<NodePhase, Record<string, NodeState>>;
    let availablePhases: Array<NodePhase> = [];
    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_nodes_state",
        method: "GET",
        params: { id },
        setLoaded: true,
    });

    if (sucess) {
        let nodesState = data as Record<string, NodeState>;
        availablePhases = getAvailablePhasesFromNodesState(nodesState);
        nodesStateBySection = nodeSections.reduce((acc: Record<NodePhase, Record<string, NodeState>>, section) => {
            acc[section.key] = Object.fromEntries(
                Object.entries(nodesState)
                    .filter(([key, nodeState]) => section.filter(nodeState.phase))
            ); return acc;
        }, {} as Record<NodePhase, Record<string, NodeState>>);
    }
    else {
        throw new Error("Get device nodes state error");
    }

    return { nodesStateBySection, availablePhases };
}