import type { MeasurementLogPoint } from "$lib/types/nodes/base";

export function measurementPointsToUPlotData(
    points: Array<MeasurementLogPoint>,
    startTimeMs: number,
    endTimeMs: number,
    stepTimeMs: number
): Array<Array<number>> {
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
