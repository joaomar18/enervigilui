import { readable } from "svelte/store";
import { derived } from "svelte/store";
import { MeterType, Protocol } from "$lib/stores/devices";
import { getNodePhase } from "$lib/ts/nodes";

/*****     C O N S T A N T S     *****/
export const DECIMAL_PLACES_LIM: Record<string, number> = { MIN: 0, MAX: 6 };
export const LOGGING_PERIOD_LIM: Record<string, number> = { MIN: 1, MAX: 1440 };

/**
 * Prefixes used to identify the electrical phase or type of a node variable.
 * These prefixes are prepended to variable names to organize them by phase in three-phase power systems.
 * 
 * @enum {string}
 * @property {string} L1 - Prefix for Line 1 phase variables (e.g., "l1_voltage")
 * @property {string} L2 - Prefix for Line 2 phase variables (e.g., "l2_voltage")
 * @property {string} L3 - Prefix for Line 3 phase variables (e.g., "l3_voltage")
 * @property {string} L1_L2 - Prefix for line-to-line measurements between L1 and L2 (e.g., "l1_l2_voltage")
 * @property {string} L1_L3 - Prefix for line-to-line measurements between L1 and L3 (e.g., "l1_l3_voltage")
 * @property {string} L2_L1 - Prefix for line-to-line measurements between L2 and L1 (e.g., "l2_l1_voltage")
 * @property {string} L2_L3 - Prefix for line-to-line measurements between L2 and L3 (e.g., "l2_l3_voltage")
 * @property {string} L3_L1 - Prefix for line-to-line measurements between L3 and L1 (e.g., "l3_l1_voltage")
 * @property {string} L3_L2 - Prefix for line-to-line measurements between L3 and L2 (e.g., "l3_l2_voltage")
 * @property {string} TOTAL - Prefix for aggregated measurements across all phases (e.g., "total_power")
 * @property {string} GENERAL - No prefix for phase-independent or system-wide variables
 * @property {string} SINGLEPHASE - No prefix for single-phase electrical system variables
 */
export enum NodePrefix {
    L1 = "l1_",
    L2 = "l2_",
    L3 = "l3_",
    L1_L2 = "l1_l2_",
    L1_L3 = "l1_l3_",
    L2_L1 = "l2_l1_",
    L2_L3 = "l2_l3_",
    L3_L1 = "l3_l1_",
    L3_L2 = "l3_l2_",
    TOTAL = "total_",
    GENERAL = "",
    SINGLEPHASE = ""
}

/**
 * Electrical phases in a three-phase power system.
 * Used to specify which phases a variable can be applied to or measured from.
 * 
 * @enum {string}
 * @property {string} L1 - Line 1 phase in a three-phase system
 * @property {string} L2 - Line 2 phase in a three-phase system  
 * @property {string} L3 - Line 3 phase in a three-phase system
 * @property {string} TOTAL - Aggregated measurement across all three phases
 * @property {string} GENERAL - Phase-independent variables or system-wide measurements
 * @property {string} SINGLEPHASE - Variables applicable to single-phase electrical systems
 */
export enum NodePhase {
    L1 = "L1",
    L2 = "L2",
    L3 = "L3",
    TOTAL = "Total",
    GENERAL = "General",
    SINGLEPHASE = "Singlephase"
}

/**
 * Data types supported for node variables in the energy monitoring system.
 * Determines how values are processed, validated, and displayed in the UI.
 */
export enum NodeType {
    FLOAT = "FLOAT",
    STRING = "STRING",
    INT = "INT",
    BOOLEAN = "BOOLEAN"
}

/**
 * Represents a section of nodes grouped by phase or type in the energy monitoring system.
 * Used to organize, filter, and label nodes for display and configuration.
 *
 * @property {NodePhase} key - Unique key identifying the section (phase)
 * @property {NodePhase} phase - The phase associated with this section
 * @property {NodePrefix} prefix - The prefix used for node names in this section
 * @property {string} labelKey - The translation key for the section label
 * @property {(node: FormattedNode) => boolean} filter - Function to filter nodes belonging to this section
 */
