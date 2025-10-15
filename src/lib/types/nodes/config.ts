import { NodeType, NodePhase } from "./base";
import { Protocol } from "../device/base";

/*****     C O N S T A N T S     *****/

export const DECIMAL_PLACES_LIM: Record<string, number> = { MIN: 0, MAX: 6 };
export const LOGGING_PERIOD_LIM: Record<string, number> = { MIN: 1, MAX: 1440 };

/*****     E N U M S     *****/

/*****     I N T E R F A C E S     *****/

/**
 * Configuration for nodes without communication protocol.
 * Used for virtual or calculated nodes that don't require external communication.
 *
 * @interface
 */
export interface NodeNoProtocolConfig {
    // No protocol-specific properties
}

/**
 * Base configuration shared by all node types regardless of protocol.
 * Defines common settings and parameters used across all nodes in the system.
 *
 * @interface
 * @property {boolean | null} calculate_increment - If true, increment is calculated internally for incremental nodes (can be null for non-incremental nodes)
 * @property {boolean} calculated - True if the node value is calculated rather than obtained via communication
 * @property {boolean} custom - True if this is a custom user-defined node
 * @property {number | null} decimal_places - Number of decimal places to display for numeric values (can be null for non-numeric types)
 * @property {boolean} enabled - Whether the node is currently enabled
 * @property {boolean | null} incremental_node - True if the node value accumulates over time (can be null for non-applicable nodes)
 * @property {boolean} logging - Whether data logging is enabled for this node
 * @property {number} logging_period - Logging frequency in minutes
 * @property {boolean} max_alarm - Whether maximum threshold alarm is enabled
 * @property {number | null} max_alarm_value - Value that triggers maximum threshold alarm (can be null when alarm is disabled)
 * @property {boolean} min_alarm - Whether minimum threshold alarm is enabled
 * @property {number | null} min_alarm_value - Value that triggers minimum threshold alarm (can be null when alarm is disabled)
 * @property {boolean | null} positive_incremental - For incremental nodes, whether to add or subtract from initial value (can be null for non-incremental nodes)
 * @property {boolean} publish - Whether the node's value should be published to external systems or services
 * @property {NodeType} type - Data type of the node value
 * @property {string | null} unit - Measurement unit (e.g., V, A, kW, null for non numeric types)
 */
export interface BaseNodeConfig {
    calculate_increment: boolean | null;
    calculated: boolean;
    custom: boolean;
    decimal_places: number | null;
    enabled: boolean;
    incremental_node: boolean | null;
    logging: boolean;
    logging_period: number;
    max_alarm: boolean;
    max_alarm_value: number | null;
    min_alarm: boolean;
    min_alarm_value: number | null;
    positive_incremental: boolean | null;
    publish: boolean;
    type: NodeType;
    unit: string | null;
}

/**
 * Editable version of the base node configuration for UI forms.
 * All numeric fields are represented as strings to support user input and validation.
 */
export interface EditableBaseNodeConfig {
    calculate_increment: boolean;
    calculated: boolean;
    custom: boolean;
    decimal_places: string;
    enabled: boolean;
    incremental_node: boolean;
    logging: boolean;
    logging_period: string;
    max_alarm: boolean;
    max_alarm_value: string;
    min_alarm: boolean;
    min_alarm_value: string;
    positive_incremental: boolean;
    publish: boolean;
    type: NodeType;
    unit: string;
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
 * Contains all information needed to identify, configure, and communicate with a node,
 * including protocol, configuration, and additional attributes such as phase.
 *
 * @interface
 * @property {number | undefined} device_id - Unique identifier for the device this node belongs to. May be undefined for new nodes before assignment.
 * @property {string} name - Name of the node, typically includes phase prefix.
 * @property {Protocol} protocol - Communication protocol used by this node.
 * @property {BaseNodeConfig} config - Node configuration with protocol-specific options.
 * @property {DeviceNodeAttributes} attributes - Additional metadata for the node, such as phase.
 */
export interface NodeRecord {
    device_id?: number;
    name: string;
    protocol: Protocol;
    config: BaseNodeConfig;
    attributes: NodeAttributes;
}

/**
 * Editable version of the device node for UI forms and user input.
 * Used to represent device node data with editable fields for user input and validation in the UI,
 * including display name, communication ID, and validation state.
 *
 * @interface
 * @property {number | undefined} device_id - Unique identifier for the device this node belongs to. May be undefined for new nodes before assignment.
 * @property {string} name - Full node name, typically includes phase prefix.
 * @property {Protocol} protocol - Communication protocol used by this node.
 * @property {EditableBaseNodeConfig} config - Editable configuration for user input and validation.
 * @property {DeviceNodeAttributes} attributes - Additional metadata for the node, such as phase.
 * @property {string} display_name - Display name of the node (without prefix).
 * @property {string} communication_id - Protocol-specific communication identifier (e.g., register or node_id).
 * @property {NodeValidation} validation - Validation state for all editable properties of the node.
 */
export interface EditableNodeRecord {
    device_id?: number;
    name: string;
    protocol: Protocol;
    config: EditableBaseNodeConfig;
    attributes: NodeAttributes;
    display_name: string;
    communication_id: string;
    validation: NodeValidation;
}

/**
 * Represents the previous state of a node's editable properties during configuration changes.
 * Used to track and restore values when editing node type, name, unit, section, or communication ID.
 *
 * @property {string} oldVariableName - The previous variable name of the node being edited
 * @property {NodeType} oldVariableType - The previous variable type of the node being edited
 * @property {string} oldVariableUnit - The previous unit value before
 * @property {string | undefined} oldCommunicationID - The previous communication ID before the edit
 */
export interface NodeRecordEditingState {
    oldVariableName: string;
    oldVariableType: NodeType;
    oldVariableUnit: string;
    oldCommunicationID: string | undefined;
}

/**
 * Represents the validation state for all editable properties of a node.
 * Each boolean property indicates whether the corresponding node field passes validation.
 * Used to provide real-time feedback in the UI and prevent invalid configurations from being saved.
 *
 * @interface
 * @property {boolean} variableName - True if the variable name is valid (follows naming rules, unique, etc.)
 * @property {boolean} variableType - True if the selected variable type is valid for the current variable
 * @property {boolean} variableUnit - True if the unit is valid for the selected variable and type
 * @property {boolean} decimalPlaces - True if the decimal places value is within valid range
 * @property {boolean} communicationID - True if the communication ID is valid for the selected protocol
 * @property {boolean} loggingPeriod - True if the logging period is within valid range
 * @property {boolean} minAlarm - True if the minimum alarm value is valid
 * @property {boolean} maxAlarm - True if the maximum alarm value is valid
 * @property {boolean} calculated - True if the calculated/virtual node configuration is valid
 * @property {boolean} incremental - True if the incremental node configuration is valid
 * @method isValid - Returns true if all validation checks pass (logical AND of all other properties)
 */
export interface NodeValidation {
    variableName: boolean;
    variableType: boolean;
    variableUnit: boolean;
    communicationID: boolean;
    protocol: boolean;
    type: boolean;
    decimalPlaces: boolean;
    loggingPeriod: boolean;
    minAlarm: boolean;
    maxAlarm: boolean;
    calculated: boolean;
    incremental: boolean;
    calculate_increment: boolean;
    positive_incremental: boolean;
    isValid(): boolean;
}

/*****     O B J E C T S     *****/

/**
 * Default editable base node configuration used for initializing new nodes in UI forms.
 */
export const defaultBaseNodeConfig: EditableBaseNodeConfig = {
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