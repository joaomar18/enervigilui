
import { timeStepFormatters } from "$lib/types/date";
import type { FormattedTimeStep } from "$lib/types/date";
import type { ProcessedMeasurementLogPoint, ProcessedCounterLogPoint } from "$lib/types/nodes/logs";
import type { LogSpanPeriod } from "$lib/types/view/nodes";
import uPlot, { type AlignedData } from "uplot";

/**
 * Gets the dimensions of a graph container element.
 * Measures the actual rendered size of the container for responsive chart sizing.
 * 
 * @param graphContainer - The HTML element containing the graph
 * @returns Object with width and height in pixels, or {0, 0} if container is invalid
 */
export function getGraphSize(graphContainer: HTMLElement): { width: number; height: number } {
    let width = 0;
    let height = 0;
    if (graphContainer) {
        const containerRect = graphContainer.getBoundingClientRect();
        width = containerRect.width;
        height = containerRect.height;
    }
    return { width, height };
}

export function getMeasurementGraphFormat(points: Array<ProcessedMeasurementLogPoint>): AlignedData {
    const timestampValues: Array<number> = [];
    const minValues: Array<number> = [];
    const maxValues: Array<number> = [];
    const averageValues: Array<number> = [];
    for (let point of points) {
        timestampValues.push(point.start_time);
        minValues.push(point.min_value);
        maxValues.push(point.max_value);
        averageValues.push(point.average_value);
        timestampValues.push(point.end_time);
        minValues.push(point.min_value);
        maxValues.push(point.max_value);
        averageValues.push(point.average_value);
    }
    return [timestampValues, averageValues, minValues, maxValues];
}

export function getCounterGraphFormat(points: Array<ProcessedCounterLogPoint>): AlignedData {
    const timestampValues: Array<number> = [];
    const values: Array<number> = [];
    for (let point of points) {
        timestampValues.push(point.start_time);
        values.push(point.value);
        timestampValues.push(point.end_time);
        values.push(point.value)
    }
    return [timestampValues, values];
}

export function createMeasurementGraph(graphContainer: HTMLElement, data: AlignedData, timeStep: FormattedTimeStep, logSpanPeriod: LogSpanPeriod): uPlot {
    let { width, height } = getGraphSize(graphContainer);
    const pxPerPoint = 40;
    const dataWidth = data[0].length * pxPerPoint;
    console.log(timeStep);
    if (dataWidth > width) width = dataWidth;
    const root = document.querySelector("body") as HTMLBodyElement;
    const rootFont = getComputedStyle(root).fontFamily;

    let opts: uPlot.Options = {
        width: width,
        height: height,
        scales: {
            x: {
                time: true,
            },
            y: {
                auto: true,
            }
        },
        series: [
            {}, // x-axis
            {
                // Average line
                label: "Average",
                stroke: "#4a90e2",
                width: 2,
                points: { show: false },
            },
            {
                // Min values (invisible, used for band)
                label: "Min",
                stroke: "transparent",
                width: 0,
                points: { show: false },
            },
            {
                // Max values (invisible, used for band)
                label: "Max",
                stroke: "transparent",
                width: 0,
                points: { show: false },
            }
        ],
        bands: [
            {
                series: [2, 3],
                fill: "rgba(74, 144, 226, 0.4)"
            }
        ],
        axes: [
            {
                // x-axis (time)
                values: (u, ticks) => ticks.map((t) => timeStepFormatters[timeStep](t, logSpanPeriod)),
                font: `12px ${rootFont}`,
                stroke: "white",
                grid: {
                    show: true,
                    stroke: "rgba(255, 255, 255, 0.06)",
                    width: 1,
                },
            },
            {
                // y-axis (values)
                font: `12px ${rootFont}`,
                stroke: "white",
                grid: {
                    show: true,
                    stroke: "rgba(255, 255, 255, 0.06)",
                    width: 1,
                },
            },
        ],
        cursor: {
            drag: { x: false, y: false },
            points: { show: false },
            focus: { prox: 0 },
        },
    };

    return new uPlot(opts, data, graphContainer);
}