export interface NodeSection {
    key: NodePhase;
    phase: NodePhase;
    prefix: NodePrefix;
    labelKey: string;
    filter: (node: EditableDeviceNode, meter_type: MeterType) => boolean;
}

/**
 * Array of node section definitions used to group and filter nodes by phase or type.
 * Each section specifies its phase, prefix, label key, and filtering logic for organizing nodes in the UI.
 */
export const nodeSections: Array<NodeSection> = [
    {
        key: NodePhase.SINGLEPHASE,
        phase: NodePhase.SINGLEPHASE,
        prefix: NodePrefix.SINGLEPHASE,
        labelKey: "singlePhase",
        filter: (node, meter_type) => getNodePhase(node.name, meter_type) === NodePhase.SINGLEPHASE,
    },
    {
        key: NodePhase.L1,
        phase: NodePhase.L1,
        prefix: NodePrefix.L1,
        labelKey: "l1Phase",
        filter: (node, meter_type) => getNodePhase(node.name, meter_type) === NodePhase.L1,
    },
    {
        key: NodePhase.L2,
        phase: NodePhase.L2,
        prefix: NodePrefix.L2,
        labelKey: "l2Phase",
        filter: (node, meter_type) => getNodePhase(node.name, meter_type) === NodePhase.L2,
    },
    {
        key: NodePhase.L3,
        phase: NodePhase.L3,
        prefix: NodePrefix.L3,
        labelKey: "l3Phase",
        filter: (node, meter_type) => getNodePhase(node.name, meter_type) === NodePhase.L3,
    },
    {
        key: NodePhase.TOTAL,
        phase: NodePhase.TOTAL,
        prefix: NodePrefix.TOTAL,
        labelKey: "total",
        filter: (node, meter_type) => getNodePhase(node.name, meter_type) === NodePhase.TOTAL,
    },
    {
        key: NodePhase.GENERAL,
        phase: NodePhase.GENERAL,
        prefix: NodePrefix.GENERAL,
        labelKey: "general",
        filter: (node, meter_type) => {
            const isL1 = getNodePhase(node.name, meter_type) === NodePhase.L1;
            const isL2 = getNodePhase(node.name, meter_type) === NodePhase.L2;
            const isL3 = getNodePhase(node.name, meter_type) === NodePhase.L3;
            const isTotal = getNodePhase(node.name, meter_type) === NodePhase.TOTAL;
            return !isL1 && !isL2 && !isL3 && !isTotal;
        },
    },
];

/**
 * Contains the default information for typical nodes in the energy monitoring system.
 * This interface defines all default properties and configuration settings needed to 
 * configure and display typical measurement variables (e.g., voltage, current, power).
 * These defaults are used as templates when creating new nodes or resetting node configurations.
 * 
 * @interface DefaultNodeInfo
 * @property {string} name - The variable name identifier (e.g., "voltage", "current", "active_power")
 * @property {NodeType} type - The default data type for this variable
 * @property {number} [defaultNumberOfDecimals] - Default number of decimal places for display
 * @property {string} defaultUnit - Default measurement unit (e.g., "V", "A", "kW")
 * @property {string[]} [availableUnits] - Array of available units for this variable
 * @property {NodePhase[]} applicablePhases - Phases where this variable can be applied
 * @property {NodeType[]} applicableTypes - Data types that this variable supports
 * @property {boolean} canBeVirtual - Whether this variable can be calculated/virtual
 * @property {boolean} defaultPublished - Default publish state for MQTT/external systems
 * @property {number} defaultLoggingPeriod - Default logging interval in minutes
 * @property {boolean} defaultLoggingEnabled - Whether logging is enabled by default
 * @property {boolean} isIncrementalNode - Whether this variable accumulates over time
 * @property {number} [defaultMinAlarm] - Default minimum alarm threshold value
 * @property {number} [defaultMaxAlarm] - Default maximum alarm threshold value
 * @property {boolean} [defaultMinAlarmEnabled] - Whether minimum alarm is enabled by default
 * @property {boolean} [defaultMaxAlarmEnabled] - Whether maximum alarm is enabled by default
 * @property {boolean} useByDefault - The node is by default used
 */
