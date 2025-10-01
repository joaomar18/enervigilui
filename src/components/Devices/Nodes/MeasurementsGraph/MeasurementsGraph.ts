import type { MeasurementLogPoint } from "$lib/types/nodes/base";
import { measurementPointsToUPlotData } from "$lib/logic/view/graph";
import uPlot from "uplot";

export function createMeasurementChart(chartDiv: HTMLDivElement, data: Array<MeasurementLogPoint>, startTimeMs: number, endTimeMs: number, timeStepMs: number) {

    const uplotData = measurementPointsToUPlotData(data, startTimeMs, endTimeMs, timeStepMs) as unknown as uPlot.AlignedData;
    const intervalsNumber = (endTimeMs - startTimeMs) / timeStepMs;
    const pxPerInterval = 50;
    const chartWidth = intervalsNumber * pxPerInterval;
    console.log(intervalsNumber, chartWidth);
    chartDiv.style.width = chartWidth + 'px';

    const opts: uPlot.Options = {
        width: chartWidth,
        height: 400,
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
                width: 3,
                points: { show: false },
                paths: uPlot.paths?.stepped ? uPlot.paths.stepped({ align: 1 }) : undefined
            },
            {
                // Min values (invisible, used for band)
                label: "Min",
                stroke: "transparent",
                width: 0,
                points: { show: false },
                paths: uPlot.paths?.stepped ? uPlot.paths.stepped({ align: 1 }) : undefined
            },
            {
                // Max values (invisible, used for band)
                label: "Max",
                stroke: "transparent",
                width: 0,
                points: { show: false },
                paths: uPlot.paths?.stepped ? uPlot.paths.stepped({ align: 1 }) : undefined
            }
        ],
        bands: [
            {
                // Min-Max band
                series: [2, 3],
                fill: "rgba(74, 144, 226, 0.4)"
            }
        ],
        axes: [
            {
                // Fixed 15-minute ticks across the full day with wider pixel spacing
                splits: (u: uPlot) => {
                    return u.data[0] as Array<number>;
                },
                values: (_u: uPlot, ticks: number[]) => ticks.map((t: number) => {
                    const date = new Date(t);
                    const hh = date.getHours().toString().padStart(2, '0');
                    const mm = date.getMinutes().toString().padStart(2, '0');
                    return `${hh}:${mm}`;
                }),
                grid: { show: true, stroke: '#e0e0e0' },
                ticks: { show: true, size: 10, width: 2, stroke: '#e0e0e0' },
                font: '400 13px system-ui',
                space: 55, // minimum spacing; lower than actual due to wide chart, but keeps logic consistent
            },
            {
                // Y-axis (no explicit label; styled via CSS or overlay elsewhere)
                values: (_u: uPlot, ticks: number[]) => ticks.map((v: number) => v.toFixed(1)),
                grid: { show: true, stroke: "#e0e0e0" }
            }
        ],
        cursor: {
            drag: { x: false, y: false },
            points: { show: false },
        },
    };

    const chart = new uPlot(opts, uplotData, chartDiv);

    return chart;
}
