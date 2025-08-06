import { get } from "svelte/store";
import { MeterType, Protocol, type EditableDeviceMeter, type NewDeviceMeter } from "$lib/stores/devices";
import { nodeSections, NodeType, NodePrefix, NodePhase, defaultVariables, defaultVariableNames, defaultVariableUnits } from "$lib/stores/nodes";
import { DECIMAL_PLACES_LIM, LOGGING_PERIOD_LIM } from "$lib/stores/nodes";
import { getInitialNodeValidation } from "$lib/stores/nodes";
import type { NodeConfiguration, EditableBaseNodeConfig, NodeModbusRTUConfig, NodeOPCUAConfig, EditableNodeConfiguration, DeviceNode, EditableDeviceNode, NodeEditState, DefaultNodeInfo, EditableNodeOPCUAConfig, EditableNodeModbusRTUConfig } from "$lib/stores/nodes";
import { protocolTexts } from "$lib/stores/lang";
import { stringIsValidInteger, stringIsValidFloat } from "./util";
import isEqualPkg from "lodash";
const { isEqual } = isEqualPkg;

/**
 * Converts an array of DeviceNode objects into an array of EditableDeviceNode objects for UI editing.
 * Each node's configuration is transformed into editable string-based fields for form input and validation.
 * The resulting array is sorted by display name for consistent UI ordering.
 *
 * @param nodes Array of DeviceNode objects to convert
 * @param meter_type Type of meter (SINGLE_PHASE or THREE_PHASE) used to determine node phases
 * @returns Array of editable device nodes ready for UI forms
 * 
 * @description This conversion is necessary because:
 * - Form inputs require string types for proper binding and validation
 * - Numeric values (decimal_places, logging_period, register, alarm values) are converted to strings
 * - Additional UI properties are added: display_name, phase, communication_id, validation
 * - Protocol-specific configuration is handled (OPC UA node_id vs Modbus RTU register)
 * - The original node structure is preserved with editable string-based configuration
 * - Validation state is initialized for all configuration properties
 * - Communication ID is formatted appropriately for each protocol (hex for Modbus, string for OPC UA)
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
            }
        }
        else if (node.protocol === Protocol.MODBUS_RTU) {
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
            phase: getNodePhase(node.name, meter_type),
            communication_id: getCommunicationID(node.protocol, editableConfig),
            validation: getInitialNodeValidation(),
            config: editableConfig,
        }

        editableNodes.push(editableNode);


    }

    return sortNodesByName(editableNodes) as Array<EditableDeviceNode>;
}

/**
 * Converts an array of EditableDeviceNode objects back to an array of DeviceNode objects for API operations.
 * This function transforms the editable node configurations from form-compatible string-based values
 * back to the proper data types required by the backend API.
 *
 * @param nodes Array of EditableDeviceNode objects to convert
 * @returns Array of DeviceNode objects ready for API operations
 * @throws {Error} Throws an error if a node protocol is not supported
 *
 * @description This conversion is necessary because:
 * - API expects numeric values instead of string representations from forms
 * - String numeric values are parsed back to numbers for API compatibility
 * - The editable structure is transformed back to the original node structure
 * - Protocol-specific configuration properties are properly typed
 * - Form-specific properties (validation, communication_id, display_name, phase) are excluded
 *
 * @example
 * ```typescript
 * const editableNodes: EditableDeviceNode[] = [
 *   {
 *     name: "L1_voltage",
 *     protocol: Protocol.MODBUS_RTU,
 *     config: {
 *       decimal_places: "2",
 *       logging_period: "15",
 *       register: "0x0001",
 *       // ... other editable properties
 *     }
 *     // ... other properties
 *   }
 * ];
 * 
 * const nodes = convertToNodes(editableNodes);
 * // Now suitable for API operations with proper numeric types
 * // nodes[0].config.decimal_places will be 2 (number)
 * // nodes[0].config.logging_period will be 15 (number)
 * ```
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
                register: parseInt(editableNode.communication_id.replace('0x', ''), 16),
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
 * Generates the default list of editable device nodes for a given device configuration.
 *
 * Accepts either an EditableDeviceMeter or NewDeviceMeter (for new or existing devices).
 * For single-phase meters, includes all default variables applicable to single-phase and marked for default use.
 * For three-phase meters, includes all default variables for each phase section, filtered by applicability and default use.
 * Each node is initialized with default configuration and sorted by display name for consistent UI ordering.
 *
 * @param device_data The device meter configuration (EditableDeviceMeter or NewDeviceMeter)
 * @returns Array of editable device nodes with default configuration, sorted by display name
 */
