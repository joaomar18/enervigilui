import { get } from "svelte/store";
import { MeterType } from "$lib/types/device/base";
import { NodeType, NodePhase, NodePrefix, nodeSections } from "$lib/types/nodes/base";
import type { EditableDeviceMeter, MeterOptions, NewDeviceMeter } from "$lib/types/device/base";
import type { DeviceNode, EditableDeviceNode, EditableBaseNodeConfig, DefaultNodeInfo, BaseNodeConfig } from "$lib/types/nodes/base";
import { defaultVariables } from "$lib/stores/device/variables";
import { addPrefix, removePrefix, getNodePhase, getNodePrefix, getCommunicationID, sortNodesByName } from "../util/nodes";
import { getInitialNodeValidation } from "../validation/nodes/base";
import { stringIsValidInteger, stringIsValidFloat } from "$lib/logic/util/generic";
import { protocolPlugins } from "$lib/stores/device/protocol";
import { normalizeNode } from "../util/nodes";

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
 * Converts DeviceNode[] to EditableDeviceNode[] for UI forms.
 * @param nodes - DeviceNode array.
 * @param meter_type - Meter type.
 * @returns EditableDeviceNode array.
 */
export function convertToEditableNodes(nodes: Array<DeviceNode>, meter_type: MeterType): Array<EditableDeviceNode> {
    let editableNodes: Array<EditableDeviceNode> = [];

    for (const node of nodes) {
        let editableNode: EditableDeviceNode;
        let plugin = get(protocolPlugins)[node.protocol];
        let editableConfig: EditableBaseNodeConfig = plugin.convertNodeConfigToEditable(node.config);

        editableNode = {
            name: node.name,
            device_id: node.device_id,
            protocol: node.protocol,
            display_name: removePrefix(node.name),
            phase: getNodePhase(node.name, meter_type),
            communication_id: getCommunicationID(node.protocol, editableConfig),
            validation: getInitialNodeValidation(),
            config: editableConfig,
        };

        editableNodes.push(editableNode);
    }

    return sortNodesByName(editableNodes) as Array<EditableDeviceNode>;
}

/**
 * Converts EditableDeviceNode[] to DeviceNode[] for API.
 * @param nodes - EditableDeviceNode array.
 * @returns DeviceNode array.
 */
export function convertToNodes(nodes: Array<EditableDeviceNode>): Array<DeviceNode> {
    const deviceNodes: Array<DeviceNode> = [];

    for (const editableNode of nodes) {
        let plugin = get(protocolPlugins)[editableNode.protocol];
        let nodeConfig: BaseNodeConfig = plugin.convertNodeConfigToNormal(editableNode.config);

        const deviceNode: DeviceNode = {
            name: editableNode.name,
            device_id: editableNode.device_id,
            protocol: editableNode.protocol,
            config: nodeConfig,
        };

        deviceNodes.push(deviceNode);
    }

    return sortNodesByName(deviceNodes) as Array<DeviceNode>;
}

/**
 * Processes and normalizes an array of DeviceNode objects using protocol-specific logic.
 * Used to sanitize initial node data before further conversion or use.
 * @param nodes - Array of DeviceNode objects to process.
 * @returns Array of normalized DeviceNode objects.
 */
export function processInitialNodes(nodes: Array<DeviceNode>): Array<DeviceNode> {
    const deviceNodes: Array<DeviceNode> = [];

    for (const node of nodes) {
        let plugin = get(protocolPlugins)[node.protocol];
        let nodeConfig: BaseNodeConfig = plugin.processInitialNodeConfig(node.config);

        const deviceNode: DeviceNode = {
            name: node.name,
            device_id: node.device_id,
            protocol: node.protocol,
            config: nodeConfig,
        };

        deviceNodes.push(deviceNode);
    }

    return (sortNodesByName(deviceNodes) as Array<DeviceNode>).map(normalizeNode);
}

/**
 * Creates a default editable node for a variable and phase.
 * @param variable - Default variable info.
 * @param phase - Node phase.
 * @param device_data - Device config.
 * @returns EditableDeviceNode.
 */
function createDefaultEditableDeviceNode(
    variable: DefaultNodeInfo,
    phase: NodePhase,
    device_data: EditableDeviceMeter | NewDeviceMeter
): EditableDeviceNode {
    const full_name = getNodePrefix(phase) + variable.name;
    let plugin = get(protocolPlugins)[device_data.protocol];
    let editableConfig = plugin.createNodeConfigFromDefaultVar(variable, device_data.options);

    let node: EditableDeviceNode = {
        device_id: "id" in device_data ? device_data.id : undefined,
        name: full_name,
        protocol: device_data.protocol,
        config: editableConfig,
        display_name: variable.name,
        phase: phase,
        communication_id: getCommunicationID(device_data.protocol, editableConfig, true),
        validation: getInitialNodeValidation(),
    };

    return node;
}

/**
 * Returns default editable nodes for a device config.
 * @param device_data EditableDeviceMeter or NewDeviceMeter.
 * @returns Sorted array of editable device nodes.
 */
export function getDefaultNodesList(device_data: EditableDeviceMeter | NewDeviceMeter): Array<EditableDeviceNode> {
    const nodes: Array<EditableDeviceNode> = [];
    const defaultVars = get(defaultVariables);

    if (device_data.type === MeterType.SINGLE_PHASE) {
        const singlePhaseVars = defaultVars.filter((v) => v.applicablePhases.includes(NodePhase.SINGLEPHASE) && v.useByDefault);

        for (const variable of singlePhaseVars) {
            nodes.push(createDefaultEditableDeviceNode(variable, NodePhase.SINGLEPHASE, device_data));
        }
    } else if (device_data.type === MeterType.THREE_PHASE) {
        const threePhaseeSections = nodeSections.filter((section) => section.phase !== NodePhase.SINGLEPHASE);

        for (const section of threePhaseeSections) {
            const phaseVars = defaultVars.filter((v) => v.useByDefault && v.applicablePhases.includes(section.phase));

            for (const variable of phaseVars) {
                nodes.push(createDefaultEditableDeviceNode(variable, section.phase, device_data));
            }
        }
    }

    return sortNodesByName(nodes) as Array<EditableDeviceNode>;
}

/**
 * Creates a new node for a section and device.
 * @param sectionPrefix - Node name prefix.
 * @param device_data - Device config.
 * @returns EditableDeviceNode.
 */
export function addNode(sectionPrefix: NodePrefix, device_data: EditableDeviceMeter | NewDeviceMeter): EditableDeviceNode {
    const nodeBaseName = ``;
    const fullNodeName = addPrefix(nodeBaseName, sectionPrefix);

    let plugin = get(protocolPlugins)[device_data.protocol];
    let newEditableConfig = plugin.createNewEditableNodeConfig();

    const newFormattedNode: EditableDeviceNode = {
        device_id: "id" in device_data ? device_data.id : undefined,
        name: fullNodeName,
        protocol: device_data.protocol,
        config: newEditableConfig,
        display_name: nodeBaseName,
        phase: getNodePhase(fullNodeName, device_data.type),
        communication_id: getCommunicationID(device_data.protocol, newEditableConfig, true),
        validation: getInitialNodeValidation(),
    };

    return newFormattedNode;
}
