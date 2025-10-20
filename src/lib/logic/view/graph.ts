import { timeStepFormatters } from "$lib/types/date";
import { getRootFontFamily } from "../util/style";
import type { FormattedTimeStep } from "$lib/types/date";
import type { ProcessedMeasurementLogPoint } from "$lib/types/nodes/logs";
import type { LogSpanPeriod } from "$lib/types/view/nodes";
import uPlot, { type AlignedData } from "uplot";

// Global variable to track hover state
let currentHoverPeriod: number = -1;

export function getYAxisSize(yAxisContainer: HTMLElement): { width: number; height: number } {
    let width = 0;
    let height = 0;
    if (yAxisContainer) {
        const containerRect = yAxisContainer.getBoundingClientRect();
        height = containerRect.height;
        width = containerRect.width;
    }

    return { width, height };
}

export function getGraphSize(graphContainer: HTMLElement, pxPerPeriod: number, alignedData: AlignedData, style: { [property: string]: string | number }): { width: number; height: number } {
    let width = 0;
    let height = 0;
    if (graphContainer) {
        const containerRect = graphContainer.getBoundingClientRect();
        height = containerRect.height;
    }
    const dataWidth = (getGraphTimeSplits(alignedData).length - 1) * pxPerPeriod;
    width = dataWidth + parseInt(String(style.yAxisRightMargin)) + 25;

    return { width, height };
}

export function getGraphTimeSplits(data: AlignedData): Array<number> {
    const timestamps = data[0] as number[];
    const startsOnly = timestamps.filter((_, i) => i % 2 === 0);
    return startsOnly;
}

export function getMeasurementGraphAverageLine(graph: uPlot, seriesIdx: number, idx0: number, idx1: number): Path2D {
    const line = new Path2D();
    const xData = graph.data[0] as number[];
    const yData = graph.data[seriesIdx] as Array<number | null>;

    let prevXPx: number | null = null;

    for (let i = idx0; i <= idx1; i++) {
        const yv = yData[i];
        const xv = xData[i];
        if (yv == null || xv == null) {
            prevXPx = null;
            continue;
        }

        const xPx = graph.valToPos(xv as number, "x", true);
        const yPx = graph.valToPos(yv as number, "y", true);

        if (prevXPx === null || Math.abs(xPx - prevXPx) < 1) {
            line.moveTo(xPx, yPx);
        } else {
            line.lineTo(xPx, yPx);
        }

        prevXPx = xPx;
    }

    return line;
}

export function getMeasurementGraphFormat(
    points: Array<ProcessedMeasurementLogPoint>,
    timeStep: FormattedTimeStep,
    logSpanPeriod: LogSpanPeriod
): { alignedData: AlignedData; labels: Array<string>, noData: boolean } {
    const timestampValues: Array<number> = [];
    const minValues: Array<number> = [];
    const maxValues: Array<number> = [];
    const averageValues: Array<number> = [];
    const labels: Array<string> = [];
    let noData: boolean = true;

    for (let i = 0; i < points.length; i++) {
        timestampValues.push(i);
        timestampValues.push(i + 1);

        if (points[i].min_value !== null || points[i].max_value !== null || points[i].average_value !== null) {
            noData = false;
        }

        minValues.push(points[i].min_value);
        maxValues.push(points[i].max_value);
        averageValues.push(points[i].average_value);

        minValues.push(points[i].min_value);
        maxValues.push(points[i].max_value);
        averageValues.push(points[i].average_value);

        labels.push(timeStepFormatters[timeStep](points[i].start_time, logSpanPeriod));

        if (i === points.length - 1) {
            timestampValues.push(i + 1);
            minValues.push(points[i].min_value);
            maxValues.push(points[i].max_value);
            averageValues.push(points[i].average_value);
            labels.push(timeStepFormatters[timeStep](points[i].end_time, logSpanPeriod));
        }
    }

    // Dummy data so the axis are allways properly formatted
    if (noData) {
        minValues[0] = 0;
        maxValues[0] = 0;
        averageValues[0] = 0;
    }

    return { alignedData: [timestampValues, averageValues, minValues, maxValues], labels, noData };
}

