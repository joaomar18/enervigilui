import { get } from "svelte/store";
import { MeterType, Protocol } from "$lib/types/device/base";
import { NodeType, NodePhase, NodePrefix, nodeSections } from "$lib/types/nodes/base";
import type { EditableDeviceMeter, NewDeviceMeter } from "$lib/types/device/base";
import type {
    DeviceNode,
    EditableDeviceNode,
    EditableNodeConfiguration,
    EditableBaseNodeConfig,
    NodeConfiguration,
    DefaultNodeInfo,
} from "$lib/types/nodes/base";
import type { NodeOPCUAConfig } from "$lib/types/nodes/opcUa";
import type { NodeModbusRTUConfig } from "$lib/types/nodes/modbusRtu";
import { defaultVariables } from "$lib/stores/device/variables";
import { addPrefix, removePrefix, getNodePhase, getNodePrefix, getCommunicationID, getInitialCommunicationID, sortNodesByName } from "../util/nodes";
import { getInitialNodeValidation } from "../validation/nodes/base";
import { stringIsValidInteger, stringIsValidFloat } from "$lib/logic/util/generic";

/**
 * Converts DeviceNode[] to EditableDeviceNode[] for UI forms.
 * @param nodes - DeviceNode array.
 * @param meter_type - Meter type.
 * @returns EditableDeviceNode array.
 */
