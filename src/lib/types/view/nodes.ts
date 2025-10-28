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