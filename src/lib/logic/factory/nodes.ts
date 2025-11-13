import { get } from "svelte/store";
import { MeterType } from "$lib/types/device/base";
import { NodeType, NodePhase, NodePrefix, nodePhaseSections } from "$lib/types/nodes/base";
import { defaultVariables } from "$lib/stores/device/variables";
import { addPrefix, removePrefix, getNodePrefix, getCommunicationID } from "../util/nodes";
import { sortNodesLogically } from "../handlers/nodes";
import { getInitialNodeValidation } from "../validation/nodes/base";
import { stringIsValidInteger, stringIsValidFloat } from "$lib/logic/util/generic";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { normalizeNode } from "../util/nodes";
import { showToast } from "../view/toast";
import { AlertType } from "$lib/stores/view/toast";
import { getNodeRealTimeDisplayComponent, getNodeLogGraphType, getNodeCategory } from "../view/nodes";
import { convertISOToTimestamp } from "../util/date";
import type { DefaultNodeInfo } from "$lib/types/nodes/base";
import type { EditableDevice, MeterOptions, NewDevice } from "$lib/types/device/base";
import type { BaseNodeConfig, NodeRecord, EditableNodeRecord, EditableBaseNodeConfig, NodeAttributes } from "$lib/types/nodes/config";
import type { NodeState, ProcessedNodeState } from "$lib/types/nodes/realtime";
import type { CounterLogPoint, CounterMetrics, EnergyConsumptionMetrics, NodeLogs, ProcessedBaseLogPoint, ProcessedEnergyConsumptionLogPoint, ProcessedNodeLogs, SingleValueLogPoint, SingleValueMetrics } from "$lib/types/nodes/logs";
import type { EnergyConsumptionType } from "$lib/types/device/energy";

/**
 * Converts a BaseNodeConfig object to an EditableBaseNodeConfig for use in UI forms.
 * @param config - The base node configuration object.
 * @returns EditableBaseNodeConfig suitable for editing in the UI.
 */
export function convertToEditableBaseNodeConfig(config: BaseNodeConfig): EditableBaseNodeConfig {
    let decimal_places: string = config.decimal_places?.toString() ?? "";
    let number_decimal_places: number = parseInt(decimal_places) ?? 0;
    return {
        calculate_increment: config.calculate_increment ?? false,
        calculated: config.calculated,
        custom: config.custom,
        decimal_places: decimal_places,
        enabled: config.enabled,
        incremental_node: config.incremental_node ?? false,
        logging: config.logging,
        logging_period: config.logging_period.toString(),
        max_alarm: config.max_alarm,
        max_alarm_value: config.max_alarm_value?.toFixed(number_decimal_places) ?? "",
        min_alarm: config.min_alarm,
        min_alarm_value: config.min_alarm_value?.toFixed(number_decimal_places) ?? "",
        positive_incremental: config.positive_incremental ?? false,
        publish: config.publish,
        type: config.type,
        unit: config.unit ?? "",
    } as EditableBaseNodeConfig;
}

/**
 * Converts an EditableBaseNodeConfig object back to a BaseNodeConfig for API or backend use.
 * @param config - The editable node configuration object.
 * @returns BaseNodeConfig suitable for backend/API operations.
 */
export function convertToBaseNodeConfig(config: EditableBaseNodeConfig): BaseNodeConfig {
    let numericType = config.type === NodeType.FLOAT || config.type === NodeType.INT;
    return {
        calculate_increment: numericType ? config.calculate_increment : null,
        calculated: config.calculated,
        custom: config.custom,
        decimal_places: stringIsValidInteger(config.decimal_places) ? parseInt(config.decimal_places) : null,
        enabled: config.enabled,
        incremental_node: numericType ? config.incremental_node : null,
        logging: config.logging,
        logging_period: parseInt(config.logging_period),
        max_alarm: config.max_alarm,
        max_alarm_value: stringIsValidFloat(config.max_alarm_value) ? parseFloat(config.max_alarm_value) : null,
        min_alarm: config.min_alarm,
        min_alarm_value: stringIsValidFloat(config.min_alarm_value) ? parseFloat(config.min_alarm_value) : null,
        positive_incremental: numericType ? config.positive_incremental : null,
        publish: config.publish,
        type: config.type,
        unit: numericType ? config.unit : null,
    } as BaseNodeConfig;
}

