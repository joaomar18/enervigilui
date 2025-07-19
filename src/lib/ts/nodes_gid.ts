export interface ColumnVisibilityState {
    hideWidth?: number;
    visible: boolean;
}

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
