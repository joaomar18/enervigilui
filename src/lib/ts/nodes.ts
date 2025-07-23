import { get } from "svelte/store";
import { Protocol, type EditableDeviceMeter } from "$lib/stores/devices";
import { NodeType } from "$lib/stores/nodes";
import { defaultVariables } from "$lib/stores/nodes";
import { defaultVariableNames } from "$lib/stores/nodes";
import { defaultVariableUnits } from "$lib/stores/nodes";
import { NodePrefix, NodePhase } from "$lib/stores/nodes";
import type { NodeConfiguration, EditableBaseNodeConfig, NodeModbusRTUConfig, NodeOPCUAConfig, EditableNodeConfiguration, DeviceNode, EditableDeviceNode, NodeEditState } from "$lib/stores/nodes";

/**
 * Converts a record of DeviceNode objects into an array of EditableDeviceNode objects for UI editing.
 * Each node's configuration is transformed into editable string-based fields for form input and validation.
 * The resulting array is sorted by display name for consistent UI ordering.
 *
 * @param nodes Record of DeviceNode objects to convert
 * @returns Array of editable device nodes ready for UI forms
 */
export function convertToEditableNodes(nodes: Record<string, DeviceNode>): Array<EditableDeviceNode> {

    let editableNodes: Array<EditableDeviceNode> = [];

    for (let node of Object.values(nodes)) {
        let editableNode: EditableDeviceNode;
        let protocol = node.protocol;
        let editableConfig: EditableNodeConfiguration;
        let editableBaseConfig: EditableBaseNodeConfig = {
            calculate_increment: node.config.calculate_increment,
            calculated: node.config.calculated,
            custom: node.config.custom,
            decimal_places: node.config.decimal_places.toString(),
            enabled: node.config.enabled,
            incremental_node: node.config.incremental_node,
            logging: node.config.logging,
            logging_period: node.config.logging_period.toString(),
            max_alarm: node.config.max_alarm,
            max_alarm_value: node.config.max_alarm_value.toString(),
            min_alarm: node.config.min_alarm,
            min_alarm_value: node.config.min_alarm_value.toString(),
            positive_incremental: node.config.positive_incremental,
            publish: node.config.publish,
            type: node.config.type,
            unit: node.config.unit,
        };

        if (protocol === Protocol.OPC_UA) {
            editableConfig = {
                ...editableBaseConfig,
                node_id: (node.config as NodeOPCUAConfig).node_id,
            }
        }
        else if (protocol === Protocol.MODBUS_RTU) {
            editableConfig = {
                ...editableBaseConfig,
                register: (node.config as NodeModbusRTUConfig).register.toString(),
            }
        }
        else {
            editableConfig = {
                ...editableBaseConfig,
            }
        }

        editableNode = {
            name: node.name,
            device_id: node.device_id,
            protocol: node.protocol,
            display_name: removePrefix(node.name),
            phase: getNodePhase(node.name),
            communication_id: getCommunicationID(node.protocol, editableConfig),
            config: editableConfig,
        }

        editableNodes.push(editableNode);


    }

    editableNodes = editableNodes.sort((a, b) => a.display_name.localeCompare(b.display_name));

    return editableNodes;
}


/**
 * Validates a node name based on whether it is a custom or default variable.
 * For custom variables, checks uniqueness, non-empty, no whitespace, and valid characters.
 * For default variables, checks existence in the default names list.
 * Also checks for duplicate display names in the current nodes array.
 *
 * @param nodeName The display name of the node (without prefix)
 * @param customVariable True for custom variable, false for default variable
 * @param currentNodes Optional array of nodes to check for duplicates
 * @returns True if the node name is valid
 */
export function validateNodeName(nodeName: string, customVariable: boolean, currentNodes?: Array<EditableDeviceNode>): boolean {
    const names: Array<string> = get(defaultVariableNames);

    // Check for duplicates in current nodes
    if (currentNodes) {
        const nodeCount = Object.values(currentNodes).filter((node: EditableDeviceNode) => node.display_name === nodeName).length;
        if (nodeCount >= 2) {
            return false;
        }
    }

    if (customVariable) {
        // For custom variables, check if name exists in default names (custom nodes can't use default names)
        if (names.includes(nodeName)) {
            return false;
        }

        // Check if name is empty or contains any whitespace
        if (!nodeName || nodeName.length === 0 || /\s/.test(nodeName)) {
            return false;
        }

        // Check if name contains only alphabetical characters, underscores, and numbers (but can't start with a number)
        const namePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        return namePattern.test(nodeName);
    } else {
        // For default variables, just check if it exists in the default names
        return names.includes(nodeName);
    }
}

