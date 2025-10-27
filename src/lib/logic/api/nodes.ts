import { callAPI } from "$lib/logic/api/api";
import { processInitialNodes, initNodes, processNodesState, processNodeLogs } from "../factory/nodes";
import { navigateTo } from "../view/navigation";
import { NodePhase } from "$lib/types/nodes/base";
import { addPrefix, getNodePrefix, removePrefix } from "../util/nodes";
import { toISOStringLocal } from "../util/date";
import type { NodeRecord, EditableNodeRecord } from "$lib/types/nodes/config";
import type { NodeState, ProcessedNodeState, BaseNodeAdditionalInfo } from "$lib/types/nodes/realtime";
import type { BaseLogPoint, NodeLogs, ProcessedBaseLogPoint, ProcessedNodeLogs } from "$lib/types/nodes/logs";

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

export async function getNodeAdditionalInfo(
    device_id: number,
    nodeName: string,
    nodePhase: NodePhase
): Promise<{ nodeAdditionalInfo: BaseNodeAdditionalInfo }> {
    let nodeAdditionalInfo: BaseNodeAdditionalInfo;
    const prefix = getNodePrefix(nodePhase);
    const processedName = addPrefix(removePrefix(nodeName), prefix);

    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_node_additional_info",
        method: "GET",
        params: { device_id, node_name: processedName },
    });

    if (sucess) {
        nodeAdditionalInfo = data as BaseNodeAdditionalInfo;
    } else {
        throw new Error("Get node additional info error");
    }

    return { nodeAdditionalInfo };
}

/**
 * Fetches and processes historical log data for a specific node.
 * Retrieves time-series data from the backend API and converts it to UI-ready format with Unix timestamps.
 *
 * @param device_id - The unique identifier of the device
 * @param nodeName - The name of the node to fetch logs for
 * @param nodePhase - The electrical phase of the node
 * @param formatted - Whether to return formatted data (optional)
 * @param start_time - Start date for the log query (optional)
 * @param end_time - End date for the log query (optional)
 * @param time_step - Time aggregation step for the logs (optional)
 * @returns A promise resolving to processed node logs with UI components and Unix timestamps
 * @throws Error if the API call fails
 */
export async function getNodeLogs(
    device_id: number,
    nodeName: string,
    nodePhase: NodePhase,
    formatted: boolean | null = null,
    start_time: Date | null = null,
    end_time: Date | null = null,
    time_step: string | null = null
): Promise<{ nodeLogs: ProcessedNodeLogs }> {
    let nodeLogs: ProcessedNodeLogs;

    const prefix = getNodePrefix(nodePhase);
    const processedName = addPrefix(removePrefix(nodeName), prefix);
    let start_time_str: string | null = null;
    let end_time_str: string | null = null;
    start_time_str = start_time !== null ? toISOStringLocal(start_time) : null;
    end_time_str = end_time !== null ? toISOStringLocal(end_time) : null;
    const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes//get_logs_from_node",
        method: "GET",
        params: { device_id, node_name: processedName, formatted, start_time: start_time_str, end_time: end_time_str, time_step, time_zone },
    });

    if (sucess) {
        console.log(data);
        nodeLogs = processNodeLogs(data as NodeLogs);

    } else {
        throw new Error("Get Node Logs error");
    }

    return { nodeLogs };
}
