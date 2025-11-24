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

/**
 * Peak power metrics for a measurement interval.
 * Contains measurement metrics for active (real), reactive, and apparent power.
 *
 * @interface PeakPowerType
 * @property {MeasurementMetrics} active_power - Peak active (real) power metrics.
 * @property {MeasurementMetrics} reactive_power - Peak reactive power metrics.
 * @property {MeasurementMetrics} apparent_power - Peak apparent power metrics.
 */
export interface PeakPowerType {
    active_power: MeasurementMetrics;
    reactive_power: MeasurementMetrics;
    apparent_power: MeasurementMetrics;
}

/**
 * Phase balance metrics for three-phase systems.
 * Reports per-phase voltage and current measurement metrics and computed balance values.
 *
 * @interface PhaseBalanceType
 * @property {MeasurementMetrics} l1_voltage - Line 1 voltage measurement metrics.
 * @property {MeasurementMetrics} l2_voltage - Line 2 voltage measurement metrics.
 * @property {MeasurementMetrics} l3_voltage - Line 3 voltage measurement metrics.
 * @property {MeasurementMetrics} l1_current - Line 1 current measurement metrics.
 * @property {MeasurementMetrics} l2_current - Line 2 current measurement metrics.
 * @property {MeasurementMetrics} l3_current - Line 3 current measurement metrics.
 * @property {number|null} voltage_imbalance - Computed voltage imbalance (percent) or null if unavailable.
 * @property {number|null} current_imbalance - Computed current imbalance (percent) or null if unavailable.
 */
export interface PhaseBalanceType {
    l1_voltage: MeasurementMetrics;
    l2_voltage: MeasurementMetrics;
    l3_voltage: MeasurementMetrics;
    l1_current: MeasurementMetrics;
    l2_current: MeasurementMetrics;
    l3_current: MeasurementMetrics;
    voltage_imbalance: number | null;
    current_imbalance: number | null;
}
