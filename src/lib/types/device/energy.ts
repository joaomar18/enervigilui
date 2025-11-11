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
 * Energy consumption data structure for electrical monitoring.
 * Captures active and reactive energy consumption along with power factor metrics.
 *
 * @interface EnergyConsumptionType
 * @property {NodeLogs} active_energy - Active energy consumption logs (real power, measured in kWh).
 * @property {NodeLogs} reactive_energy - Reactive energy consumption logs (imaginary power, measured in kVArh).
 * @property {number | null} power_factor - Power factor value (ratio of active to apparent power, range: 0-1).
 * @property {PowerFactorDirection | null} power_factor_direction - Direction indicator for power factor (leading/lagging/unitary).
 */
export interface EnergyConsumptionType {
    active_energy: NodeLogs;
    reactive_energy: NodeLogs;
    power_factor: number | null;
    power_factor_direction: PowerFactorDirection | null;
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
