/**
 * Coarse window sizes representing the total span of the x-axis (view range).
 */
export enum GraphTimeSpan {
    _15m = "15m", // 15 Minutes
    _1h = "1h", // 1 Hour
    _1d = "1d", // 1 Day
    _1M = "1M", // 1 Month
    _1Y = "1Y", // 1 Year
    _MY = "MY", // Multiple Years
}


/**
 * Discrete aggregation step sizes (resolution) supported by the graphing system.
 */
export enum GraphTimeStep {
    _1m = "1m", // 1 Minute
    _15m = "15m", // 15 Minutes
    _1h = "1h", // 1 Hour
    _1d = "1d", // 1 Day
    _1M = "1M", // 1 Month
    _1Y = "1Y" // 1 Year
}