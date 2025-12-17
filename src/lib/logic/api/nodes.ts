import { callAPI } from "$lib/logic/api/api";
import { processInitialNodes, initNodes, processNodesState, processNodeLogs, mergeEnergyConsumptionLogs } from "../factory/nodes";
import { navigateTo } from "../view/navigation";
import { NodePhase } from "$lib/types/nodes/base";
import { addPrefix, getNodePrefix, removePrefix } from "../util/nodes";
import { toISOStringLocal } from "../util/date";
import type { EnergyConsumptionType, PeakPowerType } from "$lib/types/device/energy";
import type { NodeRecord, EditableNodeRecord } from "$lib/types/nodes/config";
import type { NodeState, ProcessedNodeState, BaseNodeAdditionalInfo } from "$lib/types/nodes/realtime";
import type { EnergyConsumptionMetrics, NodeLogs, ProcessedEnergyConsumptionLogPoint, ProcessedNodeLogs } from "$lib/types/nodes/logs";
import type { EnergyDirectionFilter, SelectablePhaseFilter } from "$lib/types/view/nodes";
import type { MeterType } from "$lib/types/device/base";

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
export async function getDeviceNodesState(
    id: number
): Promise<{ meterType: MeterType; nodesState: Record<string, NodeState>; processedNodesState: Array<ProcessedNodeState> }> {
    let meter_type: MeterType;
    let nodes_state: Record<string, NodeState>;
    let processedNodesState: Array<ProcessedNodeState>;
    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_nodes_state",
        method: "GET",
        params: { id },
        setLoaded: true,
    });

    if (sucess) {
        ({ meter_type, nodes_state } = data as { meter_type: MeterType; nodes_state: Record<string, NodeState> });
        processedNodesState = processNodesState(nodes_state);
    } else {
        throw new Error("Get device nodes state error");
    }

    return { meterType: meter_type, nodesState: nodes_state, processedNodesState };
}

/**
 * Fetches additional information for a specific node of a device.
 * Processes the node name with the appropriate phase prefix before making the API call.
 *
 * @param id - The unique identifier of the device
 * @param nodeName - The name of the node to fetch additional information for
 * @param nodePhase - The electrical phase of the node
 * @returns A promise resolving to an object containing the node's additional information
 * @throws Error if the API call fails
 */
export async function getNodeAdditionalInfo(
    id: number,
    nodeName: string,
    nodePhase: NodePhase
): Promise<{ nodeAdditionalInfo: BaseNodeAdditionalInfo }> {
    let nodeAdditionalInfo: BaseNodeAdditionalInfo;
    const prefix = getNodePrefix(nodePhase);
    const processedName = addPrefix(removePrefix(nodeName), prefix);

    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_node_additional_info",
        method: "GET",
        params: { id, node_name: processedName },
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
 * @param id - The unique identifier of the device
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
    id: number,
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
        endpoint: "/api/nodes/get_logs_from_node",
        method: "GET",
        params: { id, node_name: processedName, formatted, start_time: start_time_str, end_time: end_time_str, time_step, time_zone },
    });

    if (sucess) {
        nodeLogs = processNodeLogs(data as NodeLogs);
    } else {
        throw new Error("Get Node Logs error");
    }

    return { nodeLogs };
}

/**
 * Fetches and processes energy consumption data for a device across multiple metrics.
 * Retrieves active energy, reactive energy, power factor, and power factor direction data,
 * then merges them into unified time-aligned log points for visualization.
 *
 * @param id - The unique identifier of the device
 * @param phase - The electrical phase filter (single-phase, three-phase total, or individual phases)
 * @param direction - Energy direction filter (consumed, produced, or both)
 * @param formatted - Whether to return formatted data (optional)
 * @param start_time - Start date for the energy consumption query (optional)
 * @param end_time - End date for the energy consumption query (optional)
 * @param time_step - Time aggregation step for the data (optional)
 * @returns A promise resolving to raw energy logs, merged processed points, and combined global metrics
 * @throws Error if the API call fails
 */
export async function getEnergyConsumption(
    id: number,
    phase: SelectablePhaseFilter,
    direction: EnergyDirectionFilter,
    formatted: boolean | null = null,
    start_time: Date | null = null,
    end_time: Date | null = null,
    time_step: string | null = null
): Promise<{ energyLogs: EnergyConsumptionType; mergedPoints: Array<ProcessedEnergyConsumptionLogPoint>; mergedGlobalMetrics: EnergyConsumptionMetrics }> {
    let energyLogs: EnergyConsumptionType;
    let mergedPoints: Array<ProcessedEnergyConsumptionLogPoint>;
    let mergedGlobalMetrics: EnergyConsumptionMetrics;
    let start_time_str: string | null = null;
    let end_time_str: string | null = null;
    start_time_str = start_time !== null ? toISOStringLocal(start_time) : null;
    end_time_str = end_time !== null ? toISOStringLocal(end_time) : null;
    const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_energy_consumption",
        method: "GET",
        params: { id, phase, direction, formatted, start_time: start_time_str, end_time: end_time_str, time_step, time_zone },
    });

    if (sucess) {
        energyLogs = data as EnergyConsumptionType;
        ({ mergedPoints, mergedGlobalMetrics } = mergeEnergyConsumptionLogs(energyLogs));
    } else {
        throw new Error("Get energy consumption error");
    }

    return { energyLogs, mergedPoints, mergedGlobalMetrics };
}

export async function mapMetricAPI(
    metric: string,
    device_id: number,
    phase: SelectablePhaseFilter,
    start_time: Date | null = null,
    end_time: Date | null = null
): Promise<any> {
    switch (metric.toLowerCase()) {
        case "peakpower":
            return await getPeakPower(device_id, phase, start_time, end_time);
        default:
            return null;
    }
}

/**
 * Fetches peak power measurements for a device and phase over an optional time range.
 * Converts optional Date parameters to local ISO strings and passes them along with
 * the device id, phase and timezone to the backend API. If start_time or end_time
 * are omitted, the API returns peak values for its default interval.
 *
 * @param id - Device numeric identifier
 * @param phase - Phase filter (total/single/l1/l2/l3)
 * @param start_time - Optional start Date for the search interval (inclusive)
 * @param end_time - Optional end Date for the search interval (inclusive)
 * @returns Promise resolving to a PeakPowerType object containing peak values and timestamps
 * @throws Error when the API call fails
 */
export async function getPeakPower(
    id: number,
    phase: SelectablePhaseFilter,
    start_time: Date | null = null,
    end_time: Date | null = null
): Promise<PeakPowerType> {
    let peakPower: PeakPowerType;
    let start_time_str: string | null = null;
    let end_time_str: string | null = null;
    start_time_str = start_time !== null ? toISOStringLocal(start_time) : null;
    end_time_str = end_time !== null ? toISOStringLocal(end_time) : null;
    const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { sucess, data } = await callAPI({
        endpoint: "/api/nodes/get_peak_power",
        method: "GET",
        params: { id, phase, start_time: start_time_str, end_time: end_time_str, time_zone },
    });

    if (sucess) {
        peakPower = data as PeakPowerType;
    } else {
        throw new Error("Get peak power error");
    }

    return peakPower;
}