/**
 * Validates the unit of a node variable based on its type and whether it is custom or default.
 * For custom variables, checks if the unit is empty for STRING/BOOLEAN, or non-empty for others.
 * For default variables, checks if the unit is allowed for the given node name.
 *
 * @param nodeName The name of the node variable
 * @param nodeType The type of the node variable
 * @param nodeUnit The unit string to validate
 * @param customVariable True for custom variable, false for default variable
 * @returns True if the unit is valid
 */
export function validateNodeUnit(nodeName: string, nodeType: NodeType, nodeUnit: string, customVariable: boolean): boolean {
    if (customVariable) {
        if (nodeType === NodeType.STRING || nodeType === NodeType.BOOLEAN) {
            return !(nodeUnit && nodeUnit.trim().length > 0);
        }
        else {
            return Boolean(nodeUnit && nodeUnit.trim().length > 0);
        }
    } else {
        const units: Array<string> = get(defaultVariableUnits)[nodeName] || [];
        if (units.includes(nodeUnit)) {
            return true;
        }
        return false;
    }
}

/**
 * Validates the communication ID for a node based on the selected protocol.
 * Checks format and value for MODBUS_RTU and OPC_UA protocols, or emptiness for NONE.
 *
 * @param communicationID Communication ID string to validate
 * @param protocol Protocol type
 * @returns True if the communication ID is valid
 */
