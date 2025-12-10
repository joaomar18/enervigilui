import type { BaseNodeProtocolOptions, EditableBaseNodeProtocolOptions } from "../config";

/*****     C O N S T A N T S     *****/

/*****     E N U M S     *****/

/**
 * Defines the supported Modbus RTU data types that can be read from registers or coils.
 *
 * @enum
 */
export enum ModbusRTUNodeType {
    BOOL = "BOOL",
    INT_16 = "INT_16",
    UINT_16 = "UINT_16",
    INT_32 = "INT_32",
    UINT_32 = "UINT_32",
    FLOAT_32 = "FLOAT_32",
    INT_64 = "INT_64",
    UINT_64 = "UINT_64",
    FLOAT_64 = "FLOAT_64",
}

/**
 * Represents how multi-byte Modbus RTU values should be interpreted in memory.
 * Determines byte and word order for conversions.
 *
 * @enum
 */
export enum ModbusRTUNodeMode {
    BIG_ENDIAN = "BIG_ENDIAN",
    WORD_SWAP = "WORD_SWAP",
    BYTE_SWAP = "BYTE_SWAP",
    WORD_BYTE_SWAP = "WORD_BYTE_SWAP",
}

/**
 * Lists the Modbus RTU functions supported for reading device values.
 *
 * @enum
 */
export enum ModbusRTUFunction {
    READ_COILS = "READ_COILS",
    READ_DISCRETE_INPUTS = "READ_DISCRETE_INPUTS",
    READ_HOLDING_REGISTERS = "READ_HOLDING_REGISTERS",
    READ_INPUT_REGISTERS = "READ_INPUT_REGISTERS",
}

/*****     I N T E R F A C E S     *****/

/**
 * Represents the configuration required to read a Modbus RTU node.
 * Defines the Modbus function, register address, data type, and endian handling.
 *
 * @interface
 * @extends BaseNodeProtocolOptions
 * @property {ModbusRTUFunction} function - The Modbus function used for reading (e.g., holding registers).
 * @property {number} address - The numeric register or coil address.
 * @property {ModbusRTUNodeType} type - The underlying Modbus data type to decode.
 * @property {ModbusRTUNodeMode | null} endian_mode - Endianness and word/byte swap mode for multi-byte values.
 * @property {number | null} bit - Optional bit index for BOOL extraction (only used with register bit-level reads).
 */
export interface ModbusRTUNodeOptions extends BaseNodeProtocolOptions {
    function: ModbusRTUFunction;
    address: number;
    type: ModbusRTUNodeType;
    endian_mode: ModbusRTUNodeMode | null;
    bit: number | null;
}

/**
 * Editable version of Modbus RTU node configuration, intended for UI forms.
 * Uses string-based fields where user input may not yet be validated or numeric.
 *
 * @interface
 * @extends BaseNodeProtocolOptions
 * @property {ModbusRTUFunction} function - The Modbus function selected in the UI.
 * @property {string} address - Raw user-provided register/coil address.
 * @property {ModbusRTUNodeType} type - Selected Modbus data type.
 * @property {ModbusRTUNodeMode | null} endian_mode - Chosen endianness mode for decoding.
 * @property {string | null} bit - Raw user-provided bit index.
 */
export interface EditableModbusRTUNodeOptions extends EditableBaseNodeProtocolOptions {
    function: ModbusRTUFunction;
    address: string;
    type: ModbusRTUNodeType;
    endian_mode: ModbusRTUNodeMode | null;
    bit: string | null;
}

/**
 * Temporary editing state for Modbus RTU node options in the UI.
 * Stores previously selected values to support validation logic
 * and controlled transitions when changing configuration fields.
 *
 * @interface
 * @property {ModbusRTUNodeType} previousType - Previously selected Modbus node data type.
 * @property {ModbusRTUFunction} previousFunction - Previously selected Modbus RTU function.
 */
export interface ModbusRTUNodeOptionsEditingState {
    previousType: ModbusRTUNodeType;
    previousFunction: ModbusRTUFunction;
}

/*****     T Y P E S     *****/

/*****     O B J E C T S     *****/

/**
 * Default editable Modbus RTU configuration for newly created nodes.
 * Provides safe, commonly used starting values for energy meters,
 * including FLOAT_32 decoding with WORD_SWAP endianness.
 *
 * @constant
 */
export const defaultModbusRTUNodeOptions: EditableModbusRTUNodeOptions = {
    function: ModbusRTUFunction.READ_HOLDING_REGISTERS,
    address: "",
    type: ModbusRTUNodeType.FLOAT_32,
    endian_mode: ModbusRTUNodeMode.WORD_SWAP,
    bit: null,
};

/**
 * List of Modbus RTU data types that span multiple 16-bit registers.
 * Used to determine when endian mode handling is required during parsing
 * and when validation must enforce the presence of a register order mode.
 *
 * @constant
 */
export const multiregisterTypes: Array<ModbusRTUNodeType> = [
    ModbusRTUNodeType.FLOAT_32,
    ModbusRTUNodeType.FLOAT_64,
    ModbusRTUNodeType.INT_32,
    ModbusRTUNodeType.UINT_32,
    ModbusRTUNodeType.INT_64,
    ModbusRTUNodeType.UINT_64,
];
