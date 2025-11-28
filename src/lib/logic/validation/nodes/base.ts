import { get } from "svelte/store";
import { Protocol } from "$lib/types/device/base";
import { NodeType, NodePhase, CounterMode } from "$lib/types/nodes/base";
import { defaultVariables, defaultVariableNames, defaultVariableUnits } from "$lib/stores/device/variables";
import { normalizeNode, sortNodesByName } from "$lib/logic/util/nodes";
import { protocolTexts } from "$lib/stores/lang/energyMeterTexts";
import { stringIsValidInteger, stringIsValidFloat } from "$lib/logic/util/generic";
import { DECIMAL_PLACES_LIM, LOGGING_PERIOD_LIM } from "$lib/types/nodes/config";
import { protocolPlugins } from "$lib/stores/device/protocol";
import type { NodeRecord, EditableNodeRecord, NodeValidation } from "$lib/types/nodes/config";
import { isEqual } from "$lib/logic/util/generic";

/**
 * Creates and returns a new NodeValidation object with all validation properties set to false.
 * Used to initialize the validation state for new nodes or reset validation during editing.
 *
 * @returns {NodeValidation} A fresh validation object with all checks set to false
 */
export function getInitialNodeValidation(): NodeValidation {
    return {
        variableName: false,
        variableType: false,
        variableUnit: false,
        communicationID: false,
        protocol: false,
        type: false,
        decimalPlaces: false,
        loggingPeriod: false,
        minAlarm: false,
        maxAlarm: false,
        calculated: false,
        isCounter: false,
        counterMode: false,
        isValid() {
            return (
                this.variableName &&
                this.variableType &&
                this.variableUnit &&
                this.decimalPlaces &&
                this.communicationID &&
                this.loggingPeriod &&
                this.minAlarm &&
                this.maxAlarm &&
                this.calculated &&
                this.isCounter &&
                this.counterMode
            );
        },
    };
}

/**
 * Validates node variable name based on custom/default status and uniqueness within the phase.
 * @param nodeName - The display name of the node to validate.
 * @param customVariable - True if this is a custom user-defined variable.
 * @param currentNodes - Array of current nodes in the same phase to check for duplicates.
 * @returns True if the node name is valid according to the rules.
 */
