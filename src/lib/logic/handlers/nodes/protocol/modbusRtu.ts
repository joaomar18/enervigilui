import { multiregisterTypes, ModbusRTUNodeMode } from "$lib/types/nodes/protocol/modbusRtu";
import {
    type EditableModbusRTUNodeOptions,
    type ModbusRTUNodeOptionsEditingState,
    ModbusRTUFunction,
    ModbusRTUNodeType,
} from "$lib/types/nodes/protocol/modbusRtu";

/**
 * Handles UI-side effects when the Modbus RTU function selection changes.
 *
 * This function manages the validity of the `bit` field based on the
 * combination of node type and Modbus function:
 * - READ_COILS and READ_DISCRETE_INPUTS do not support bit indexing
 * - Other functions may require a bit index when the node type is BOOL
 *
 * The previous function is tracked to determine whether the bit field
 * should be reset or preserved during transitions.
 *
 * @param {EditableModbusRTUNodeOptions} commOptions - Editable Modbus RTU communication options.
 * @param {ModbusRTUNodeType} type - Currently selected node data type.
 * @param {ModbusRTUFunction} modbus_function - Newly selected Modbus RTU function.
 * @param {ModbusRTUNodeOptionsEditingState} editingState - Editing state tracking previous selections.
 */
export function modbusRTUFunctionChange(
    commOptions: EditableModbusRTUNodeOptions,
    type: ModbusRTUNodeType,
    modbus_function: ModbusRTUFunction,
    editingState: ModbusRTUNodeOptionsEditingState
): void {
    let previousBoolFunction =
        editingState.previousFunction === ModbusRTUFunction.READ_COILS || editingState.previousFunction === ModbusRTUFunction.READ_DISCRETE_INPUTS;
    let currentBoolFunction = modbus_function === ModbusRTUFunction.READ_COILS || modbus_function === ModbusRTUFunction.READ_DISCRETE_INPUTS;

    if (!currentBoolFunction && type === ModbusRTUNodeType.BOOL) {
        if (previousBoolFunction) {
            commOptions.bit = "";
        }
    } else {
        commOptions.bit = null;
    }

    editingState.previousFunction = modbus_function;
}

/**
 * Handles UI-side effects when the Modbus RTU node data type changes.
 *
 * This function:
 * - Manages endianness when switching between single-register and multi-register types
 * - Updates the `bit` field validity when entering or leaving BOOL types
 *
 * Previous type and function values are used to apply only the necessary
 * state transitions and avoid invalid configurations.
 *
 * @param {EditableModbusRTUNodeOptions} commOptions - Editable Modbus RTU communication options.
 * @param {ModbusRTUNodeType} type - Newly selected node data type.
 * @param {ModbusRTUNodeOptionsEditingState} editingState - Editing state tracking previous selections.
 */
export function modbusNodeTypeChange(
    commOptions: EditableModbusRTUNodeOptions,
    type: ModbusRTUNodeType,
    editingState: ModbusRTUNodeOptionsEditingState
): void {
    if (!multiregisterTypes.includes(editingState.previousType) && multiregisterTypes.includes(type)) {
        // Multi-register type change
        commOptions.endian_mode = ModbusRTUNodeMode.BIG_ENDIAN;
    } else if (multiregisterTypes.includes(editingState.previousType) && !multiregisterTypes.includes(type)) {
        // Change to non Multi-register type
        commOptions.endian_mode = null;
    }

    let currentBoolFunction =
        editingState.previousFunction === ModbusRTUFunction.READ_COILS || editingState.previousFunction === ModbusRTUFunction.READ_DISCRETE_INPUTS;

    if (!currentBoolFunction && type === ModbusRTUNodeType.BOOL) {
        if (editingState.previousType !== ModbusRTUNodeType.BOOL) {
            commOptions.bit = "";
        }
    } else {
        commOptions.bit = null;
    }

    editingState.previousType = type;
}