export function convertToEditableNodes(nodes: Array<DeviceNode>, meter_type: MeterType): Array<EditableDeviceNode> {
    let editableNodes: Array<EditableDeviceNode> = [];

    for (let node of nodes) {
        let editableNode: EditableDeviceNode;

        let decimal_places: string = node.config.decimal_places !== null ? node.config.decimal_places.toString() : "";
        let number_decimal_places: number = decimal_places ? parseInt(decimal_places) : 0;

        let editableConfig: EditableNodeConfiguration;
        let editableBaseConfig: EditableBaseNodeConfig = {
            calculate_increment: node.config.calculate_increment ? node.config.calculate_increment : false,
            calculated: node.config.calculated,
            custom: node.config.custom,
            decimal_places: decimal_places,
            enabled: node.config.enabled,
            incremental_node: node.config.incremental_node ? node.config.incremental_node : false,
            logging: node.config.logging,
            logging_period: node.config.logging_period.toString(),
            max_alarm: node.config.max_alarm,
            max_alarm_value: node.config.max_alarm_value !== null ? node.config.max_alarm_value.toFixed(number_decimal_places) : "",
            min_alarm: node.config.min_alarm,
            min_alarm_value: node.config.min_alarm_value !== null ? node.config.min_alarm_value.toFixed(number_decimal_places) : "",
            positive_incremental: node.config.positive_incremental ? node.config.positive_incremental : false,
            publish: node.config.publish,
            type: node.config.type,
            unit: node.config.unit !== null ? node.config.unit : "",
        };

        if (node.protocol === Protocol.OPC_UA) {
            editableConfig = {
                ...editableBaseConfig,
                node_id: (node.config as NodeOPCUAConfig).node_id,
            };
        } else if (node.protocol === Protocol.MODBUS_RTU) {
            editableConfig = {
                ...editableBaseConfig,
                register: (node.config as NodeModbusRTUConfig).register.toString(),
            };
        } else {
            editableConfig = {
                ...editableBaseConfig,
            };
        }

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
        let nodeConfig: NodeConfiguration;
        let numericType = editableNode.config.type === NodeType.FLOAT || editableNode.config.type === NodeType.INT;

        // Convert base configuration with proper type conversion
        const baseConfig = {
            calculate_increment: numericType ? editableNode.config.calculate_increment : null,
            calculated: editableNode.config.calculated,
            custom: editableNode.config.custom,
            decimal_places: stringIsValidInteger(editableNode.config.decimal_places) ? parseInt(editableNode.config.decimal_places) : null,
            enabled: editableNode.config.enabled,
            incremental_node: numericType ? editableNode.config.incremental_node : null,
            logging: editableNode.config.logging,
            logging_period: parseInt(editableNode.config.logging_period),
            max_alarm: editableNode.config.max_alarm,
            max_alarm_value: stringIsValidFloat(editableNode.config.max_alarm_value) ? parseFloat(editableNode.config.max_alarm_value) : null,
            min_alarm: editableNode.config.min_alarm,
            min_alarm_value: stringIsValidFloat(editableNode.config.min_alarm_value) ? parseFloat(editableNode.config.min_alarm_value) : null,
            positive_incremental: numericType ? editableNode.config.positive_incremental : null,
            publish: editableNode.config.publish,
            type: editableNode.config.type,
            unit: numericType ? editableNode.config.unit : null,
        };

        // Handle protocol-specific configuration
        if (editableNode.protocol === Protocol.OPC_UA) {
            nodeConfig = {
                ...baseConfig,
                node_id: editableNode.communication_id,
            };
        } else if (editableNode.protocol === Protocol.MODBUS_RTU) {
            nodeConfig = {
                ...baseConfig,
                register: parseInt(editableNode.communication_id.replace("0x", ""), 16),
            };
        } else if (editableNode.protocol === Protocol.NONE) {
            // For virtual/calculated nodes with no communication protocol
            nodeConfig = {
                ...baseConfig,
            };
        } else {
            throw new Error(`Unsupported protocol: ${editableNode.protocol}`);
        }

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

    let nodeConfiguration: EditableNodeConfiguration;

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

    const nodeBaseConfiguration: EditableBaseNodeConfig = {
        calculate_increment: variable.isIncrementalNode && !device_data.options.read_energy_from_meter,
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
        positive_incremental: variable.isIncrementalNode && !device_data.options.read_energy_from_meter,
        publish: variable.defaultPublished,
        type: variable.type,
        unit: variable.defaultUnit,
    };

    if (device_data.protocol === Protocol.MODBUS_RTU) {
        // Modbus RTU Protocol
        nodeConfiguration = {
            ...nodeBaseConfiguration,
            register: getInitialCommunicationID(Protocol.MODBUS_RTU),
        };
    } else if (device_data.protocol === Protocol.OPC_UA) {
        // OPC UA Protocol
        nodeConfiguration = {
            ...nodeBaseConfiguration,
            node_id: getInitialCommunicationID(Protocol.OPC_UA),
        };
    } else {
        throw new Error("Unsupported protocol");
    }

    let node: EditableDeviceNode = {
        device_id: "id" in device_data ? device_data.id : undefined,
        name: full_name,
        protocol: device_data.protocol,
        config: nodeConfiguration,
        display_name: variable.name,
        phase: phase,
        communication_id: getCommunicationID(device_data.protocol, nodeConfiguration, true),
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

    const newBaseConfiguration: EditableBaseNodeConfig = {
        calculate_increment: true,
        calculated: false,
        custom: true,
        decimal_places: String(2),
        enabled: true,
        incremental_node: false,
        logging: false,
        logging_period: String(15),
        max_alarm: false,
        max_alarm_value: Number(0).toFixed(2),
        min_alarm: false,
        min_alarm_value: Number(0).toFixed(2),
        positive_incremental: true,
        type: NodeType.FLOAT,
        unit: "",
        publish: true,
    };

    let newNodeConfiguration: EditableNodeConfiguration;

    if (device_data.protocol === Protocol.MODBUS_RTU) {
        // Modbus RTU Protocol
        newNodeConfiguration = {
            ...newBaseConfiguration,
            register: getInitialCommunicationID(Protocol.MODBUS_RTU),
        };
    } else if (device_data.protocol === Protocol.OPC_UA) {
        // OPC UA Protocol
        newNodeConfiguration = {
            ...newBaseConfiguration,
            node_id: getInitialCommunicationID(Protocol.OPC_UA),
        };
    } else {
        throw new Error("Unsupported protocol");
    }

    const newFormattedNode: EditableDeviceNode = {
        device_id: "id" in device_data ? device_data.id : undefined,
        name: fullNodeName,
        protocol: device_data.protocol,
        config: newNodeConfiguration,
        display_name: nodeBaseName,
        phase: getNodePhase(fullNodeName, device_data.type),
        communication_id: getCommunicationID(device_data.protocol, newNodeConfiguration, true),
        validation: getInitialNodeValidation(),
    };

    return newFormattedNode;
}