export interface DefaultNodeInfo {
    name: string;
    type: NodeType;
    defaultNumberOfDecimals?: number;
    defaultUnit: string;
    availableUnits?: string[];
    applicablePhases: NodePhase[];
    applicableTypes: NodeType[];
    canBeVirtual: boolean;
    defaultPublished: boolean;
    defaultLoggingPeriod: number;
    defaultLoggingEnabled: boolean;
    isIncrementalNode: boolean;
    defaultMinAlarm?: number;
    defaultMaxAlarm?: number;
    defaultMinAlarmEnabled?: boolean;
    defaultMaxAlarmEnabled?: boolean;
    useByDefault: boolean;
}

/**
 * Configuration specific to Modbus RTU protocol nodes.
 * Defines the protocol-specific settings required for Modbus RTU communication.
 * 
 * @interface
 * @property {number} register - Register address for Modbus communication
 */
export interface NodeModbusRTUConfig {
    register: number;
}

/**
 * Editable configuration for Modbus RTU protocol nodes.
 * Used for UI forms where the register is entered as a string.
 *
 * @property {string} register - Register address as a string for user input
 */
export interface EditableNodeModbusRTUConfig {
    register: string;
}

/**
 * Configuration specific to OPC UA protocol nodes.
 * Defines the protocol-specific settings required for OPC UA communication.
 * 
 * @interface
 * @property {string} node_id - Node identifier in OPC UA format
 */
export interface NodeOPCUAConfig {
    node_id: string;
}

/**
 * Editable configuration for OPC UA protocol nodes.
 * Used for UI forms where the node_id is entered as a string.
 *
 * @property {string} node_id - Node identifier as a string for user input
 */
export interface EditableNodeOPCUAConfig {
    node_id: string;
}

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
 * Complete node configuration combining base config with protocol-specific settings.
 * Uses TypeScript discriminated union to ensure protocol-specific settings match the protocol type.
 * 
 * @type
 */
export type NodeConfiguration = BaseNodeConfig & (NodeModbusRTUConfig | NodeOPCUAConfig | NodeNoProtocolConfig);


/**
 * Editable version of the complete node configuration for UI forms.
 * Combines editable base config with protocol-specific editable settings for user input and validation.
 */
export type EditableNodeConfiguration = EditableBaseNodeConfig & (EditableNodeModbusRTUConfig | EditableNodeOPCUAConfig | NodeNoProtocolConfig);

/**
 * Represents a complete node in a device's configuration (as stored or sent to the backend).
 * Contains all information needed to identify, configure, and communicate with a node.
 *
 * @interface
 * @property {number | undefined} device_id - Unique identifier for the device this node belongs to. May be undefined for new nodes before assignment.
 * @property {string} name - Name of the node, typically includes phase prefix
 * @property {Protocol} protocol - Communication protocol used by this node
 * @property {NodeConfiguration} config - Complete configuration including protocol-specific settings
 */
export interface DeviceNode {
    device_id?: number;
    name: string;
    protocol: Protocol;
    config: NodeConfiguration;
}

