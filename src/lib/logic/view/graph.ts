import { GraphTimeSpan, GraphTimeStep } from "$lib/types/view/graph";
import { minDurationMs, min15DurationMs, hourDurationMs, dayDurationMs, monthDurationMs, yearDurationMs } from "../util/date";
import type { MeasurementLogPoint } from "$lib/types/nodes/base";


export function getGraphBounds(startTimeMs: number, endTimeMs: number): { timeSpan: GraphTimeSpan, timeStep: GraphTimeStep } {

    const spanMs = endTimeMs - startTimeMs;

    if (spanMs > yearDurationMs(startTimeMs)) {
        return { timeSpan: GraphTimeSpan._MY, timeStep: GraphTimeStep._1Y };
    }
    else if (spanMs > monthDurationMs(startTimeMs)) {
        return { timeSpan: GraphTimeSpan._1Y, timeStep: GraphTimeStep._1M };
    }
    else if (spanMs > dayDurationMs(startTimeMs)) {
        return { timeSpan: GraphTimeSpan._1M, timeStep: GraphTimeStep._1d };
    }
    else if (spanMs > hourDurationMs(startTimeMs)) {
        return { timeSpan: GraphTimeSpan._1d, timeStep: GraphTimeStep._1h };
    }
    else if (spanMs > min15DurationMs(startTimeMs)) {
        return { timeSpan: GraphTimeSpan._15m, timeStep: GraphTimeStep._15m };
    }
    else {
        return { timeSpan: GraphTimeSpan._15m, timeStep: GraphTimeStep._1m };
    }
}

export function getStepToMs(step: GraphTimeStep, startTimeMs: number): number {
    switch (step) {
        case GraphTimeStep._1m:
            return minDurationMs(startTimeMs);
        case GraphTimeStep._15m:
            return min15DurationMs(startTimeMs);
        case GraphTimeStep._1h:
            return hourDurationMs(startTimeMs);
        case GraphTimeStep._1d:
            return dayDurationMs(startTimeMs);
        case GraphTimeStep._1M:
            return monthDurationMs(startTimeMs);
        case GraphTimeStep._1Y:
            return yearDurationMs(startTimeMs);
    }
}



export function measurementPointsToUPlotData(points: Array<MeasurementLogPoint>, startTimeMs: number, endTimeMs: number, stepTimeMs: number): Array<Array<number>> {
    let timestamps = [] as Array<number>;
    let average = [] as Array<number>;
    let minimum = [] as Array<number>;
    let maximum = [] as Array<number>;
    let currentTimeStamp = startTimeMs;

    while (currentTimeStamp < endTimeMs) {
        timestamps.push(currentTimeStamp);
        currentTimeStamp += stepTimeMs;
    }

    return [timestamps, average, minimum, maximum];
}