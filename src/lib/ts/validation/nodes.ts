import { get } from "svelte/store";
import { Protocol } from "$lib/stores/devices";
import { NodeType, NodePhase } from "$lib/stores/nodes";
import { defaultVariables, defaultVariableNames, defaultVariableUnits } from "$lib/stores/nodes";
import { DECIMAL_PLACES_LIM, LOGGING_PERIOD_LIM } from "$lib/stores/nodes";
import { normalizeNode } from "$lib/ts/util/nodes";
import { protocolTexts } from "$lib/stores/lang/energyMeterTexts";
import type { DeviceNode, EditableDeviceNode } from "$lib/stores/nodes";
import { stringIsValidInteger, stringIsValidFloat } from "$lib/ts/util/generic";
import isEqualPkg from "lodash";
const { isEqual } = isEqualPkg;

/**
 * Validates node name.
 * @param nodeName Display name (no prefix).
 * @param customVariable True for custom variable.
 * @param currentNodes Optional nodes for duplicate check.
 * @returns True if valid.
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
 * Validates node unit.
 * @param nodeName Variable name.
 * @param nodeType Variable type.
 * @param nodeUnit Unit string.
 * @param customVariable True for custom variable.
 * @returns True if valid.
 */
export function validateNodeUnit(nodeName: string, nodeType: NodeType, nodeUnit: string, customVariable: boolean): boolean {
    if (customVariable) {
        if (nodeType === NodeType.STRING || nodeType === NodeType.BOOLEAN) {
            return !(nodeUnit && nodeUnit.trim().length > 0);
        } else {
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
 * Validates communication ID for protocol.
 * @param communicationID Communication ID.
 * @param protocol Protocol type.
 * @returns True if valid.
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
            return value >= 0 && value <= 0xffff;

        case Protocol.OPC_UA:
            const opcuaPattern =
                /^ns=\d+;(i=\d+|s=[^;]+|g=[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{4}-[0-9a-fA-F-]{12}|b=[A-Za-z0-9+/=]+)$/;
            return opcuaPattern.test(trimmedId);

        default:
            return false;
    }
}

/**
 * Validates node protocol.
 * @param protocol Protocol.
 * @param virtual True if virtual node.
 * @returns True if valid.
 */
export function validateNodeProtocol(protocol: Protocol, virtual: boolean): boolean {
    if (!virtual) {
        return Object.keys(get(protocolTexts)).includes(protocol);
    } else {
        return protocol === Protocol.NONE;
    }
}

/**
 * Validates node type.
 * @param type NodeType.
 * @param name Variable name.
 * @param custom True for custom variable.
 * @returns True if valid.
 */
export function validateNodeType(type: NodeType, name: string, custom: boolean): boolean {
    if (custom) {
        return Object.values(NodeType).includes(type as NodeType);
    } else {
        // For default variables, check if the type is in the applicable types
        const variables = get(defaultVariables);
        const variable = Object.values(variables).find((v) => v.name === name);

        if (variable && variable.applicableTypes) {
            return variable.applicableTypes.includes(type);
        }

        return false;
    }
}

/**
 * Validates decimal places.
 * @param decimal_places String value.
 * @param type NodeType.
 * @returns True if valid.
 */
export function validateDecimalPlaces(decimal_places: string, type: NodeType): boolean {
    if (type === NodeType.FLOAT || type === NodeType.INT) {
        if (
            stringIsValidInteger(decimal_places) &&
            parseInt(decimal_places) >= DECIMAL_PLACES_LIM.MIN &&
            parseInt(decimal_places) <= DECIMAL_PLACES_LIM.MAX
        ) {
            return true;
        }
    } else {
        return decimal_places === "";
    }
    return false;
}

/**
 * Validates logging period.
 * @param logging_period String value.
 * @param logging_enabled True if logging enabled.
 * @returns True if valid.
 */
export function validateLoggingPeriod(logging_period: string, logging_enabled: boolean): boolean {
    if (!logging_enabled) {
        return true;
    }

    return (
        stringIsValidInteger(logging_period) && parseInt(logging_period) >= LOGGING_PERIOD_LIM.MIN && parseInt(logging_period) <= LOGGING_PERIOD_LIM.MAX
    );
}

/**
 * Validates alarm value.
 * @param alarm_value String value.
 * @param alarm_enabled True if alarm enabled.
 * @param type NodeType.
 * @returns True if valid.
 */
export function validateAlarm(alarm_value: string, alarm_enabled: boolean, type: NodeType): boolean {
    if (!alarm_enabled) {
        return true;
    }

    if (type === NodeType.FLOAT) {
        return stringIsValidFloat(alarm_value);
    } else if (type === NodeType.INT) {
        return stringIsValidInteger(alarm_value);
    }

    return false;
}

/**
 * Validates if node can be virtual.
 * @param virtual True if virtual.
 * @param name Variable name.
 * @param custom True for custom variable.
 * @returns True if valid.
 */
export function validateVirtualNode(virtual: boolean, name: string, custom: boolean): boolean {
    if (custom && virtual) {
        // Custom nodes can't be virtual
        return false;
    }
    if (!virtual) {
        // all nodes can be fetched from communication
        return true;
    }
    const variables = get(defaultVariables);
    const variable = Object.values(variables).find((v) => v.name === name);
    if (variable) {
        if (variable.canBeVirtual) {
            return true;
        }
    }
    return false;
}

/**
 * Validates if node can be incremental.
 * @param incremental True if incremental.
 * @param name Variable name.
 * @param custom True for custom variable.
 * @returns True if valid.
 */
export function validateIncrementalNode(incremental: boolean, name: string, custom: boolean): boolean {
    if (custom) {
        // all custom nodes can or can not be incremental
        return true;
    }

    if (!custom) {
        const variables = get(defaultVariables);
        const variable = Object.values(variables).find((v) => v.name === name);
        if (variable) {
            return incremental === variable.isIncrementalNode;
        }
    }
    return false;
}

/**
 * Updates validation state for all nodes.
 * @param nodes Array of editable nodes.
 * @param nodesBySection Nodes grouped by phase.
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
 * Checks if all nodes pass validation.
 * @param nodes Array of editable nodes.
 * @returns True if all valid.
 */
export function getAllNodesValidation(nodes: Array<EditableDeviceNode>): boolean {
    for (let node of nodes) {
        if (!node.validation.isValid()) {
            return false;
        }
    }
    return true;
}

/**
 * Compares two arrays of DeviceNode for equality.
 * @param a First array.
 * @param b Second array.
 * @returns True if equal.
 */
export function areNodesEqual(a: DeviceNode[], b: DeviceNode[]): boolean {
    const sortByName = (arr: DeviceNode[]) => [...arr].sort((x, y) => x.name.localeCompare(y.name));
    //console.log("Debug, Nodes are equal: ", isEqual(sortByName(a).map(normalizeNode), sortByName(b).map(normalizeNode)));
    //console.log("Nodes A: ", (sortByName(a).map(normalizeNode)));
    //console.log("Nodes B: ", (sortByName(b).map(normalizeNode)));
    return isEqual(sortByName(a).map(normalizeNode), sortByName(b).map(normalizeNode));
}
