import { GraphTimeStep, GraphTimePeriod } from "$lib/types/view/graph";

/**
 * Classify the span between two dates into a coarse GraphTimePeriod bucket.
 * Month & year are resolved using calendar boundaries (variable length aware).
 */
export function getTimePeriod(startTime: Date, endTime: Date): GraphTimePeriod {
    if (endTime < startTime) {
        [startTime, endTime] = [endTime, startTime];
    }

    const spanMs = endTime.getTime() - startTime.getTime();

    // Compute dynamic month/year lengths from start anchor.
    const ms1Month = monthDurationMs(startTime);
    const ms1Year = yearDurationMs(startTime);

    if (spanMs >= ms1Year) {
        return GraphTimePeriod.min1Year;
    }
    if (spanMs >= ms1Month) {
        return GraphTimePeriod.min1Month;
    }
    if (spanMs >= MS_DAY) {
        return GraphTimePeriod.min1Day;
    }
    if (spanMs >= MS_HOUR) {
        return GraphTimePeriod.min1Hour;
    }
    // Everything smaller defaults to 15-minute bucket
    return GraphTimePeriod.min15Min;
}

export function mapTimePeriodToTimeStep(timePeriod: GraphTimePeriod): GraphTimeStep {
    switch (timePeriod) {
        case GraphTimePeriod.min15Min:
            return GraphTimeStep._1m;
        case GraphTimePeriod.min1Hour:
            return GraphTimeStep._15m;
        case GraphTimePeriod.min1Day:
            return GraphTimeStep._1h;
        case GraphTimePeriod.min1Month:
            return GraphTimeStep._1d;
        case GraphTimePeriod.min1Year:
            return GraphTimeStep._1M;
        default:
            throw new Error(`Can't map unknown time period ${timePeriod}.`);
    }
}