/**
 * Editable version of the device node for UI forms and user input.
 * Used to represent device node data with editable fields for user input and validation in the UI.
 *
 * @interface
 * @property {number | undefined} device_id - Unique identifier for the device this node belongs to. May be undefined for new nodes before assignment.
 * @property {string} name - Full node name, typically includes phase prefix
 * @property {Protocol} protocol - Communication protocol used by this node
 * @property {EditableNodeConfiguration} config - Editable configuration for user input and validation
 * @property {string} display_name - Display name of the node (without prefix)
 * @property {NodePhase} phase - Electrical phase associated with this node
 * @property {string} communication_id - Protocol-specific communication identifier (e.g., register or node_id)
 */
export interface EditableDeviceNode {
    device_id?: number;
    name: string;
    protocol: Protocol;
    config: EditableNodeConfiguration;
    display_name: string;
    phase: NodePhase;
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
export interface NodeEditState {
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
        incremental: false,
        calculate_increment: false,
        positive_incremental: false,
        isValid() {
            return this.variableName && this.variableType && this.variableUnit &&
                this.decimalPlaces && this.communicationID && this.loggingPeriod &&
                this.minAlarm && this.maxAlarm && this.calculated && this.incremental;
        }
    };
}

/**
 * A readable store containing predefined variable types for energy monitoring systems.
 * Includes electrical measurements like voltage, current, power, and energy variables
 * with their default configuration settings.
 */
