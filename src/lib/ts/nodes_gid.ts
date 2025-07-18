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
    enable: ColumnVisibilityState;
    actions: ColumnVisibilityState;
}
