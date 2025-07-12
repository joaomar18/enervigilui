import { readable } from "svelte/store";
import { derived } from "svelte/store";

/**
 * Communication protocols supported by the energy monitoring system.
 * Defines the available protocols for communicating with external devices and systems.
 */
export enum Protocol {
    MODBUS_RTU = "MODBUS_RTU",
    OPC_UA = "OPC_UA",
    NONE = "NONE"
}

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
    SINGLEPHASE = "1F"
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
 * Represents a default node variable type in the energy monitoring system.
 * This interface defines all properties needed to configure and display
 * typical measurement variables (e.g., voltage, current, power) in the system.
 */
export interface NodeVariableType {
    variable: string;
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
}

/**
 * A readable store containing predefined variable types for energy monitoring systems.
 * Includes electrical measurements like voltage, current, power, and energy variables
 * with their default configuration settings.
 */
export const defaultVariables = readable<NodeVariableType[]>([
    {
        variable: "voltage",
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
    },
    {
        variable: "l1_l2_voltage",
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
    },
    {
        variable: "l2_l3_voltage",
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
    },
    {
        variable: "l3_l1_voltage",
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
    },
    {
        variable: "current",
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
    },
    {
        variable: "active_power",
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
    },
    {
        variable: "reactive_power",
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
    },
    {
        variable: "apparent_power",
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
    },
    {
        variable: "power_factor",
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
    },
    {
        variable: "power_factor_direction",
        type: NodeType.STRING,
        defaultUnit: "",
        applicablePhases: [NodePhase.L1, NodePhase.L2, NodePhase.L3, NodePhase.TOTAL, NodePhase.SINGLEPHASE],
        applicableTypes: [NodeType.STRING],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
    },
    {
        variable: "frequency",
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
    },
    {
        variable: "active_energy",
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
    },
    {
        variable: "reactive_energy",
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
    },
    {
        variable: "forward_active_energy",
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
    },
    {
        variable: "forward_reactive_energy",
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
    },
    {
        variable: "reverse_active_energy",
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
    },
    {
        variable: "reverse_reactive_energy",
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
    },
]);

/**
 * A derived store that extracts just the variable names from the defaultVariables store.
 * Provides a simple array of all available variable identifiers (e.g., "voltage", "current").
 * Useful for generating selectors, dropdowns, or filtering operations.
 */
export const defaultVariableNames = derived(defaultVariables, ($defaultVariables) =>
    $defaultVariables.map((type) => type.variable)
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
            phaseMap[phase].push(variable.variable);
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
        unitsMap[variable.variable] = variable.availableUnits || [variable.defaultUnit];
    });

    return unitsMap;
});