export function getDefaultNodesList(device_data: EditableDeviceMeter | NewDeviceMeter): Array<EditableDeviceNode> {
    const nodes: Array<EditableDeviceNode> = [];
    const defaultVars = get(defaultVariables);

    if (device_data.type === MeterType.SINGLE_PHASE) {

        const singlePhaseVars = defaultVars.filter((v) => v.applicablePhases.includes(NodePhase.SINGLEPHASE) && v.useByDefault);

        for (const variable of singlePhaseVars) {
            nodes.push(createDefaultEditableDeviceNode(variable, NodePhase.SINGLEPHASE, device_data));
        }

    }

    else if (device_data.type === MeterType.THREE_PHASE) {

        const threePhaseeSections = nodeSections.filter(section => section.phase !== NodePhase.SINGLEPHASE);

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
 * Sorts an array of nodes alphabetically by their display name (without prefix).
 * 
 * @param nodes Array of nodes to sort
 * @returns Sorted array of nodes
 */
export function sortNodesByName(nodes: Array<EditableDeviceNode | DeviceNode>): Array<EditableDeviceNode | DeviceNode> {
    return nodes.sort((a, b) => removePrefix(a.name).localeCompare(removePrefix(b.name)));
}

/**
 * Creates a default editable device node for a given variable, phase, and device configuration.
 *
 * Accepts either an EditableDeviceMeter (for editing an existing device) or a NewDeviceMeter (for creating a new device).
 * Initializes the node's name, configuration, and communication ID based on the selected protocol and phase.
 * The node is set up with default values for all editable fields, ready for use in device configuration UIs.
 *
 * If the provided device_data is an EditableDeviceMeter (with an 'id' property), its id is assigned to the node's device_id (can also be undefined).
 * If device_data is a NewDeviceMeter (no 'id'), device_id will be set to undefined.
 *
 * @param variable The default variable information to use for the node
 * @param phase The phase (L1, L2, L3, etc.) to use for the node's name and configuration
 * @param device_data The device meter configuration (EditableDeviceMeter or NewDeviceMeter)
 * @returns A fully initialized EditableDeviceNode object with default configuration
 */
function createDefaultEditableDeviceNode(variable: DefaultNodeInfo, phase: NodePhase, device_data: EditableDeviceMeter | NewDeviceMeter): EditableDeviceNode {

    const full_name = getNodePrefix(phase) + variable.name;

    let nodeConfiguration: EditableNodeConfiguration;

    let decimal_places: string = "";
    let min_alarm_value: string = "";
    let max_alarm_value: string = "";

    if (variable.type === NodeType.FLOAT || variable.type === NodeType.INT) {

        decimal_places = variable.defaultNumberOfDecimals ? variable.defaultNumberOfDecimals.toString() : "0";

        if (!(variable.isIncrementalNode)) {
            min_alarm_value = variable.defaultMinAlarm ? variable.defaultMinAlarm.toFixed(parseInt(decimal_places)) : Number(0).toFixed(parseInt(decimal_places));
            max_alarm_value = variable.defaultMaxAlarm ? variable.defaultMaxAlarm.toFixed(parseInt(decimal_places)) : Number(0).toFixed(parseInt(decimal_places));
        }
    }

    const nodeBaseConfiguration: EditableBaseNodeConfig = {
        calculate_increment: variable.isIncrementalNode && !(device_data.options.read_energy_from_meter),
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
        positive_incremental: variable.isIncrementalNode && !(device_data.options.read_energy_from_meter),
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
    }

    return node;
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
 * Validates a node's protocol based on whether it's a virtual/calculated node.
 * For non-virtual nodes, checks if the protocol exists in available protocol translations.
 * For virtual nodes, ensures the protocol is set to NONE.
 *
 * @param protocol The protocol to validate
 * @param virtual True if the node is virtual/calculated, false otherwise
 * @returns True if the protocol is valid for the node type
 */
export function validateNodeProtocol(protocol: Protocol, virtual: boolean): boolean {
    if (!virtual) {
        return Object.keys(get(protocolTexts)).includes(protocol);
    }
    else {
        return protocol === Protocol.NONE;
    }
}

/**
 * Validates the type of a node variable based on whether it is custom or default.
 * For custom variables, checks if the type is a valid NodeType enum value.
 * For default variables, checks if the type is allowed for the variable name based on applicableTypes.
 *
 * @param type NodeType to validate
 * @param name Name of the node variable (used for default variable validation)
 * @param custom True for custom variable, false for default variable
 * @returns True if the type is valid for the given variable
 */
export function validateNodeType(type: NodeType, name: string, custom: boolean): boolean {
    if (custom) {
        return Object.values(NodeType).includes(type as NodeType);
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
 * Validates the decimal places value based on node type.
 * For FLOAT/INT types, validates range 0-6. For STRING/BOOLEAN types, requires empty value.
 * @param decimal_places String representation of decimal places to validate
 * @param type NodeType to determine validation rules
 * @returns True if decimal places are valid for the given node type
 */
export function validateDecimalPlaces(decimal_places: string, type: NodeType): boolean {

    if (type === NodeType.FLOAT || type === NodeType.INT) {
        if (stringIsValidInteger(decimal_places) && parseInt(decimal_places) >= DECIMAL_PLACES_LIM.MIN && parseInt(decimal_places) <= DECIMAL_PLACES_LIM.MAX) {
            return true;
        }
    }
    else {
        return decimal_places === "";
    }
    return false;
}

/**
 * Validates the logging period value for a node.
 * @param logging_period String representation of logging period in minutes to validate
 * @param logging_enabled Whether logging is enabled (if false, always returns true)
 * @returns True if logging period is valid (1-1440 minutes when logging enabled)
 */
export function validateLoggingPeriod(logging_period: string, logging_enabled: boolean): boolean {
    if (!logging_enabled) {
        return true;
    }

    return (stringIsValidInteger(logging_period) && parseInt(logging_period) >= LOGGING_PERIOD_LIM.MIN && parseInt(logging_period) <= LOGGING_PERIOD_LIM.MAX);
}

/**
 * Validates an alarm value based on node type and whether the alarm is enabled.
 * @param alarm_value String representation of the alarm value to validate
 * @param alarm_enabled Whether the alarm is enabled (if false, always returns true)
 * @param type NodeType to determine validation method (FLOAT or INT)
 * @returns True if alarm value is valid for the given type when alarm is enabled
 */
export function validateAlarm(alarm_value: string, alarm_enabled: boolean, type: NodeType): boolean {
    if (!alarm_enabled) {
        return true;
    }

    if (type === NodeType.FLOAT) {
        return stringIsValidFloat(alarm_value);
    }
    else if (type === NodeType.INT) {
        return stringIsValidInteger(alarm_value);
    }

    return false;
}

/**
 * Validates whether a node can be set as virtual/calculated based on its properties.
 * Custom nodes cannot be virtual. For default nodes, checks if the node exists in defaultVariables
 * and has canBeVirtual = true. Non-virtual nodes are always valid regardless of type.
 * Does not check dependencies; for full validation use virtualNodeRules.ts.
 *
 * @param virtual Whether the node is set as virtual/calculated
 * @param name Display name of the node variable (without prefix)
 * @param custom True for custom variable, false for default variable
 * @returns True if the virtual setting is valid for this node type
 */
export function validateVirtualNode(virtual: boolean, name: string, custom: boolean): boolean {
    if (custom && virtual) { // Custom nodes can't be virtual
        return false;
    }
    if (!virtual) { // all nodes can be fetched from communication
        return true;
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
 * Validates whether a node can be set as incremental based on its properties.
 * Custom nodes cannot be incremental. For default nodes, checks if the node exists in defaultVariables
 * and has isIncrementalNode = true. Non-incremental nodes are always valid regardless of type.
 *
 * @param incremental Whether the node is set as incremental
 * @param name Display name of the node variable (without prefix)
 * @param custom True for custom variable, false for default variable
 * @returns True if the incremental setting is valid for this node type
 */
export function validateIncrementalNode(incremental: boolean, name: string, custom: boolean): boolean {
    if (custom) { // all custom nodes can or can not be incremental
        return true;
    }

    if (!custom) {
        const variables = get(defaultVariables);
        const variable = Object.values(variables).find(v => v.name === name);
        if (variable) {
            return incremental === variable.isIncrementalNode;
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
            node.config.decimal_places = "";
            node.config.min_alarm_value = "";
            node.config.max_alarm_value = "";
            node.config.min_alarm = false;
            node.config.max_alarm = false;
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
 * Updates the validation state for all nodes in the provided array.
 * Runs comprehensive validation checks on each node's properties and updates their validation objects.
 * This function should be called whenever node configurations change to ensure validation state is current.
 *
 * @param nodes Array of editable device nodes to validate
 * @param nodesBySection Record grouping nodes by their phase sections, used for duplicate name validation within each section
 * 
 * @description Validates the following properties for each node:
 * - variableName: Checks name validity, uniqueness within section, and custom/default rules
 * - variableType: Validates unit based on node type and custom/default status (duplicated as variableUnit)
 * - variableUnit: Same validation as variableType (validates unit appropriateness)
 * - communicationID: Validates format and value based on protocol (MODBUS_RTU, OPC_UA, NONE)
 * - protocol: Ensures protocol is valid for virtual/non-virtual nodes
 * - type: Validates NodeType based on custom/default variable rules
 * - decimalPlaces: Validates decimal places range (0-6) for numeric types, empty for others
 * - loggingPeriod: Validates logging period range (1-1440 minutes) when logging is enabled
 * - minAlarm/maxAlarm: Validates alarm values based on node type when alarms are enabled
 * - calculated: Validates virtual node settings based on variable capabilities
 * - incremental: Validates incremental node settings based on default variable properties
 * - calculate_increment/positive_incremental: Set to true (hardcoded, may need dynamic validation)
 * 
 * Call this function after any changes to node configurations and before checking overall validation with getAllNodesValidation().
 */
export function updateNodesValidation(nodes: Array<EditableDeviceNode>, nodesBySection: Record<NodePhase, Array<EditableDeviceNode>>): void {
    for (let node of nodes) {
        node.validation.variableName = validateNodeName(node.display_name, node.config.custom, nodesBySection[node.phase]);
        node.validation.variableType = validateNodeUnit(node.display_name, node.config.type, node.config.unit, node.config.custom);
        node.validation.variableUnit = validateNodeUnit(node.display_name, node.config.type, node.config.unit, node.config.custom);
        node.validation.communicationID = validateCommunicationID(node.communication_id, node.protocol);
        node.validation.protocol = validateNodeProtocol(node.protocol, node.config.calculated);
        node.validation.type = validateNodeType(node.config.type, node.display_name, node.config.custom);
        node.validation.decimalPlaces = validateDecimalPlaces(node.config.decimal_places, node.config.type);
        node.validation.loggingPeriod = validateLoggingPeriod(node.config.logging_period, node.config.logging);
        node.validation.minAlarm = validateAlarm(node.config.min_alarm_value, node.config.min_alarm, node.config.type);
        node.validation.maxAlarm = validateAlarm(node.config.max_alarm_value, node.config.max_alarm, node.config.type);
        node.validation.calculated = validateVirtualNode(node.config.calculated, node.display_name, node.config.custom);
        node.validation.incremental = validateIncrementalNode(node.config.incremental_node, node.display_name, node.config.custom);
        node.validation.calculate_increment = true;
        node.validation.positive_incremental = true;
    }
}

/**
 * Checks if all nodes in the provided array pass validation.
 * Iterates through each node and calls its validation.isValid() method to determine
 * if all validation checks pass. Returns false as soon as any node fails validation.
 *
 * @param nodes Array of editable device nodes to validate
 * @returns True if all nodes pass validation, false if any node fails
 */
export function getAllNodesValidation(nodes: Array<EditableDeviceNode>): boolean {
    for (let node of nodes) {
        if (!(node.validation.isValid())) {
            return false;
        }
    }
    return true;
}

/**
 * Determines the node phase from its name prefix based on meter type.
 * For single-phase meters, always returns SINGLEPHASE.
 * For three-phase meters, analyzes the prefix to determine L1, L2, L3, TOTAL, or GENERAL phase.
 *
 * @param name Node variable name to check
 * @param meter_type Type of meter (SINGLE_PHASE or THREE_PHASE) to determine phase logic
 * @returns Detected phase based on name prefix and meter type
 * @throws {Error} Throws an error if meter_type is invalid
 */
export function getNodePhase(name: string, meter_type: MeterType): NodePhase {

    if (meter_type === MeterType.SINGLE_PHASE) {
        return NodePhase.SINGLEPHASE;
    }
    else if (meter_type === MeterType.THREE_PHASE) {
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
    else {
        throw new Error(`Invalid meter type ${meter_type}`);
    }
}

/**
 * Maps NodePhase enum to the corresponding prefix used in node names.
 * Returns the appropriate prefix string for the given phase.
 *
 * @param phase NodePhase value to convert to prefix
 * @returns Corresponding prefix string, or empty string for invalid phase
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
 * Returns the initial (default) communication ID string for the specified protocol.
 *
 * For OPC UA, returns "ns=;i=". For Modbus RTU, returns "0x".
 * Throws an error for unsupported protocols.
 *
 * @param protocol The protocol type (OPC_UA or MODBUS_RTU)
 * @returns The initial communication ID string for the protocol
 */
export function getInitialCommunicationID(protocol: Protocol): string {
    if (protocol === Protocol.OPC_UA) {
        return "ns=;i=";
    } else if (protocol === Protocol.MODBUS_RTU) {
        return "0x";
    } else {
        throw new Error("Unsupported protocol");
    }
}

/**
 * Updates the protocol and communication ID of an editable device node.
 *
 * Sets the node's protocol to the specified value and updates the relevant communication field
 * (`register` for Modbus RTU, `node_id` for OPC UA) to the initial default value for that protocol.
 * Also updates the node's `communication_id` property accordingly.
 * Throws an error for unsupported protocols.
 *
 * @param protocol The new protocol to set (OPC_UA or MODBUS_RTU)
 * @param node The editable device node to update
 */
export function changeNodeProtocol(protocol: Protocol, node: EditableDeviceNode): void {

    if (protocol === Protocol.MODBUS_RTU) {
        (node.config as EditableNodeModbusRTUConfig).register = getInitialCommunicationID(Protocol.MODBUS_RTU);
    } else if (protocol === Protocol.OPC_UA) {
        (node.config as EditableNodeOPCUAConfig).node_id = getInitialCommunicationID(Protocol.OPC_UA);
    }
    else {
        throw new Error("Unsupported protocol");
    }

    node.protocol = protocol
    node.communication_id = getCommunicationID(protocol, node.config, true);
}

/**
 * Returns the communication ID string for a device node based on its protocol and configuration.
 *
 * For OPC UA nodes, returns the `node_id` string from the configuration.
 * For Modbus RTU nodes, returns the `register` as a hexadecimal string (e.g., "0x000A").
 * If `no_format` is true for Modbus RTU, returns the register as a plain number string instead of hex.
 * For unsupported protocols or missing configuration, returns an empty string.
 *
 * @param protocol The protocol of the node (e.g., OPC_UA, MODBUS_RTU)
 * @param config The node configuration object (NodeConfiguration or EditableNodeConfiguration)
 * @param no_format (Optional) If true and protocol is MODBUS_RTU, returns register as a plain number string instead of hex (default: false)
 * @returns The communication ID string for the node, or an empty string if not applicable
 */
export function getCommunicationID(protocol: Protocol, config: NodeConfiguration | EditableNodeConfiguration, no_format: boolean = false): string {
    if (!config) return '';

    if (protocol === Protocol.OPC_UA && "node_id" in config) {
        const nodeId = config.node_id;
        return nodeId;
    } else if (protocol === Protocol.MODBUS_RTU && "register" in config) {
        const reg = config.register;
        return no_format ? String(reg) : "0x" + Number(reg).toString(16).toUpperCase().padStart(4, "0");
    }

    return '';
}

/**
 * Creates and returns a new node object for the specified section and device data.
 *
 * Accepts either an EditableDeviceMeter (for editing an existing device) or a NewDeviceMeter (for creating a new device).
 * Initializes the node with default configuration based on the selected protocol.
 * The returned node can be appended to your nodes array for further configuration or display.
 *
 * If the provided device_data has an 'id' property (EditableDeviceMeter), it is assigned to the node's device_id.
 * If device_data is a NewDeviceMeter (no 'id'), device_id will be set to undefined.
 *
 * @param sectionPrefix Prefix to use for the node name
 * @param device_data Device data containing protocol and (optionally) device ID (EditableDeviceMeter or NewDeviceMeter)
 * @returns Newly created node ready to be appended to the nodes array
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

/**
 * Normalizes a DeviceNode by sorting its config properties alphabetically.
 * Used for consistent comparison between nodes.
 * 
 * @param node The DeviceNode to normalize
 * @returns Normalized node with sorted config properties
 */
export function normalizeNode(node: DeviceNode): DeviceNode {
    return {
        device_id: node.device_id,
        name: node.name,
        protocol: node.protocol,
        config: Object.fromEntries(
            Object.entries(node.config).sort(([a], [b]) => a.localeCompare(b))
        ) as NodeConfiguration
    };
}

/**
 * Compares two arrays of DeviceNode objects for equality.
 * Normalizes and sorts both arrays by name before comparison to ensure consistent results.
 * 
 * @param a First array of DeviceNode objects
 * @param b Second array of DeviceNode objects
 * @returns True if arrays contain equivalent nodes, false otherwise
 */
export function areNodesEqual(a: DeviceNode[], b: DeviceNode[]): boolean {
    const sortByName = (arr: DeviceNode[]) =>
        [...arr].sort((x, y) => x.name.localeCompare(y.name));

    return isEqual(
        sortByName(a).map(normalizeNode),
        sortByName(b).map(normalizeNode)
    );
}