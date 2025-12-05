import { NodeType, NodePhase, CounterMode } from "./base";
import { Protocol } from "../device/base";

/*****     C O N S T A N T S     *****/

export const DECIMAL_PLACES_LIM: Record<string, number> = { MIN: 0, MAX: 6 };
export const LOGGING_PERIOD_LIM: Record<string, number> = { MIN: 1, MAX: 1440 };

/*****     E N U M S     *****/

/*****     I N T E R F A C E S     *****/

/**
 * Base configuration shared by all node types regardless of protocol.
 * Defines common settings and parameters used across all nodes in the system.
 *
 * @interface
 * @property {boolean} calculated - True if the node value is calculated rather than obtained via communication
 * @property {boolean} custom - True if this is a custom user-defined node
 * @property {number | null} decimal_places - Number of decimal places to display for numeric values (can be null for non-numeric types)
 * @property {boolean} enabled - Whether the node is currently enabled
 * @property {boolean | null} is_counter - True if the node value is of counter type (can be null for non-applicable nodes)
 * @property {CounterMode | null} counter_mode - Counter behavior mode for the node (null when not applicable)
 * @property {boolean} logging - Whether data logging is enabled for this node
 * @property {number} logging_period - Logging frequency in minutes
 * @property {boolean} max_alarm - Whether maximum threshold alarm is enabled
 * @property {number | null} max_alarm_value - Value that triggers maximum threshold alarm (can be null when alarm is disabled)
 * @property {boolean} min_alarm - Whether minimum threshold alarm is enabled
 * @property {number | null} min_alarm_value - Value that triggers minimum threshold alarm (can be null when alarm is disabled)
 * @property {boolean} publish - Whether the node's value should be published to external systems or services
 * @property {string | null} unit - Measurement unit (e.g., V, A, kW, null for non numeric types)
 */
export interface BaseNodeConfig {
    calculated: boolean;
    custom: boolean;
    decimal_places: number | null;
    enabled: boolean;
    is_counter: boolean | null;
    counter_mode: CounterMode | null;
    logging: boolean;
    logging_period: number;
    max_alarm: boolean;
    max_alarm_value: number | null;
    min_alarm: boolean;
    min_alarm_value: number | null;
    publish: boolean;
    unit: string | null;
}

/**
 * Editable version of the base node configuration for UI forms.
 * All numeric fields are represented as strings to support user input and validation.
 */
export interface EditableBaseNodeConfig {
    calculated: boolean;
    custom: boolean;
    decimal_places: string;
    enabled: boolean;
    is_counter: boolean;
    counter_mode: CounterMode | null;
    logging: boolean;
    logging_period: string;
    max_alarm: boolean;
    max_alarm_value: string;
    min_alarm: boolean;
    min_alarm_value: string;
    publish: boolean;
    unit: string;
}

/**
 * Base interface for all protocol-specific node configuration options.
 * Serves as a shared parent type that protocol option interfaces extend.
 *
 * @interface
 */
export interface BaseNodeProtocolOptions { }

/**
 * Base interface for editable protocol-specific node configuration options.
 * Used as a shared parent type for UI-side editable protocol option interfaces.
 *
 * @interface
 */
export interface EditableBaseNodeProtocolOptions { }

/**
 * Represents a minimal node definition used when no protocol-specific
 * configuration is needed. Specifies only the internal data type of the node.
 *
 * @interface
 * @property {NodeType} type - Internal variable type (e.g., INT, BOOL, FLOAT, STRING).
 */
export interface NodeNoProtocolOptions {
    type: NodeType;
}

/**
 * Editable version of a minimal node definition used when no protocol-specific
 * configuration is required. Contains only the editable internal data type field.
 *
 * @interface
 * @property {NodeType} type - Internal variable type selected by the user (e.g., INT, BOOL, FLOAT, STRING).
 */
export interface EditableNodeNoProtocolOptions {
    type: NodeType;
}

/**
 * Additional metadata for a device node, such as its associated electrical phase.
 * Used to extend node information with properties not included in the main node interface,
 * enabling more precise grouping, filtering, and processing of nodes.
 *
 * @property {NodePhase | null} phase - The electrical phase associated with the node
 */
export interface NodeAttributes {
    phase: NodePhase;
}

/**
 * Represents a complete node in a device's configuration as stored or sent to the backend.
 * Contains all information required to identify, configure, and communicate with a node,
 * including protocol, configuration, protocol-specific options, and additional attributes.
 *
 * @interface
 * @property {number | undefined} device_id - Unique identifier of the device this node belongs to. Undefined for new nodes not yet saved.
 * @property {string} name - Full name of the node, typically including phase or grouping prefixes.
 * @property {Protocol} protocol - Communication protocol associated with this node.
 * @property {BaseNodeConfig} config - Base node configuration shared across protocols.
 * @property {BaseNodeProtocolOptions} protocol_options - Protocol-specific configuration options.
 * @property {NodeAttributes} attributes - Additional metadata for the node, such as phase or visibility flags.
 */