export function validateNodeName(nodeName: string, customVariable: boolean, currentNodes: Array<EditableNodeRecord>): boolean {
    const names: Array<string> = get(defaultVariableNames);

    // Check for duplicates in current nodes
    if (currentNodes) {
        const nodeCount = Object.values(currentNodes).filter((node: EditableNodeRecord) => node.display_name === nodeName).length;
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
 * Validates node unit based on variable type and custom/default status.
 * @param nodeName - Variable name to check against default units.
 * @param nodeType - The data type of the node (FLOAT, INT, STRING, BOOLEAN).
 * @param nodeUnit - The unit string to validate.
 * @param customVariable - True if this is a custom user-defined variable.
 * @returns True if the unit is valid for the given node type and variable.
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
 * Validates communication ID format using the appropriate protocol plugin.
 * @param communicationID - The communication ID string to validate.
 * @param protocol - The communication protocol type.
 * @returns True if the communication ID is valid for the specified protocol.
 */
export function validateCommunicationID(communicationID: string | undefined, protocol: Protocol): boolean {
    if (!communicationID) {
        return protocol === Protocol.NONE;
    }

    const trimmedId = communicationID.trim();
    let plugin = get(protocolPlugins)[protocol];

    return plugin.validateCommID(trimmedId);
}

/**
 * Validates node protocol based on virtual/physical status and available protocols.
 * @param protocol - The protocol to validate.
 * @param virtual - True if this is a calculated/virtual node.
 * @returns True if the protocol is valid for the node type.
 */
export function validateNodeProtocol(protocol: Protocol, virtual: boolean): boolean {
    if (!virtual) {
        return Object.keys(get(protocolTexts)).includes(protocol);
    } else {
        return protocol === Protocol.NONE;
    }
}

/**
 * Validates node data type against applicable types for default variables or any type for custom variables.
 * @param type - The NodeType to validate.
 * @param name - Variable name to check against default variable constraints.
 * @param custom - True if this is a custom user-defined variable.
 * @returns True if the type is valid for the variable.
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
 * Validates decimal places value based on node type and defined limits.
 * @param decimal_places - String representation of decimal places count.
 * @param type - The NodeType to determine if decimal places are applicable.
 * @returns True if decimal places value is valid for the node type.
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
 * Validates logging period value against defined limits when logging is enabled.
 * @param logging_period - String representation of logging period in minutes.
 * @param logging_enabled - True if logging is enabled for the node.
 * @returns True if logging period is valid or logging is disabled.
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
 * Validates alarm threshold value based on node type and alarm enabled status.
 * @param alarm_value - String representation of the alarm threshold value.
 * @param alarm_enabled - True if the alarm is enabled.
 * @param type - The NodeType to determine numeric validation requirements.
 * @returns True if alarm value is valid or alarm is disabled.
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
 * Validates if a node can be configured as virtual/calculated based on variable constraints.
 * @param virtual - True if the node is configured as virtual/calculated.
 * @param name - Variable name to check against default variable capabilities.
 * @param custom - True if this is a custom user-defined variable.
 * @returns True if the virtual configuration is valid for the variable.
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
 * Validates if a node can be configured as counter based on variable type constraints.
 * @param counter - True if the node is configured as counter.
 * @param name - Variable name to check against default variable characteristics.
 * @param custom - True if this is a custom user-defined variable.
 * @returns True if the counter configuration is valid for the variable.
 */
export function validateCounterNode(counter: boolean, name: string, custom: boolean): boolean {
    if (custom) {
        return true;
    }

    if (!custom) {
        const variables = get(defaultVariables);
        const variable = Object.values(variables).find((v) => v.name === name);
        if (variable) {
            return counter === variable.isCounter;
        }
    }
    return false;
}

/**
 * Validates whether a counter mode is correctly set based on the node's counter status.
 *
 * @param counter - True if the node is configured as a counter.
 * @param mode - The selected counter mode (DIRECT, DELTA, CUMULATIVE) or null for non-counter nodes.
 * @returns True if the mode selection is valid for the current counter configuration.
 */
export function validateCounterMode(counter: boolean, mode: CounterMode | null): boolean {
    if (counter) {
        if (mode !== null) {
            return true;
        }
        return false;
    } else {
        if (mode === null) {
            return true;
        }
        return false;
    }
}

/**
 * Updates validation state for all nodes by running all validation checks and updating their validation objects.
 * @param nodes - Array of editable nodes to validate.
 * @param nodesBySection - Nodes organized by phase for duplicate checking within each phase.
 */
export function updateNodesValidation(nodes: Array<EditableNodeRecord>, nodesBySection: Record<NodePhase, Array<EditableNodeRecord>>): void {
    for (let node of nodes) {
        node.validation.variableName = validateNodeName(node.display_name, node.config.custom, nodesBySection[node.attributes.phase]);
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
        node.validation.isCounter = validateCounterNode(node.config.is_counter, node.display_name, node.config.custom);
        node.validation.counterMode = validateCounterMode(node.config.is_counter, node.config.counter_mode);
    }
}

/**
 * Checks if all nodes in the array pass their validation checks.
 * @param nodes - Array of editable nodes to check for validation compliance.
 * @returns True if all nodes pass validation, false if any node fails validation.
 */
export function getAllNodesValidation(nodes: Array<EditableNodeRecord>): boolean {
    for (let node of nodes) {
        if (!node.validation.isValid()) {
            return false;
        }
    }
    return true;
}

/**
 * Compares two node arrays for equality by normalizing and sorting them for consistent comparison.
 * @param initialNodes - Initial configuration array from the backend.
 * @param newNodes - New configuration array to compare against.
 * @returns True if the arrays are equivalent after normalization and sorting.
 */
export function areNodesEqual(initialNodes: NodeRecord[], newNodes: NodeRecord[]): boolean {
    return isEqual(initialNodes, (sortNodesByName(newNodes) as NodeRecord[]).map(normalizeNode));
}
