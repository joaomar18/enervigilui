import { callAPI } from "$lib/logic/api/api";
import { processInitialNodes, initNodes, processNodesState } from "../factory/nodes";
import { navigateTo } from "../view/navigation";
import {
    type NodeRecord,
    type EditableNodeRecord,
    type NodeState,
    type ProcessedNodeState,
    type NodeDetailedState,
    NodePhase,
} from "$lib/types/nodes/base";
import { addPrefix, getNodePrefix, removePrefix } from "../util/nodes";

/**
 * Fetches and processes the configuration for all nodes of a device by its ID.
 * Calls the backend API, converts the response to DeviceNode and EditableDeviceNode arrays,
 * and navigates away if initialization fails.
 *
 * @param id The unique identifier of the device.
 * @returns A promise resolving to an object containing the initial DeviceNode array and the processed EditableDeviceNode array.
 * @throws Error if the API call fails.
 */
export async function getDeviceNodesConfig(id: number): Promise<{ initialNodes: Array<NodeRecord>; nodes: Array<EditableNodeRecord> }> {
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

/**
 * Fetches and processes the real-time state for all nodes of a device by its ID.
 * Retrieves current node values from the backend API and converts them to processed format for UI consumption.
 *
 * @param id The unique identifier of the device.
 * @returns A promise resolving to an object containing the raw nodes state record and processed nodes state array.
 * @throws Error if the API call fails.
 */
export async function getDeviceNodesState(id: number): Promise<{ nodesState: Record<string, NodeState>; processedNodesState: Array<ProcessedNodeState> }> {
    let nodesState: Record<string, NodeState>;
    let processedNodesState: Array<ProcessedNodeState>;
    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_nodes_state",
        method: "GET",
        params: { id },
        setLoaded: true,
    });

    if (sucess) {
        nodesState = data as Record<string, NodeState>;
        processedNodesState = processNodesState(nodesState);
    } else {
        throw new Error("Get device nodes state error");
    }

    return { nodesState, processedNodesState };
}

/**
 * Retrieves detailed runtime state information for a specific node variable.
 *
 * @param device_id - The ID of the device containing the node
 * @param nodeName - The name of the node variable (with or without phase prefix)
 * @param nodePhase - The electrical phase of the node variable
 * @returns Promise resolving to detailed node state including current value, type, alarm thresholds, and timestamps
 * @throws Error if the API call fails or the node is not found
 */
export async function getNodeDetailedState(device_id: number, nodeName: string, nodePhase: NodePhase): Promise<{ nodeDetailedState: NodeDetailedState }> {
    let nodeDetailedState: NodeDetailedState;
    const prefix = getNodePrefix(nodePhase);
    const processedName = addPrefix(removePrefix(nodeName), prefix);

    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_node_detailed_state",
        method: "GET",
        params: { device_id, node_name: processedName },
    });

    if (sucess) {
        nodeDetailedState = data as NodeDetailedState;
    } else {
        throw new Error("Get Node Detailed state error");
    }

    return { nodeDetailedState };
}

export async function getNodeLogs(
    device_id: number,
    nodeName: string,
    nodePhase: NodePhase,
    formatted: boolean | null = null,
    start_time: Date | null = null,
    end_time: Date | null = null,
    time_step: string | null = null
): Promise<{ nodeLogs: any }> {
    let nodeLogs: any;
    const prefix = getNodePrefix(nodePhase);
    const processedName = addPrefix(removePrefix(nodeName), prefix);

    let start_time_str: string | null = null;
    let end_time_str: string | null = null;

    start_time_str = start_time !== null ? start_time.toISOString() : null;
    end_time_str = end_time !== null ? end_time.toISOString() : null;

    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes//get_logs_from_node",
        method: "GET",
        params: { device_id, node_name: processedName, formatted, start_time: start_time_str, end_time: end_time_str, time_step },
        timeout: 20000,
    });

    if (sucess) {
        nodeLogs = data;
    } else {
        throw new Error("Get Node Logs error");
    }

    return { nodeLogs };
}