export const defaultVariables = readable<DefaultNodeInfo[]>([
    {
        name: "voltage",
        type: NodeType.FLOAT,
        defaultNumberOfDecimals: 2,
        defaultUnit: "V",
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: true,
        isIncrementalNode: false,
        defaultMinAlarm: 230 * 0.9,
        defaultMaxAlarm: 230 * 1.1,
        defaultMinAlarmEnabled: true,
        defaultMaxAlarmEnabled: true,
        useByDefault: true,
    },
    {
        name: "l1_l2_voltage",
        type: NodeType.FLOAT,
        defaultNumberOfDecimals: 2,
        defaultUnit: "V",
        applicablePhases: [NodePhase.GENERAL],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: true,
        isIncrementalNode: false,
        defaultMinAlarm: 400 * 0.9,
        defaultMaxAlarm: 400 * 1.1,
        defaultMinAlarmEnabled: true,
        defaultMaxAlarmEnabled: true,
        useByDefault: true,
    },
    {
        name: "l2_l3_voltage",
        type: NodeType.FLOAT,
        defaultNumberOfDecimals: 2,
        defaultUnit: "V",
        applicablePhases: [NodePhase.GENERAL],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: true,
        isIncrementalNode: false,
        defaultMinAlarm: 400 * 0.9,
        defaultMaxAlarm: 400 * 1.1,
        defaultMinAlarmEnabled: true,
        defaultMaxAlarmEnabled: true,
        useByDefault: true,
    },
    {
        name: "l3_l1_voltage",
        type: NodeType.FLOAT,
        defaultNumberOfDecimals: 2,
        defaultUnit: "V",
        applicablePhases: [NodePhase.GENERAL],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: true,
        isIncrementalNode: false,
        defaultMinAlarm: 400 * 0.9,
        defaultMaxAlarm: 400 * 1.1,
        defaultMinAlarmEnabled: true,
        defaultMaxAlarmEnabled: true,
        useByDefault: true,
    },
    {
        name: "current",
        type: NodeType.FLOAT,
        defaultNumberOfDecimals: 3,
        defaultUnit: "A",
        availableUnits: ["mA", "A"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
        useByDefault: true,
    },
    {
        name: "active_power",
        type: NodeType.FLOAT,
        defaultUnit: "kW",
        defaultNumberOfDecimals: 3,
        availableUnits: ["W", "kW"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
        useByDefault: true,
    },
    {
        name: "reactive_power",
        type: NodeType.FLOAT,
        defaultNumberOfDecimals: 3,
        defaultUnit: "kVAr",
        availableUnits: ["VAr", "kVAr"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
        useByDefault: true,
    },
    {
        name: "apparent_power",
        type: NodeType.FLOAT,
        defaultNumberOfDecimals: 3,
        defaultUnit: "kVA",
        availableUnits: ["VA", "kVA"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
        useByDefault: true,
    },
    {
        name: "power_factor",
        type: NodeType.FLOAT,
        defaultNumberOfDecimals: 2,
        defaultUnit: "",
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
        useByDefault: true,
    },
    {
        name: "power_factor_direction",
        type: NodeType.STRING,
        defaultUnit: "",
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.STRING],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
        useByDefault: true,
    },
    {
        name: "frequency",
        type: NodeType.FLOAT,
        defaultNumberOfDecimals: 2,
        defaultUnit: "Hz",
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.GENERAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: true,
        isIncrementalNode: false,
        defaultMinAlarm: 50 * 0.99,
        defaultMaxAlarm: 50 * 1.01,
        defaultMinAlarmEnabled: true,
        defaultMaxAlarmEnabled: true,
        useByDefault: false,
    },
    {
        name: "active_energy",
        type: NodeType.FLOAT,
        defaultUnit: "kWh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["Wh", "kWh"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: true,
        isIncrementalNode: true,
        useByDefault: true,
    },
    {
        name: "reactive_energy",
        type: NodeType.FLOAT,
        defaultUnit: "kVArh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["VArh", "kVArh"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: true,
        isIncrementalNode: true,
        useByDefault: true,
    },
    {
        name: "forward_active_energy",
        type: NodeType.FLOAT,
        defaultUnit: "kWh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["Wh", "kWh"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: false,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: true,
        useByDefault: false,
    },
    {
        name: "forward_reactive_energy",
        type: NodeType.FLOAT,
        defaultUnit: "kVArh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["VArh", "kVArh"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: false,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: true,
        useByDefault: false,
    },
    {
        name: "reverse_active_energy",
        type: NodeType.FLOAT,
        defaultUnit: "kWh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["Wh", "kWh"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: false,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: true,
        useByDefault: false,
    },
    {
        name: "reverse_reactive_energy",
        type: NodeType.FLOAT,
        defaultUnit: "kVArh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["VArh", "kVArh"],
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.FLOAT, NodeType.INT],
        canBeVirtual: false,
        defaultPublished: false,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: true,
        useByDefault: false,
    },
]);

/**
 * A derived store that extracts just the variable names from the defaultVariables store.
 * Provides a simple array of all available variable identifiers (e.g., "voltage", "current").
 * Useful for generating selectors, dropdowns, or filtering operations.
 */
export const defaultVariableNames = derived(defaultVariables, ($defaultVariables) =>
    $defaultVariables.map((type) => type.name)
);

/**
 * A derived store that filters variable names by their applicable phases.
 * Returns an object where each key is a phase (e.g., "L1", "L2", "L3", "Total", "") 
 * and each value is an array of variable names that can be applied to that phase.
 * Useful for creating phase-specific variable selectors.
 */
export const defaultVariableNamesByPhase = derived(defaultVariables, ($defaultVariables) => {
    const phaseMap: Record<string, string[]> = {};

    // Initialize all phases
    Object.values(NodePhase).forEach(phase => {
        phaseMap[phase] = [];
    });

    $defaultVariables.forEach((variable) => {
        variable.applicablePhases.forEach(phase => {
            phaseMap[phase].push(variable.name);
        });
    });

    return phaseMap;
});

/**
 * A derived store mapping variable names to their available units.
 * Creates an object where each key is a variable name (e.g., "voltage", "active_power")
 * and each value is an array of available units for that variable.
 * Uses the availableUnits array if present, otherwise defaults to an array containing just the defaultUnit.
 */
export const defaultVariableUnits = derived(defaultVariables, ($defaultVariables) => {
    const unitsMap: Record<string, string[]> = {};

    $defaultVariables.forEach((variable) => {
        unitsMap[variable.name] = variable.availableUnits || [variable.defaultUnit];
    });

    return unitsMap;
});