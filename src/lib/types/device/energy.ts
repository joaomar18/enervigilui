import type { NodeLogs, MeasurementMetrics } from "../nodes/logs";

/**
 * Enumeration of power factor direction states in electrical systems.
 * Indicates the phase relationship between voltage and current waveforms.
 *
 * @enum {string}
 * @property {string} UNKNOWN - Power factor direction cannot be determined.
 * @property {string} UNITARY - Unity power factor (voltage and current in phase, PF = 1).
 * @property {string} LEADING - Leading power factor (current leads voltage, capacitive load).
 * @property {string} LAGGING - Lagging power factor (current lags voltage, inductive load).
 */
export enum PowerFactorDirection {
    UNKNOWN = "UNKNOWN",
    UNITARY = "UNITARY",
    LEADING = "LEADING",
    LAGGING = "LAGGING",
}

/**
 * Comprehensive energy consumption data structure for electrical monitoring and analysis.
 * Aggregates active and reactive energy consumption with power quality metrics over time periods.
 *
 * @interface EnergyConsumptionType
 * @property {NodeLogs} active_energy - Historical logs of active energy consumption (real power, measured in kWh).
 * @property {NodeLogs} reactive_energy - Historical logs of reactive energy consumption (imaginary power, measured in kVArh).
 * @property {NodeLogs} power_factor - Historical logs of power factor values (ratio of active to apparent power, 0-1 range).
 * @property {NodeLogs} power_factor_direction - Historical logs of power factor direction states (leading/lagging/unitary).
 */
export interface EnergyConsumptionType {
    active_energy: NodeLogs;
    reactive_energy: NodeLogs;
    power_factor: NodeLogs;
    power_factor_direction: NodeLogs;
}

export interface PeakPowerType {
    active_power_all_time: MeasurementMetrics | null;
    apparent_power_all_time: MeasurementMetrics | null;
    active_power: MeasurementMetrics | null;
    apparent_power: MeasurementMetrics | null;
}

export interface PhaseImbalanceType {
    l1_voltage: MeasurementMetrics | null;
    l2_voltage: MeasurementMetrics | null;
    l3_voltage: MeasurementMetrics | null;
    l1_current: MeasurementMetrics | null;
    l2_current: MeasurementMetrics | null;
    l3_current: MeasurementMetrics | null;
    voltage_imbalance: number | null;
    current_imbalance: number | null;
}
