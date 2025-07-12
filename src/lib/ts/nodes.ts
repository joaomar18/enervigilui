import { get } from "svelte/store";
import { Protocol, NodeType } from "$lib/stores/nodes";
import { defaultVariables } from "$lib/stores/nodes";
import { defaultVariableNames } from "$lib/stores/nodes";
import { defaultVariableUnits } from "$lib/stores/nodes";

/**
 * Validates a node name based on whether it is a custom variable or a default variable.
 *
 * - For custom variables, checks that the node name is a non-empty, non-whitespace string.
 * - For default variables, checks that the node name exists in the defaultVariableNames Svelte store.
 *
 * @param nodeName - The name of the node to validate.
 * @param customVariable - Whether the node is a custom variable (true) or a default variable (false).
 * @returns True if the node name is valid according to the rules above, otherwise false.
 */
export function validateNodeName(nodeName: string, customVariable: boolean): boolean {
    if (customVariable) {
        return Boolean(nodeName && nodeName.trim().length > 0);
    } else {
        const names: Array<string> = get(defaultVariableNames);
        if (names.includes(nodeName)) {
            return true;
        }
        return false;
    }
}

/**
 * Validates the unit of a node variable based on its type and whether it is custom or default.
 *
 * - For custom variables:
 *   - If the node type is STRING or BOOLEAN, the unit must be empty (returns true if empty, false otherwise).
 *   - For other types, the unit must be a non-empty, non-whitespace string.
 * - For default variables:
 *   - The unit must be included in the list of allowed units for the given node name (from the defaultVariableUnits Svelte store).
 *
 * @param nodeName - The name of the node variable to validate the unit for.
 * @param nodeType - The type of the node variable (e.g., NodeType.FLOAT, NodeType.STRING).
 * @param nodeUnit - The unit string to validate.
 * @param customVariable - Whether the node is a custom variable (true) or a default variable (false).
 * @returns True if the unit is valid according to the rules above, otherwise false.
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
 *
 * - For Protocol.NONE: The communication ID must be empty (returns true if empty, false otherwise).
 * - For Protocol.MODBUS_RTU: Always returns true (no validation logic implemented).
 * - For Protocol.OPC_UA: The communication ID must match the OPC UA node ID format:
 *   - ns=<number>;i=<number> (numeric identifier)
 *   - ns=<number>;s=<string> (string identifier)
 *   - ns=<number>;g=<guid> (GUID identifier)
 *   - ns=<number>;b=<base64> (opaque identifier)
 *
 * @param communicationID - The communication ID string to validate.
 * @param protocol - The protocol type (e.g., Protocol.NONE, Protocol.MODBUS_RTU, Protocol.OPC_UA).
 * @returns True if the communication ID is valid for the given protocol, otherwise false.
 */
export function validateCommunicationID(communicationID: string, protocol: Protocol): boolean {
    if (protocol === Protocol.NONE) {
        // For NONE, communicationID should be empty
        return !(communicationID && communicationID.trim().length > 0);
    } else if (protocol === Protocol.MODBUS_RTU) {
        return true;
    } else if (protocol === Protocol.OPC_UA) {
        const opcuaPattern = /^ns=\d+;(i=\d+|s=[^;]+|g=[0-9a-fA-F-]+|b=[A-Za-z0-9+/=]+)$/;
        return opcuaPattern.test(communicationID.trim());
    }
    return false;
}

/**
 * Validates the type of a node variable based on whether it is a custom variable or a default variable.
 *
 * - For custom variables: Always returns true (custom variables can have any type).
 * - For default variables: Checks that the specified type is included in the applicable types
 *   for the given variable name (from the defaultVariables Svelte store).
 *
 * @param type - The NodeType to validate (e.g., NodeType.FLOAT, NodeType.INT, NodeType.STRING, NodeType.BOOLEAN).
 * @param name - The name of the node variable to validate the type for.
 * @param custom - Whether the node is a custom variable (true) or a default variable (false).
 * @returns True if the type is valid according to the rules above, otherwise false.
 */
export function validateNodeType(type: NodeType, name: string, custom: boolean): boolean {
    if (custom) {
        return true;
    } else {
        // For default variables, check if the type is in the applicable types
        const variables = get(defaultVariables);
        const variable = Object.values(variables).find(v => v.variable === name);

        if (variable && variable.applicableTypes) {
            return variable.applicableTypes.includes(type);
        }

        return false;
    }
}