/**
 * Generates an EditableBaseNodeConfig from a default variable and meter options.
 * Used to create editable node configs for UI forms based on variable defaults and device options.
 * @param variable - Default variable information.
 * @param options - Meter options for the device.
 * @returns EditableBaseNodeConfig for UI editing.
 */
export function getEditableBaseNodeConfigFromDefaultVar(variable: DefaultNodeInfo, options: MeterOptions): EditableBaseNodeConfig {
    let decimal_places: string = "";
    let min_alarm_value: string = "";
    let max_alarm_value: string = "";

    if (variable.type === NodeType.FLOAT || variable.type === NodeType.INT) {
        decimal_places = variable.defaultNumberOfDecimals ? variable.defaultNumberOfDecimals.toString() : "0";

        if (!variable.isIncrementalNode) {
            min_alarm_value = variable.defaultMinAlarm
                ? variable.defaultMinAlarm.toFixed(parseInt(decimal_places))
                : Number(0).toFixed(parseInt(decimal_places));
            max_alarm_value = variable.defaultMaxAlarm
                ? variable.defaultMaxAlarm.toFixed(parseInt(decimal_places))
                : Number(0).toFixed(parseInt(decimal_places));
        }
    }

    return {
        calculate_increment: variable.isIncrementalNode && !options.read_energy_from_meter,
        calculated: false,
        custom: false,
        decimal_places: decimal_places,
        enabled: true,
        incremental_node: variable.isIncrementalNode,
        logging: variable.defaultLoggingEnabled,
        logging_period: String(variable.defaultLoggingPeriod),
        max_alarm: variable.defaultMaxAlarmEnabled ? true : false,
        max_alarm_value: max_alarm_value,
        min_alarm: variable.defaultMinAlarmEnabled !== undefined ? true : false,
        min_alarm_value: min_alarm_value,
        positive_incremental: variable.isIncrementalNode && !options.read_energy_from_meter,
        publish: variable.defaultPublished,
        type: variable.type,
        unit: variable.defaultUnit,
    } as EditableBaseNodeConfig;
}

/**
 * Processes and normalizes a BaseNodeConfig object, ensuring correct types and nulls for non-numeric fields.
 * Used to sanitize initial node config data before further conversion or use.
 * @param config - The base node configuration to process.
 * @returns A normalized BaseNodeConfig object.
 */
export function processInitialBaseNodeConfig(config: BaseNodeConfig): BaseNodeConfig {
    let numericType = config.type === NodeType.FLOAT || config.type === NodeType.INT;
    return {
        calculate_increment: numericType ? config.calculate_increment : null,
        calculated: config.calculated,
        custom: config.custom,
        decimal_places: stringIsValidInteger(String(config.decimal_places)) ? config.decimal_places : null,
        enabled: config.enabled,
        incremental_node: numericType ? config.incremental_node : null,
        logging: config.logging,
        logging_period: config.logging_period,
        max_alarm: config.max_alarm,
        max_alarm_value: stringIsValidFloat(String(config.max_alarm_value)) ? config.max_alarm_value : null,
        min_alarm: config.min_alarm,
        min_alarm_value: stringIsValidFloat(String(config.min_alarm_value)) ? config.min_alarm_value : null,
        positive_incremental: numericType ? config.positive_incremental : null,
        publish: config.publish,
        type: config.type,
        unit: numericType ? config.unit : null,
    } as BaseNodeConfig;
}

/**
 * Converts an array of NodeRecord objects to EditableNodeRecord objects for UI editing.
 * @param nodes - Array of device nodes to convert.
 * @returns Array of editable nodes suitable for UI forms.
 */
