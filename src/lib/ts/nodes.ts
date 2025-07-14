import { get } from "svelte/store";
import { Protocol, NodeType } from "$lib/stores/nodes";
import { defaultVariables } from "$lib/stores/nodes";
import { defaultVariableNames } from "$lib/stores/nodes";
import { defaultVariableUnits } from "$lib/stores/nodes";
import type { FormattedNode } from "$lib/stores/nodes";

/**
 * Validates a node name based on whether it is a custom variable or a default variable.
 * 
 * For custom variables, the function performs the following validations:
 * - Ensures the name is not already used in the defaultVariableNames store
 * - Verifies the name is non-empty and contains no whitespace
 * - Confirms the name contains only alphabetical characters or underscores
 * 
 * For default variables:
 * - Verifies the name exists in the defaultVariableNames store
 * 
 * For both types:
 * - If currentNodes is provided, checks that the displayName doesn't appear more than once
 * 
 * @param nodeName - The display name of the node to validate (without prefix)
 * @param customVariable - If true, validates as custom variable, if false, validates as default variable
 * @param currentNodes - Optional array of formatted nodes to check for duplicate display names
 * @returns {boolean} True if the node name is valid according to all applicable rules
 */
export function validateNodeName(nodeName: string, customVariable: boolean, currentNodes?: Array<FormattedNode>): boolean {
    const names: Array<string> = get(defaultVariableNames);

    // Check for duplicates in current nodes
    if (currentNodes) {
        const nodeCount = Object.values(currentNodes).filter((node: FormattedNode) => node.displayName === nodeName).length;
        if (nodeCount >= 2) {
            return false;
        }
    }

    if (customVariable) {
        // For custom variables, check if name exists in default names
        if (names.includes(nodeName)) {
            return false;
        }

        // Check if name is empty or contains any whitespace
        if (!nodeName || nodeName.length === 0 || /\s/.test(nodeName)) {
            return false;
        }

        // Check if name contains only alphabetical characters or underscore
        const namePattern = /^[a-zA-Z_]+$/;
        return namePattern.test(nodeName);
    } else {
        // For default variables, just check if it exists in the default names
        return names.includes(nodeName);
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
 * Protocol-specific validation rules:
 * - Protocol.NONE: 
 *   - The communication ID must be empty or undefined
 * 
 * - Protocol.MODBUS_RTU:
 *   - Must be a hexadecimal string starting with "0x"
 *   - Must be between 0x0000 and 0xFFFF (0-65535)
 *   - Example: "0x00A1" or "0x1234"
 * 
 * - Protocol.OPC_UA:
 *   - Must match one of these OPC UA node ID formats:
 *     - ns=<number>;i=<number> (numeric identifier)
 *     - ns=<number>;s=<string> (string identifier)
 *     - ns=<number>;g=<guid> (GUID identifier)
 *     - ns=<number>;b=<base64> (opaque identifier)
 *   - The namespace (ns) must be a valid number
 *   - Example: "ns=1;i=1234" or "ns=2;s=Temperature"
 *
 * @param communicationID - The communication ID string to validate, can be undefined
 * @param protocol - The protocol type (Protocol.NONE, Protocol.MODBUS_RTU, or Protocol.OPC_UA)
 * @returns {boolean} True if the communication ID is valid for the given protocol
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