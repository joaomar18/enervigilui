import type { SvelteComponent } from "svelte";
import type { NodeType } from "./base";

/*****     C O N S T A N T S     *****/

/*****     E N U M S     *****/

/*****     I N T E R F A C E S     *****/

/**
 * Base interface for logged data points with time range information.
 * @property {string} start_time - ISO timestamp marking the beginning of the logging period
 * @property {string} end_time - ISO timestamp marking the end of the logging period
 */
export interface BaseLogPoint {
    start_time: string;
    end_time: string;
}

/**
 * Log point for measurement nodes with statistical data over a time period.
 * @property {number} average_value - Mean value during the logging period
 * @property {number} min_value - Minimum value recorded during the logging period
 * @property {number} max_value - Maximum value recorded during the logging period
 */
export interface MeasurementLogPoint extends BaseLogPoint {
    average_value: number;
    min_value: number;
    max_value: number;
}

/**
 * Log point for counter nodes with accumulated value.
 * @property {number} value - Total accumulated value at the end of the logging period
 */
export interface CounterLogPoint extends BaseLogPoint {
    value: number;
}

/**
 * Base processed log point with Unix timestamps for chart rendering.
 * @property {number} start_time - Unix timestamp (seconds) marking the beginning of the logging period
 * @property {number} end_time - Unix timestamp (seconds) marking the end of the logging period
 */
export interface ProcessedBaseLogPoint {
    start_time: number;
    end_time: number;
}

/**
 * Processed measurement log point with statistical data and Unix timestamps.
 * @property {number} average_value - Mean value during the logging period
 * @property {number} min_value - Minimum value recorded during the logging period
 * @property {number} max_value - Maximum value recorded during the logging period
 */
export interface ProcessedMeasurementLogPoint extends ProcessedBaseLogPoint {
    average_value: number;
    min_value: number;
    max_value: number;
}

/**
 * Processed counter log point with accumulated value and Unix timestamps.
 * @property {number} value - Total accumulated value at the end of the logging period
 */
export interface ProcessedCounterLogPoint extends ProcessedBaseLogPoint {
    value: number;
}

/**
 * Raw node logs with metadata and unprocessed log points.
 * @property {string} unit - Measurement unit (e.g., "V", "A", "kW")
 * @property {NodeType} type - Data type of the logged values
 * @property {boolean} incremental - Whether this node accumulates values over time
 * @property {Array<BaseLogPoint>} points - Array of raw log data points
 */
export interface NodeLogs {
    unit: string;
    type: NodeType;
    incremental: boolean;
    points: Array<BaseLogPoint>;
}

/**
 * Processed node logs with metadata, UI components, and processed log points.
 * @property {string} unit - Measurement unit (e.g., "V", "A", "kW")
 * @property {NodeType} type - Data type of the logged values
 * @property {boolean} incremental - Whether this node accumulates values over time
 * @property {Array<ProcessedBaseLogPoint>} points - Array of processed log data points with Unix timestamps
 * @property {typeof SvelteComponent<any>} graphComponent - Svelte component for rendering the data graph
 * @property {typeof SvelteComponent<any>} metricsComponent - Svelte component for displaying metrics
 */
export interface ProcessedNodeLogs {
    unit: string;
    type: NodeType;
    incremental: boolean;
    points: Array<ProcessedBaseLogPoint>;
    graphComponent: typeof SvelteComponent<any>;
    metricsComponent: typeof SvelteComponent<any>;
}

/*****     O B J E C T S     *****/