export function validateCommunicationID(communicationID: string | undefined, protocol: Protocol): boolean {

    if (!communicationID) {
        return protocol === Protocol.NONE;
    }

    const trimmedId = communicationID.trim();

    switch (protocol) {
        case Protocol.NONE:
            return trimmedId.length === 0;

        case Protocol.MODBUS_RTU:
            // Check format: must be "0x" followed by 1-4 hex digits
            const modbusPattern = /^0x[0-9A-Fa-f]{1,4}$/;
            if (!modbusPattern.test(trimmedId)) {
                return false;
            }
            const value = parseInt(trimmedId.substring(2), 16);
            return value >= 0 && value <= 0xFFFF;

        case Protocol.OPC_UA:
            const opcuaPattern = /^ns=\d+;(i=\d+|s=[^;]+|g=[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{12}|b=[A-Za-z0-9+/=]+)$/;
            return opcuaPattern.test(trimmedId);

        default:
            return false;
    }
}

/**
 * Validates the type of a node variable based on whether it is custom or default.
 * For custom variables, always returns true. For default variables, checks if the type is allowed for the variable name.
 *
 * @param type NodeType to validate
 * @param name Name of the node variable
 * @param custom True for custom variable, false for default variable
 * @returns True if the type is valid
 */
export function validateNodeType(type: NodeType, name: string, custom: boolean): boolean {
    if (custom) {
        return true;
    } else {
        // For default variables, check if the type is in the applicable types
        const variables = get(defaultVariables);
        const variable = Object.values(variables).find(v => v.name === name);

        if (variable && variable.applicableTypes) {
            return variable.applicableTypes.includes(type);
        }

        return false;
    }
}

/**
 * Checks if a node can potentially be virtual based on basic criteria.
 * Custom nodes are never virtual. Default nodes must exist and have canBeVirtual = true.
 * Does not check dependencies; for full validation use virtualNodeRules.ts.
 *
 * @param name Display name of the node variable (without prefix)
 * @param custom True for custom variable, false for default variable
 * @returns True if the node can potentially be virtual
 */
export function validateVirtualNode(name: string, custom: boolean): boolean {
    if (custom) { // Custom nodes can't be virtual
        return false;
    }
    const variables = get(defaultVariables);
    const variable = Object.values(variables).find(v => v.name === name);
    if (variable) {
        if (variable.canBeVirtual) {
            return true;
        }
    }
    return false;
}

/**
 * Handles node name changes, updating the name and unit based on phase and custom/default status.
 * Prefixes the display name and sets the unit for default variables.
 *
 * @param node Node object to update
 * @param phase Phase to use for the name prefix
 */
export function nodeNameChange(node: EditableDeviceNode, phase: NodePhase): void {
    const newName = getNodePrefix(phase) + node.display_name;
    const currentDefaultVariables = get(defaultVariables);
    node.name = newName;
    if (!node.config.custom) {
        const defaultNodeProps = Object.values(currentDefaultVariables).find((v) => v.name === node.display_name);
        node.config.unit = defaultNodeProps?.defaultUnit || "";
    }
}

/**
 * Updates the unit of a node when its type changes.
 * For default variables, sets the unit for FLOAT/INT or clears for STRING/BOOLEAN. Does not affect custom variables.
 *
 * @param node Node object to update
 * @param nodeState Previous edit state of the node
 */
export function nodeTypeChange(node: EditableDeviceNode, nodeState: NodeEditState): void {

    if (!node.config.custom) {
        if (node.config.type === NodeType.FLOAT || node.config.type === NodeType.INT) {

            if (nodeState.oldVariableUnit) {
                node.config.unit = nodeState.oldVariableUnit;
            }
            else {
                const currentDefaultVariables = get(defaultVariables);
                const defaultNodeProps = Object.values(currentDefaultVariables).find((v) => v.name === node.display_name);
                node.config.unit = defaultNodeProps?.defaultUnit || "";
            }


        } else if (node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN) {

            nodeState.oldVariableUnit = node.config.unit;
            node.config.unit = "";

        }
    }
}

/**
 * Handles changes to a node's custom status, updating name and unit accordingly.
 * Clears or restores display name and unit, and updates the name prefix.
 *
 * @param node Node object to update
 * @param nodeState Previous edit state of the node
 * @param phase Phase to use for the name prefix
 */
export function customNodeChange(node: EditableDeviceNode, nodeState: NodeEditState, phase: NodePhase): void {
    if (node.config.custom) {
        nodeState.oldVariableName = node.display_name;
        nodeState.oldVariableUnit = node.config.unit;
        node.display_name = "";
        node.config.unit = "";
    } else {
        node.display_name = nodeState.oldVariableName;
        node.config.unit = nodeState.oldVariableUnit;
    }
    node.name = getNodePrefix(phase) + node.display_name;
}

/**
 * Handles changes to a node's virtual/calculated status, updating communication ID and protocol.
 * Saves or restores the communication ID and sets the protocol as needed.
 *
 * @param node Node object to update
 * @param nodeState Previous edit state of the node
 * @param selectedProtocol Protocol to set if no longer calculated
 */
export function virtualNodeChange(node: EditableDeviceNode, nodeState: NodeEditState, selectedProtocol: Protocol): void {
    if (node.config.calculated && node.communication_id !== undefined) {
        nodeState.oldCommunicationID = node.communication_id;
        node.communication_id = '';
        node.protocol = Protocol.NONE;
    } else if (!node.config.calculated && !node.communication_id) {
        node.communication_id = nodeState.oldCommunicationID ? nodeState.oldCommunicationID : "";
        node.protocol = selectedProtocol;
    }
}

/**
 * Determines the node phase from its name prefix.
 * Returns the corresponding NodePhase enum value or GENERAL if no match.
 *
 * @param name Node variable name to check
 * @returns Detected phase or GENERAL
 */
export function getNodePhase(name: string): NodePhase {

    if (name.startsWith(NodePrefix.L1) && !name.startsWith(NodePrefix.L1_L2) && !name.startsWith(NodePrefix.L1_L3)) {
        return NodePhase.L1;
    }
    else if (name.startsWith(NodePrefix.L2) && !name.startsWith(NodePrefix.L2_L1) && !name.startsWith(NodePrefix.L2_L3)) {
        return NodePhase.L2;
    }
    else if (name.startsWith(NodePrefix.L3) && !name.startsWith(NodePrefix.L3_L1) && !name.startsWith(NodePrefix.L3_L2)) {
        return NodePhase.L3;
    }
    else if (name.startsWith(NodePrefix.TOTAL)) {
        return NodePhase.TOTAL;
    }
    else {
        return NodePhase.GENERAL;
    }
}

/**
 * Maps NodePhase enum to the corresponding prefix used in node names.
 *
 * @param phase NodePhase value
 * @returns Corresponding prefix string
 */
export function getNodePrefix(phase: NodePhase): string {
    switch (phase) {
        case NodePhase.L1:
            return NodePrefix.L1;
        case NodePhase.L2:
            return NodePrefix.L2;
        case NodePhase.L3:
            return NodePrefix.L3;
        case NodePhase.TOTAL:
            return NodePrefix.TOTAL;
        case NodePhase.GENERAL:
            return NodePrefix.GENERAL;
        case NodePhase.SINGLEPHASE:
            return NodePrefix.SINGLEPHASE;
        default:
            return "";
    }
}

/**
 * Removes the phase or section prefix from a node variable name, if present.
 * Checks all possible prefixes, prioritizing longer ones, and handles special cases for line-to-line prefixes.
 *
 * @param name Node variable name to process
 * @returns Name without the phase/section prefix, or original name if no prefix is found
 */
export function removePrefix(name: string): string {
    const prefixes = Object.values(NodePrefix).sort((a, b) => b.length - a.length);

    for (const prefix of prefixes) {
        if (name.startsWith(prefix)) {
            if (name.startsWith(NodePrefix.L1) && !name.startsWith(NodePrefix.L1_L2) && !name.startsWith(NodePrefix.L1_L3)) {
                return name.slice(prefix.length);
            } else if (name.startsWith(NodePrefix.L2) && !name.startsWith(NodePrefix.L2_L1) && !name.startsWith(NodePrefix.L2_L3)) {
                return name.slice(prefix.length);
            } else if (name.startsWith(NodePrefix.L3) && !name.startsWith(NodePrefix.L3_L1) && !name.startsWith(NodePrefix.L3_L2)) {
                return name.slice(prefix.length);
            } else if (
                name.startsWith(NodePrefix.L1_L2) ||
                name.startsWith(NodePrefix.L1_L3) ||
                name.startsWith(NodePrefix.L2_L1) ||
                name.startsWith(NodePrefix.L2_L3) ||
                name.startsWith(NodePrefix.L3_L1) ||
                name.startsWith(NodePrefix.L3_L2)
            ) {
                return name;
            } else {
                return name.slice(prefix.length);
            }
        }
    }

    return name;
}

/**
 * Adds a phase or section prefix to a node variable name.
 *
 * @param name Base node variable name
 * @param prefix Prefix to add
 * @returns Prefixed node variable name
 */
export function addPrefix(name: string, prefix: NodePrefix): string {
    return prefix + name;
}

/**
 * Retrieves the communication ID for a device node based on its protocol and configuration.
 * For OPC UA nodes, returns the node_id string. For Modbus RTU nodes, returns the register as a hex string. Otherwise returns empty string.
 *
 * @param protocol Node protocol
 * @param config Node configuration
 * @returns Communication ID string or empty string
 */
export function getCommunicationID(protocol: Protocol, config: NodeConfiguration | EditableNodeConfiguration): string {
    if (!config) return '';

    if (protocol === Protocol.OPC_UA && "node_id" in config) {
        const nodeId = config.node_id;
        return nodeId;
    } else if (protocol === Protocol.MODBUS_RTU && "register" in config) {
        const reg = config.register;
        return "0x" + Number(reg).toString(16).toUpperCase().padStart(4, "0");
    }

    return '';
}

/**
 * Creates and returns a new node object for the specified section and device data.
 * Initializes the node with default configuration based on the selected protocol.
 * The returned node can be appended to your nodes array for further configuration or display.
 *
 * @param sectionPrefix Prefix to use for the node name
 * @param deviceData Device data containing protocol and device ID
 * @returns Newly created node ready to be appended to the nodes array
 */
export function addNode(sectionPrefix: NodePrefix, deviceData: EditableDeviceMeter): EditableDeviceNode {
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
        max_alarm_value: String(0.0),
        min_alarm: false,
        min_alarm_value: String(0.0),
        positive_incremental: true,
        type: NodeType.FLOAT,
        unit: "",
        publish: true,
    };

    let newNodeConfiguration: EditableNodeConfiguration;

    if (deviceData.protocol === Protocol.MODBUS_RTU) {
        // Modbus RTU Protocol
        newNodeConfiguration = {
            ...newBaseConfiguration,
            register: "0x" + Number(0).toString(16).toUpperCase().padStart(4, "0"),
        };
    } else if (deviceData.protocol === Protocol.OPC_UA) {
        // OPC UA Protocol
        newNodeConfiguration = {
            ...newBaseConfiguration,
            node_id: "",
        };
    } else {
        throw new Error("Unsupported protocol");
    }

    const newFormattedNode: EditableDeviceNode = {
        device_id: deviceData.id,
        name: fullNodeName,
        protocol: deviceData.protocol,
        config: newNodeConfiguration,
        display_name: nodeBaseName,
        phase: getNodePhase(fullNodeName),
        communication_id: getCommunicationID(deviceData.protocol, newNodeConfiguration),
    };

    return newFormattedNode;
}

/**
 * Returns the index of a node in the given array of editable device nodes.
 *
 * @param node The node to find
 * @param nodesArray Array of editable device nodes
 * @returns Index of the node in the array, or -1 if not found
 */
export function getNodeIndex(node: EditableDeviceNode, nodesArray: Array<EditableDeviceNode>): number {
    return nodesArray.findIndex((n) => n === node);
}