export function convertToEditableNodes(nodes: Array<NodeRecord>): Array<EditableNodeRecord> {
    let editableNodes: Array<EditableNodeRecord> = [];

    for (const node of nodes) {
        let editableNode: EditableNodeRecord;
        let plugin = get(protocolPlugins)[node.protocol];
        let editableConfig: EditableBaseNodeConfig = plugin.convertNodeConfigToEditable(node.config);

        editableNode = {
            name: node.name,
            device_id: node.device_id,
            protocol: node.protocol,
            display_name: removePrefix(node.name),
            communication_id: getCommunicationID(node.protocol, editableConfig),
            validation: getInitialNodeValidation(),
            config: editableConfig,
            attributes: node.attributes,
        };

        editableNodes.push(editableNode);
    }

    return sortNodesLogically(editableNodes) as Array<EditableNodeRecord>;
}

/**
 * Converts an array of EditableNodeRecord objects back to NodeRecord objects for API operations.
 * @param nodes - Array of editable nodes to convert.
 * @returns Array of device nodes suitable for backend operations.
 */
export function convertToNodes(nodes: Array<EditableNodeRecord>): Array<NodeRecord> {
    const deviceNodes: Array<NodeRecord> = [];

    for (const editableNode of nodes) {
        let plugin = get(protocolPlugins)[editableNode.protocol];
        let nodeConfig: BaseNodeConfig = plugin.convertNodeConfigToNormal(editableNode.config);

        const deviceNode: NodeRecord = {
            name: editableNode.name,
            device_id: editableNode.device_id,
            protocol: editableNode.protocol,
            config: nodeConfig,
            attributes: editableNode.attributes,
        };

        deviceNodes.push(deviceNode);
    }

    return sortNodesLogically(deviceNodes) as Array<NodeRecord>;
}

/**
 * Processes and normalizes initial node data from the API.
 * @param nodes - Array of nodes to process and normalize.
 * @returns Array of processed and sorted NodeRecord objects.
 */
export function processInitialNodes(nodes: Array<NodeRecord>): Array<NodeRecord> {
    const deviceNodes: Array<NodeRecord> = [];

    for (const node of nodes) {
        let plugin = get(protocolPlugins)[node.protocol];
        let nodeConfig: BaseNodeConfig = plugin.processInitialNodeConfig(node.config);

        const deviceNode: NodeRecord = {
            name: node.name,
            device_id: node.device_id,
            protocol: node.protocol,
            config: nodeConfig,
            attributes: node.attributes,
        };

        deviceNodes.push(deviceNode);
    }

    return (sortNodesLogically(deviceNodes) as Array<NodeRecord>).map(normalizeNode);
}

/**
 * Initializes nodes configuration by converting to editable format with error handling.
 * @param initialNodes - Array of initial nodes to initialize.
 * @returns Object containing success status and converted editable nodes array.
 */
export function initNodes(initialNodes: Array<NodeRecord>): { sucess: boolean; editableNodes: Array<EditableNodeRecord> } {
    let editableNodes: Array<EditableNodeRecord> = [];
    let sucess = false;
    try {
        editableNodes = convertToEditableNodes(initialNodes);
        sucess = true;
    } catch (e) {
        console.error(`Could not initialize the nodes configuration: ${e}`);
        showToast("initNodesError", AlertType.ALERT, { error: String(e) });
    }
    return { sucess, editableNodes };
}

/**
 * Creates a default editable node from variable definition and device configuration.
 * @param variable - Default variable information.
 * @param phase - Electrical phase for the node.
 * @param device_data - Device configuration data.
 * @returns EditableNodeRecord configured with defaults.
 */
function createDefaultEditableDeviceNode(variable: DefaultNodeInfo, phase: NodePhase, device_data: EditableDevice | NewDevice): EditableNodeRecord {
    const full_name = getNodePrefix(phase) + variable.name;
    let plugin = get(protocolPlugins)[device_data.protocol];
    let editableConfig = plugin.createNodeConfigFromDefaultVar(variable, device_data.options);
    let attributes = {
        phase: phase,
    } as NodeAttributes;

    let node: EditableNodeRecord = {
        device_id: "id" in device_data ? device_data.id : undefined,
        name: full_name,
        protocol: device_data.protocol,
        config: editableConfig,
        attributes: attributes,
        display_name: variable.name,
        communication_id: getCommunicationID(device_data.protocol, editableConfig, true),
        validation: getInitialNodeValidation(),
    };

    return node;
}