export interface NodeRecord {
    device_id?: number;
    name: string;
    protocol: Protocol;
    config: BaseNodeConfig;
    protocol_options: BaseNodeProtocolOptions;
    attributes: NodeAttributes;
}

/**
 * Editable version of a device node used in UI forms for user input and validation.
 * Represents node data with editable fields, user-friendly naming, validation state,
 * and protocol-specific editable configuration.
 *
 * @interface
 * @property {number | undefined} device_id - Unique identifier of the device this node belongs to. Undefined for new nodes not yet saved.
 * @property {string} name - Full internal node name, typically including phase or grouping prefixes.
 * @property {Protocol} protocol - Communication protocol chosen for this node.
 * @property {EditableBaseNodeConfig} config - Editable node configuration used for UI input and validation.
 * @property {EditableBaseNodeProtocolOptions} protocol_options - Editable protocol-specific configuration options.
 * @property {NodeAttributes} attributes - Additional metadata for the node, such as phase or visibility flags.
 * @property {string} display_name - User-friendly display name of the node.
 * @property {string} is_numeric - If node is of numeric type.
 * @property {NodeValidation} validation - Validation state of all editable fields for this node.
 */
export interface EditableNodeRecord {
    device_id?: number;
    name: string;
    protocol: Protocol;
    config: EditableBaseNodeConfig;
    protocol_options: EditableBaseNodeProtocolOptions;
    attributes: NodeAttributes;
    display_name: string;
    is_numeric: boolean;
    validation: NodeValidation;
}

/**
 * Represents the previous state of a node's editable properties during configuration changes.
 * Used to restore values when modifying name, unit, or protocol-specific options.
 *
 * @interface
 * @property {string} oldVariableName - The node's previous variable name.
 * @property {string} oldVariableUnit - The node's previous unit value.
 * @property {EditableBaseNodeProtocolOptions | undefined} oldProtocolOptions - Previously applied protocol-specific options, if any.
 */
export interface NodeRecordEditingState {
    oldVariableName: string;
    oldVariableUnit: string;
    oldProtocolOptions: EditableBaseNodeProtocolOptions | undefined;
}

/**
 * Represents the validation state for all editable properties of a node.
 * Each boolean flag indicates whether the corresponding field passes validation.
 * Used by the UI to provide real-time feedback and to block saving invalid configurations.
 *
 * @interface NodeValidation
 *
 * @property {boolean} variableName - True if the node's display name is valid (syntax, uniqueness, etc.).
 * @property {boolean} variableType - True if the selected internal variable type is valid for this node.
 * @property {boolean} variableUnit - True if the selected measurement unit is valid for the node's type.
 * @property {boolean} protocol - True if the selected communication protocol is valid for this node.
 * @property {boolean} protocolOptions - True if the protocol-specific configuration options are valid.
 * @property {boolean} decimalPlaces - True if the number of decimal places is within an acceptable range.
 * @property {boolean} loggingPeriod - True if the logging interval is valid for the node.
 * @property {boolean} minAlarm - True if the minimum alarm value (if enabled) is valid.
 * @property {boolean} maxAlarm - True if the maximum alarm value (if enabled) is valid.
 * @property {boolean} calculated - True if the configuration for a calculated/virtual node is valid.
 * @property {boolean} isCounter - True if the node is correctly configured as a counter-type variable.
 * @property {boolean} counterMode - True if the counter mode configuration (incremental, rollover, etc.) is valid.
 *
 * @method isValid - Returns true only if all validation flags are true.
 */
export interface NodeValidation {
    variableName: boolean;
    variableType: boolean;
    variableUnit: boolean;
    protocol: boolean;
    protocolOptions: boolean;
    decimalPlaces: boolean;
    loggingPeriod: boolean;
    minAlarm: boolean;
    maxAlarm: boolean;
    calculated: boolean;
    isCounter: boolean;
    counterMode: boolean;
    isValid(): boolean;
}

/*****     O B J E C T S     *****/

/**
 * Default editable base node configuration used for initializing new nodes in UI forms.
 */
export const defaultBaseNodeConfig: EditableBaseNodeConfig = {
    calculated: false,
    custom: true,
    decimal_places: String(2),
    enabled: true,
    is_counter: false,
    counter_mode: null,
    logging: false,
    logging_period: String(15),
    max_alarm: false,
    max_alarm_value: Number(0).toFixed(2),
    min_alarm: false,
    min_alarm_value: Number(0).toFixed(2),
    unit: "",
    publish: true,
};

/**
 * Default editable configuration for nodes without protocol-specific options.
 * Initializes the internal data type to FLOAT as a common starting value.
 *
 * @constant
 */
export const defaultNoProtocolNodeOptions: EditableNodeNoProtocolOptions = {
    type: NodeType.FLOAT,
};
