/*****     C O N S T A N T S     *****/

/*****     E N U M S     *****/

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
    SINGLEPHASE = "",
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
    SINGLEPHASE = "Singlephase",
}

/**
 * Data types supported for node variables in the energy monitoring system.
 * Determines how values are processed, validated, and displayed in the UI.
 */
export enum NodeType {
    FLOAT = "FLOAT",
    STRING = "STRING",
    INT = "INT",
    BOOLEAN = "BOOLEAN",
}

/**
 * Categorizes nodes by their data type and behavior for UI organization and display.
 * Used to group nodes into logical categories in monitoring and configuration interfaces.
 */
export enum NodeCategory {
    Measurements = "Measurements",
    Counters = "Counters",
    States = "States",
    Texts = "Texts",
    Other = "Other",
}

/*****     I N T E R F A C E S     *****/

export interface NodePhaseSection {
    key: NodePhase;
    phase: NodePhase;
    prefix: NodePrefix;
    labelKey: string;
    filter: (phase: NodePhase) => boolean;
}

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

/*****     T Y P E S     *****/

/*****     O B J E C T S     *****/

/**
 * Defines the logical order of electrical phases for sorting and grouping nodes.
 * Used to consistently organize nodes by phase in UI lists and processing logic.
 */
export const phaseOrder = [NodePhase.SINGLEPHASE, NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.GENERAL];

/**
 * Array of node phase section definitions used to group and filter nodes by phase or type.
 * Each section specifies its phase, prefix, label key, and filtering logic for organizing nodes in the UI.
 */
export const nodePhaseSections: Array<NodePhaseSection> = [
    {
        key: NodePhase.SINGLEPHASE,
        phase: NodePhase.SINGLEPHASE,
        prefix: NodePrefix.SINGLEPHASE,
        labelKey: "singlePhase",
        filter: (phase) => phase === NodePhase.SINGLEPHASE,
    },
    {
        key: NodePhase.L1,
        phase: NodePhase.L1,
        prefix: NodePrefix.L1,
        labelKey: "l1Phase",
        filter: (phase) => phase === NodePhase.L1,
    },
    {
        key: NodePhase.L2,
        phase: NodePhase.L2,
        prefix: NodePrefix.L2,
        labelKey: "l2Phase",
        filter: (phase) => phase === NodePhase.L2,
    },
    {
        key: NodePhase.L3,
        phase: NodePhase.L3,
        prefix: NodePrefix.L3,
        labelKey: "l3Phase",
        filter: (phase) => phase === NodePhase.L3,
    },
    {
        key: NodePhase.TOTAL,
        phase: NodePhase.TOTAL,
        prefix: NodePrefix.TOTAL,
        labelKey: "total",
        filter: (phase) => phase === NodePhase.TOTAL,
    },
    {
        key: NodePhase.GENERAL,
        phase: NodePhase.GENERAL,
        prefix: NodePrefix.GENERAL,
        labelKey: "general",
        filter: (phase) => phase === NodePhase.GENERAL,
    },
];