/**
 * Generates a list of default nodes based on device type (single-phase or three-phase).
 * @param device_data - Device configuration to determine which default nodes to create.
 * @returns Array of default editable nodes for the device type.
 */
export function getDefaultNodesList(device_data: EditableDevice | NewDevice): Array<EditableNodeRecord> {
    const nodes: Array<EditableNodeRecord> = [];
    const defaultVars = get(defaultVariables);

    if (device_data.type === MeterType.SINGLE_PHASE) {
        const singlePhaseVars = defaultVars.filter((v) => v.applicablePhases.includes(NodePhase.SINGLEPHASE) && v.useByDefault);

        for (const variable of singlePhaseVars) {
            nodes.push(createDefaultEditableDeviceNode(variable, NodePhase.SINGLEPHASE, device_data));
        }
    } else if (device_data.type === MeterType.THREE_PHASE) {
        const threePhaseeSections = nodePhaseSections.filter((section) => section.phase !== NodePhase.SINGLEPHASE);

        for (const section of threePhaseeSections) {
            const phaseVars = defaultVars.filter((v) => v.useByDefault && v.applicablePhases.includes(section.phase));

            for (const variable of phaseVars) {
                nodes.push(createDefaultEditableDeviceNode(variable, section.phase, device_data));
            }
        }
    }

    return sortNodesLogically(nodes) as Array<EditableNodeRecord>;
}

/**
 * Creates a new empty editable node for a specific phase and device configuration.
 * @param sectionPhase - The electrical phase for the new node.
 * @param sectionPrefix - The prefix to apply to the node name.
 * @param device_data - Device configuration data.
 * @returns A new empty EditableNodeRecord ready for configuration.
 */
export function addNode(sectionPhase: NodePhase, sectionPrefix: NodePrefix, device_data: EditableDevice | NewDevice): EditableNodeRecord {
    const nodeBaseName = ``;
    const fullNodeName = addPrefix(nodeBaseName, sectionPrefix);

    let plugin = get(protocolPlugins)[device_data.protocol];
    let newEditableConfig = plugin.createNewEditableNodeConfig();
    let newAttributes = {
        phase: sectionPhase,
    } as NodeAttributes;

    const newFormattedNode: EditableNodeRecord = {
        device_id: "id" in device_data ? device_data.id : undefined,
        name: fullNodeName,
        protocol: device_data.protocol,
        config: newEditableConfig,
        attributes: newAttributes,
        display_name: nodeBaseName,
        communication_id: getCommunicationID(device_data.protocol, newEditableConfig, true),
        validation: getInitialNodeValidation(),
    };

    return newFormattedNode;
}

/**
 * Processes raw node state data into UI-ready format with display components.
 * @param nodesState - Record of node names to their current state values.
 * @returns Array of processed node states ready for UI consumption.
 */
export function processNodesState(nodesState: Record<string, NodeState>): Array<ProcessedNodeState> {
    let processedNodesState: Array<ProcessedNodeState> = [];

    for (let [nodeName, nodeState] of Object.entries(nodesState)) {
        const processedName = removePrefix(nodeName);
        let category = getNodeCategory(nodeState.type, nodeState.incremental);
        const displayComponent = getNodeRealTimeDisplayComponent(category);
        const graphType = getNodeLogGraphType(category);
        processedNodesState.push({ ...nodeState, name: processedName, displayComponent: displayComponent, graphType: graphType } as ProcessedNodeState);
    }

    return sortNodesLogically(processedNodesState) as Array<ProcessedNodeState>;
}

