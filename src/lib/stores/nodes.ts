import { readable } from "svelte/store";
import { derived } from "svelte/store";

/**
 * Represents a default node variable type in the energy monitoring system.
 * This interface defines all properties needed to configure and display
 * typical measurement variables (e.g., voltage, current, power) in the system.
 */
export interface NodeVariableType {
    /** Unique identifier name of the variable (e.g., "voltage", "current") */
    variable: string;

    /** Data type of the variable - determines how values are processed and displayed */
    type: "INT" | "FLOAT" | "STRING" | "BOOLEAN";

    /** Number of decimal places to display for FLOAT type variables */
    defaultNumberOfDecimals?: number;

    /** Primary unit of measurement for the variable (e.g., "V" for voltage) */
    defaultUnit: string;

    /** Alternative units that can be selected for this variable (e.g., ["W", "kW"]) */
    availableUnits?: string[];

    /** Specifies which phases this variable can be applied to in power systems */
    applicablePhases: ("L1" | "L2" | "L3" | "Total" | "")[];

    /** Indicates if this variable can be calculated from other variables rather than measured directly */
    canBeVirtual: boolean;

    /** Whether this variable should be published to external systems by default */
    defaultPublished: boolean;

    /** Default period (in minutes) at which values should be logged */
    defaultLoggingPeriod: number;

    /** Whether logging is enabled by default for this variable */
    defaultLoggingEnabled: boolean;

    /** Indicates if the variable accumulates over time (like energy readings) vs. instantaneous values */
    isIncrementalNode: boolean;

    /** Default minimum threshold for triggering alarms */
    defaultMinAlarm?: number;

    /** Default maximum threshold for triggering alarms */
    defaultMaxAlarm?: number;

    /** Whether the minimum alarm is enabled by default */
    defaultMinAlarmEnabled?: boolean;

    /** Whether the maximum alarm is enabled by default */
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
        type: "FLOAT",
        defaultNumberOfDecimals: 2,
        defaultUnit: "V",
        applicablePhases: ["L1", "L2", "L3", ""],
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
        variable: "current",
        type: "FLOAT",
        defaultNumberOfDecimals: 3,
        defaultUnit: "A",
        availableUnits: ["mA", "A"],
        applicablePhases: ["L1", "L2", "L3", ""],
        canBeVirtual: false,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
    },
    {
        variable: "active_power",
        type: "FLOAT",
        defaultUnit: "kW",
        defaultNumberOfDecimals: 3,
        availableUnits: ["W", "kW"],
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
    },
    {
        variable: "reactive_power",
        type: "FLOAT",
        defaultNumberOfDecimals: 3,
        defaultUnit: "kVAr",
        availableUnits: ["VAr", "kVAr"],
        applicablePhases: ["L1", "L2", "L3", "Total"],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
    },
    {
        variable: "apparent_power",
        type: "FLOAT",
        defaultNumberOfDecimals: 3,
        defaultUnit: "kVA",
        availableUnits: ["VA", "kVA"],
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
    },
    {
        variable: "power_factor",
        type: "FLOAT",
        defaultNumberOfDecimals: 2,
        defaultUnit: "",
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
    },
    {
        variable: "power_factor_direction",
        type: "STRING",
        defaultUnit: "",
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: false,
    },
    {
        variable: "frequency",
        type: "FLOAT",
        defaultNumberOfDecimals: 2,
        defaultUnit: "Hz",
        applicablePhases: ["L1", "L2", "L3", ""],
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
        type: "FLOAT",
        defaultUnit: "kWh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["Wh", "kWh"],
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: true,
        isIncrementalNode: true,
    },
    {
        variable: "reactive_energy",
        type: "FLOAT",
        defaultUnit: "kVArh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["VArh", "kVArh"],
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
        canBeVirtual: true,
        defaultPublished: true,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: true,
        isIncrementalNode: true,
    },
    {
        variable: "forward_active_energy",
        type: "FLOAT",
        defaultUnit: "kWh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["Wh", "kWh"],
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
        canBeVirtual: false,
        defaultPublished: false,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: true,
    },
    {
        variable: "forward_reactive_energy",
        type: "FLOAT",
        defaultUnit: "kVArh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["VArh", "kVArh"],
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
        canBeVirtual: false,
        defaultPublished: false,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: true,
    },
    {
        variable: "reverse_active_energy",
        type: "FLOAT",
        defaultUnit: "kWh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["Wh", "kWh"],
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
        canBeVirtual: false,
        defaultPublished: false,
        defaultLoggingPeriod: 15,
        defaultLoggingEnabled: false,
        isIncrementalNode: true,
    },
    {
        variable: "reverse_reactive_energy",
        type: "FLOAT",
        defaultUnit: "kVArh",
        defaultNumberOfDecimals: 3,
        availableUnits: ["VArh", "kVArh"],
        applicablePhases: ["L1", "L2", "L3", "Total", ""],
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