export function createMeasurementGraph(
    graphContainer: HTMLElement,
    yAxisContainer: HTMLElement,
    points: Array<ProcessedMeasurementLogPoint>,
    timeStep: FormattedTimeStep,
    logSpanPeriod: LogSpanPeriod,
    style: { [property: string]: string | number },
): { yAxis: uPlot | null; graph: uPlot } {

    const { alignedData, labels, noData } = getMeasurementGraphFormat(points, timeStep, logSpanPeriod);
    let { width, height } = getGraphSize(graphContainer, Number(style.graphPeriodWidthPx), alignedData, style);

    let opts: uPlot.Options = {
        width: width,
        height: height,
        scales: {
            x: {
                time: true,
            },
            y: {
                auto: true,
            },
        },
        series: [
            {}, // x-axis
            {
                // Average line
                label: "Average",
                stroke: String(style.graphAverageLineColor),
                width: Number(style.graphAverageLineWidthPx),
                points: { show: false },
                paths: (u, seriesIdx, idx0, idx1) => {
                    return { stroke: getMeasurementGraphAverageLine(u, seriesIdx, idx0, idx1) };
                },
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
            },
        ],
        axes: [
            {
                // x-axis (time)
                splits: () => getGraphTimeSplits(alignedData),
                values: () => labels,
                size: parseInt(String(style.xAxisHeight)),
                font: `13px ${getRootFontFamily()}`,
                stroke: `${style.graphTextColor}`,
                grid: {
                    show: true,
                    stroke: String(style.graphGridLineColor),
                    width: Number(style.graphGridWidthPx),
                },
            },
            {
                // y-axis (values)
                size: parseInt(String(style.yAxisWidth)),
                values: (u, splits) => splits.map(() => ""),
                space: Number(style.yAxisTickSpacingPx),
                grid: {
                    show: true,
                    stroke: String(style.graphGridLineColor),
                    width: Number(style.graphGridWidthPx),
                },
            },
        ],
        cursor: {
            drag: { x: false, y: false },
            points: { show: false },
            focus: { prox: 0 },
        },
        hooks: {
            setCursor: [
                (u) => {
                    const left = u.cursor.left;
                    if (left != null && left >= 0) {
                        // Convert cursor position to data value
                        const xVal = u.posToVal(left, "x");
                        // Find which period we're hovering over
                        const hoverPeriod = Math.floor(xVal);
                        if (hoverPeriod >= 0 && hoverPeriod < points.length) {
                            if (currentHoverPeriod !== hoverPeriod) {
                                currentHoverPeriod = hoverPeriod;
                                u.redraw();
                            }
                        }
                    } else {
                        if (currentHoverPeriod !== -1) {
                            currentHoverPeriod = -1;
                            u.redraw();
                        }
                    }
                },
            ],
            draw: [
                (u) => {
                    const { ctx } = u;
                    ctx.save();
                    ctx.lineWidth = 1;

                    const hover = currentHoverPeriod;

                    points.forEach((point, idx) => {
                        if (point.min_value === null || point.max_value === null || point.average_value === null) {
                            return;
                        }
                        const x1 = u.valToPos(idx, "x", true);
                        const x2 = u.valToPos(idx + 1, "x", true);
                        const yMin = u.valToPos(point.min_value, "y", true);
                        const yMax = u.valToPos(point.max_value, "y", true);
                        const width = x2 - x1;
                        const height = yMin - yMax;
                        const isHover = hover === idx;
                        ctx.fillStyle = isHover ? "rgba(74, 144, 226, 0.25)" : "rgba(74, 144, 226, 0.15)";
                        ctx.strokeStyle = isHover ? "rgba(74, 144, 226, 0.3)" : "rgba(74, 144, 226, 0.2)";
                        ctx.fillRect(x1, yMax, width, height);
                        ctx.strokeRect(x1, yMax, width, height);
                    });
                    ctx.restore();
                },
            ],
        },
    };

    return { yAxis: createYAxisLabelsGraph(yAxisContainer, alignedData, noData, style), graph: new uPlot(opts, alignedData, graphContainer) };
}

export function createYAxisLabelsGraph(yAxisContainer: HTMLElement, alignedData: AlignedData, noData: boolean, style: { [property: string]: string | number }): uPlot | null {

    if (noData) {
        return null; // when there is no data doesn't create the y axis
    }
    let { width, height } = getYAxisSize(yAxisContainer);

    const opts: uPlot.Options = {
        width: width,
        height: height,
        scales: {
            x: { time: true },
            y: { auto: true },
        },
        series: [
            {},
            {
                label: "Average",
                points: { show: false },
                stroke: "transparent",
                width: 0,
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
            },
        ],
        axes: [
            {
                size: parseInt(String(style.xAxisHeight)),
            },
            {
                size: parseInt(String(style.yAxisLabelsWidth)),
                space: Number(style.yAxisTickSpacingPx),
                font: `13px ${getRootFontFamily()}`,
                stroke: `${style.graphTextColor}`,
                ticks: { show: true },
                grid: { show: false },
                values: yAxisValuesFormatter(),
            },
        ],
        cursor: { show: false },
    };

    return new uPlot(opts, alignedData, yAxisContainer);
}

export function yAxisValuesFormatter(): (u: uPlot, splits: number[]) => string[] {
    return (u: uPlot, splits: number[]): string[] => {
        const nums = (splits || []) as number[];
        if (nums.length === 0) return [];

        // Trim zeros
        const fmt = (v: number) => {
            let s = String(v);
            if (s.includes('.')) {
                while (s.endsWith('0')) s = s.slice(0, -1);
                if (s.endsWith('.')) s = s.slice(0, -1);
            }
            return s;
        };

        // Removes duplicates
        const out: string[] = [];
        let prev: string | null = null;
        for (let i = 0; i < nums.length; i++) {
            const label = fmt(nums[i]);
            if (label === prev) out.push("");
            else {
                out.push(label);
                prev = label;
            }
        }
        return out;
    };
}
