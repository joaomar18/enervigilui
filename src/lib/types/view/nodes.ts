import { NodeCategory } from "$lib/types/nodes/base";

/** Column visibility configuration with optional width and visibility state */
export interface ColumnVisibilityState {
    hideWidth?: number;
    visible: boolean;
}

/** Visibility configuration for all table columns in the nodes view */
export interface ColumnVisibilityMap {
    name: ColumnVisibilityState;
    unit: ColumnVisibilityState;
    type: ColumnVisibilityState;
    communicationID: ColumnVisibilityState;
    custom: ColumnVisibilityState;
    publish: ColumnVisibilityState;
    virtual: ColumnVisibilityState;
    logging: ColumnVisibilityState;
    logging_period: ColumnVisibilityState;
    min_alarm: ColumnVisibilityState;
    max_alarm: ColumnVisibilityState;
    enable_min_alarm: ColumnVisibilityState;
    enable_max_alarm: ColumnVisibilityState;
    enable: ColumnVisibilityState;
    actions: ColumnVisibilityState;
}

/**
 * Time period options for displaying node historical data and logs.
 * Used in date range selectors for filtering node data by time spans.
 */
export enum LogSpanPeriod {
    currentHour = "lastHour",
    currentDay = "lastDay",
    current7Days = "current7Days",
    currentMonth = "currentMonth",
    currentYear = "currentYear",
    customDate = "customDate",
}

/** Time span configuration for node navigation history */
export interface NodeTimeSpan {
    initial_date: Date;
    end_date: Date;
    log_span_period: LogSpanPeriod;
}

/**
 * Mapping configuration for metrics display in the UI, organizing metric keys by node category
 * with their corresponding internationalization text keys and icon file references.
 * 
 * Structure maps NodeCategory → metric key → display configuration:
 * - textKey: Reference to internationalization text for metric labels
 * - imageFile: icon filename for visual metric identification
 * 
 * Used by getMetricsViewVariables() to transform raw metrics data into view-ready format
 * with proper labels and icons for different node types (Measurements, Counters, etc.).
 */
export const metricsTextKeyMap: Record<string, Record<string, { textKey: string, imageFile: string }>> = {
    [NodeCategory.Measurements]: {
        "max_value": { textKey: "maxValue", imageFile: "max-value.svg" },
        "average_value": { textKey: "averageValue", imageFile: "average-value.svg" },
        "min_value": { textKey: "minValue", imageFile: "min-value.svg" },
    },
    [NodeCategory.Counters]: {
        "value": { textKey: "total", imageFile: "total-value.svg" },
    },
    [NodeCategory.States]: {
    },
    [NodeCategory.Texts]: {
    },
    [NodeCategory.Other]: {
    }
};