import { writable } from "svelte/store";

export interface NodeVariableType {
    variable: string; // Name of the variable
    type: "INT" | "FLOAT" | "STRING" | "BOOLEAN"; // Type of the variable
    numberOfDecimals?: number; // Optional, for FLOAT types
    defaultUnit: string; // Default unit for the variable
    availableUnits?: string[]; // Optional, if there are multiple units available
    applicablePhases: ("L1" | "L2" | "L3" | "Total" | "")[];
    canBeVirtual: boolean; // If the variable can be a virtual calculation
    defaultPublished: boolean; // If the variable is published by default
    defaultLoggingPeriod: number; // in minutes
}

// Define all available node variable types
const createNodeVariableTypes = () => {
    const { subscribe, set, update } = writable<NodeVariableType[]>([
        {
            variable: "voltage",
            type: "FLOAT",
            numberOfDecimals: 2,
            defaultUnit: "V",
            applicablePhases: ["L1", "L2", "L3", ""],
            canBeVirtual: false,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "current",
            type: "FLOAT",
            numberOfDecimals: 3,
            defaultUnit: "A",
            availableUnits: ["mA", "A"],
            applicablePhases: ["L1", "L2", "L3", ""],
            canBeVirtual: false,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "active_power",
            type: "FLOAT",
            defaultUnit: "kW",
            numberOfDecimals: 3,
            availableUnits: ["W", "kW"],
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: true,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "reactive_power",
            type: "FLOAT",
            numberOfDecimals: 3,
            defaultUnit: "kVAr",
            availableUnits: ["VAr", "kVAr"],
            applicablePhases: ["L1", "L2", "L3", "Total"],
            canBeVirtual: true,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "apparent_power",
            type: "FLOAT",
            numberOfDecimals: 3,
            defaultUnit: "kVA",
            availableUnits: ["VA", "kVA"],
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: true,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "power_factor",
            type: "FLOAT",
            numberOfDecimals: 2,
            defaultUnit: "",
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: true,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "power_factor_direction",
            type: "STRING",
            defaultUnit: "",
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: true,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "frequency",
            type: "FLOAT",
            numberOfDecimals: 2,
            defaultUnit: "Hz",
            applicablePhases: ["L1", "L2", "L3", ""],
            canBeVirtual: false,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "active_energy",
            type: "FLOAT",
            defaultUnit: "kWh",
            numberOfDecimals: 3,
            availableUnits: ["Wh", "kWh"],
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: true,
            defaultPublished: true,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "reactive_energy",
            type: "FLOAT",
            defaultUnit: "kVArh",
            numberOfDecimals: 3,
            availableUnits: ["VArh", "kVArh"],
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: true,
            defaultPublished: true,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "forward_active_energy",
            type: "FLOAT",
            defaultUnit: "kWh",
            numberOfDecimals: 3,
            availableUnits: ["Wh", "kWh"],
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: false,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "forward_reactive_energy",
            type: "FLOAT",
            defaultUnit: "kVArh",
            numberOfDecimals: 3,
            availableUnits: ["VArh", "kVArh"],
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: false,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "reverse_active_energy",
            type: "FLOAT",
            defaultUnit: "kWh",
            numberOfDecimals: 3,
            availableUnits: ["Wh", "kWh"],
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: false,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
        {
            variable: "reverse_reactive_energy",
            type: "FLOAT",
            defaultUnit: "kVArh",
            numberOfDecimals: 3,
            availableUnits: ["VArh", "kVArh"],
            applicablePhases: ["L1", "L2", "L3", "Total", ""],
            canBeVirtual: false,
            defaultPublished: false,
            defaultLoggingPeriod: 15,
        },
    ]);

    return {
        subscribe,
        reset: () => set([]),
    };
};

export const nodeVariableTypes = createNodeVariableTypes();