/**
 * Processes raw node logs into UI-ready format with converted timestamps and display components.
 * Converts ISO timestamps to Unix seconds for uPlot compatibility and adds appropriate graph/metrics components.
 * @param nodeLogs - Raw node logs with ISO timestamps and metadata
 * @returns Processed node logs with Unix timestamps and UI components for visualization
 */
export function processNodeLogs(nodeLogs: NodeLogs): ProcessedNodeLogs {
    let processedPoints: Array<ProcessedBaseLogPoint> = [];
    let category = getNodeCategory(nodeLogs.type, nodeLogs.incremental);
    const graphType = getNodeLogGraphType(category);
    for (let point of nodeLogs.points) {
        const { start_time: start_time_str, end_time: end_time_str, ...logData } = point;

        let start_time = convertISOToTimestamp(start_time_str) / 1000;
        let end_time = convertISOToTimestamp(end_time_str) / 1000;


        let processedLog = {
            start_time: start_time,
            end_time: end_time,
            ...logData
        } as ProcessedBaseLogPoint;

        processedPoints.push(processedLog);
    }

    return {
        unit: nodeLogs.unit,
        decimal_places: nodeLogs.decimal_places,
        type: nodeLogs.type,
        incremental: nodeLogs.incremental,
        time_step: nodeLogs.time_step,
        graphType: graphType,
        points: processedPoints,
        global_metrics: nodeLogs.global_metrics,
    } as ProcessedNodeLogs;
}

/**
 * Merges separate energy consumption data streams into unified log points with Unix timestamps.
 * Combines active energy, reactive energy, power factor, and power factor direction data into
 * single time-aligned data points for visualization and analysis.
 * @param energyLogs - Energy consumption data with separate streams for each metric type
 * @returns Object containing merged log points array and combined global metrics
 * @throws Error if the log point arrays have mismatched lengths
 */
export function mergeEnergyConsumptionLogs(energyLogs: EnergyConsumptionType): { mergedPoints: Array<ProcessedEnergyConsumptionLogPoint>, mergedGlobalMetrics: EnergyConsumptionMetrics } {
    let mergedPoints: Array<ProcessedEnergyConsumptionLogPoint> = [];
    let mergedGlobalMetrics: EnergyConsumptionMetrics;

    let active_energy_points = energyLogs.active_energy.points;
    let reactive_energy_points = energyLogs.reactive_energy.points;
    let pf_points = energyLogs.power_factor.points;
    let pf_direction_points = energyLogs.power_factor_direction.points;

    const allLengthsEqual =
        active_energy_points.length === reactive_energy_points.length &&
        reactive_energy_points.length === pf_points.length &&
        pf_points.length === pf_direction_points.length;

    if (!allLengthsEqual) {
        throw new Error("Energy consumption log points have mismatched lengths");
    }

    for (let i = 0; i < active_energy_points.length; i++) {
        const { start_time: start_time_str, end_time: end_time_str } = active_energy_points[i];
        let start_time = convertISOToTimestamp(start_time_str) / 1000;
        let end_time = convertISOToTimestamp(end_time_str) / 1000;

        let mergedPoint = {
            start_time: start_time,
            end_time: end_time,
            active_energy: (active_energy_points[i] as CounterLogPoint).value,
            reactive_energy: (reactive_energy_points[i] as CounterLogPoint).value,
            power_factor: (pf_points[i] as SingleValueLogPoint).value,
            power_factor_direction: (pf_direction_points[i] as SingleValueLogPoint).value,

        } as ProcessedEnergyConsumptionLogPoint;

        mergedPoints.push(mergedPoint);
    }

    mergedGlobalMetrics = {
        active_energy: (energyLogs.active_energy.global_metrics as CounterMetrics).value,
        reactive_energy: (energyLogs.reactive_energy.global_metrics as CounterMetrics).value,
        power_factor: ((energyLogs.power_factor.global_metrics as SingleValueMetrics).value as number),
        power_factor_direction: ((energyLogs.power_factor_direction.global_metrics as SingleValueMetrics).value as string),
    }


    return { mergedPoints, mergedGlobalMetrics };
}
