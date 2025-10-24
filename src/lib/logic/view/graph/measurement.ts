import uPlot, { type AlignedData } from "uplot";
import { getRootFontFamily } from "$lib/logic/util/style";
import { getGraphSize, getGraphTimeSplits, yAxisValuesFormatter } from "./helpers";
import { BaseGraphObject, GraphType } from "./base";
import { FormattedTimeStep } from "$lib/types/date";
import { LogSpanPeriod } from "$lib/types/view/nodes";
import { timeStepFormatters } from "$lib/types/date";
import { getElegantShortStringFromDate } from "$lib/logic/util/date";
import type { MeasurementLogPoint, ProcessedMeasurementLogPoint } from "$lib/types/nodes/logs";


export class MeasurementGraphObject extends BaseGraphObject<MeasurementLogPoint> {
    protected graphType = GraphType.Measurement;
    protected points: Array<ProcessedMeasurementLogPoint>;
    public hoveredLogPoint: MeasurementLogPoint | null = null;

    constructor(container: HTMLElement, hoveredLogPointChange: ((logPoint: MeasurementLogPoint | null) => void) | null, mousePositionChange: ((xPos: number | undefined, yPos: number | undefined) => void) | null, points: Array<ProcessedMeasurementLogPoint>) {
        super(container, hoveredLogPointChange, mousePositionChange);
        this.points = points;
    }

    updatePoints(points: Array<ProcessedMeasurementLogPoint>): void {
        this.points = points;
    }

    createGraph(timeStep: FormattedTimeStep, logSpanPeriod: LogSpanPeriod, style: { [property: string]: string | number },): void {
        const { alignedData } = this.convertDataToGraph(timeStep, logSpanPeriod);
        let { width, height } = getGraphSize(this.container, Number(style.graphPeriodWidthPx), alignedData, style);

        let opts: uPlot.Options = {
            width: width,
            height: height,
            padding: [parseInt(String(style.graphPaddingTop)), parseInt(String(style.graphPaddingRight)), parseInt(String(style.graphPaddingBottom)), parseInt(String(style.graphPaddingLeft))],
            scales: {
                x: {
                    time: true,
                },
                y: {
                    auto: true,
                },
            },
            legend: {
                show: false,
            },
            series: [
                {}, // x-axis
                {
                    label: "Average",
                    stroke: "transparent",
                    width: 0,
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
                },
            ],
            axes: [
                {
                    // x-axis (time)
                    splits: () => getGraphTimeSplits(alignedData),
                    values: () => this.labels,
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
                    values: (u, splits) => this.noData ? splits.map(() => "") : yAxisValuesFormatter()(u, splits),
                    size: parseInt(String(style.yAxisWidth)),
                    font: `13px ${getRootFontFamily()}`,
                    stroke: `${style.graphTextColor}`,
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
                        this.getCursorPosition(u);
                        this.getHoveredPeriod(u, timeStep);
                    },
                ],
                draw: [
                    (u) => {
                        this.drawCanvas(u, style);
                    },
                ],
            },
        };

        this.graph = new uPlot(opts, alignedData, this.container);
        this.gridElement = this.graph.over;
    }

    convertDataToGraph(timeStep: FormattedTimeStep, logSpanPeriod: LogSpanPeriod): { alignedData: AlignedData } {
        const timestampValues: Array<number> = [];
        const minValues: Array<number> = [];
        const maxValues: Array<number> = [];
        const averageValues: Array<number> = [];
        this.labels = [];
        this.noData = true;

        for (let i = 0; i < this.points.length; i++) {
            timestampValues.push(i);
            timestampValues.push(i + 1);

            if (this.points[i].min_value !== null || this.points[i].max_value !== null || this.points[i].average_value !== null) {
                this.noData = false;
            }

            minValues.push(this.points[i].min_value);
            maxValues.push(this.points[i].max_value);
            averageValues.push(this.points[i].average_value);
            minValues.push(this.points[i].min_value);
            maxValues.push(this.points[i].max_value);
            averageValues.push(this.points[i].average_value);

            this.labels.push(timeStepFormatters[timeStep](this.points[i].start_time, logSpanPeriod));

            if (i === this.points.length - 1) {
                timestampValues.push(i + 1);
                minValues.push(this.points[i].min_value);
                maxValues.push(this.points[i].max_value);
                averageValues.push(this.points[i].average_value);
                this.labels.push(timeStepFormatters[timeStep](this.points[i].end_time, logSpanPeriod));
            }
        }

        // Dummy data so the axis are allways properly formatted
        if (this.noData) {
            minValues[0] = 0;
            maxValues[0] = 0;
            averageValues[0] = 0;
        }

        return { alignedData: [timestampValues, averageValues, minValues, maxValues] };
    }

    getCursorPosition(u: uPlot): void {
        this.xPos = u.cursor.left;
        this.yPos = u.cursor.top;
        if (this.mousePositionChangeCallback) {
            this.mousePositionChangeCallback(this.xPos, this.yPos);
        }
    }

    getHoveredPeriod(u: uPlot, timeStep: FormattedTimeStep): void {
        if (this.xPos !== undefined && this.xPos >= 0) { // Valid Cursor position
            const xVal = u.posToVal(this.xPos, "x");
            const hoverPeriod = Math.floor(xVal);

            if (hoverPeriod >= 0 && hoverPeriod < this.points.length) {
                if (this.currentHoverPeriod !== hoverPeriod) {
                    this.currentHoverPeriod = hoverPeriod;
                    this.hoveredLogPoint = this.getHoveredLogPoint(this.currentHoverPeriod, timeStep);
                    if (this.hoveredLogPointCallback) {
                        this.hoveredLogPointCallback(this.hoveredLogPoint);
                    }
                    u.redraw();
                }
            }
        } else { // Cursor outside Graph
            if (this.currentHoverPeriod !== -1) {
                this.currentHoverPeriod = -1;
                this.hoveredLogPoint = this.getHoveredLogPoint(this.currentHoverPeriod, timeStep);
                if (this.hoveredLogPointCallback) {
                    this.hoveredLogPointCallback(this.hoveredLogPoint);
                }
                u.redraw();
            }
        }
    }

    getHoveredLogPoint(index: number, timeStep: FormattedTimeStep): MeasurementLogPoint | null {
        if (index < 0 || index >= this.points.length) {
            return null;
        }
        return {
            start_time: getElegantShortStringFromDate(new Date(this.points[index].start_time * 1000), timeStep),
            end_time: getElegantShortStringFromDate(new Date(this.points[index].end_time * 1000), timeStep),
            min_value: this.points[index].min_value,
            max_value: this.points[index].max_value,
            average_value: this.points[index].average_value,
        } as MeasurementLogPoint;
    }

    getAverageLine(xStart: number, xEnd: number, y: number): Path2D {
        if (!this.graph) {
            throw new Error(`Graph is not instantiated`);
        }
        const line = new Path2D();
        line.moveTo(xStart, y);
        line.lineTo(xEnd, y);

        return line;
    }

    drawCanvas(u: uPlot, style: { [property: string]: string | number }): void {
        const { ctx } = u;
        ctx.save();
        this.points.forEach((point, idx) => {
            if (point.min_value === null || point.max_value === null || point.average_value === null) {
                return;
            }
            const isHover = this.currentHoverPeriod === idx;

            ctx.lineWidth = Number(style.bandBorderWidthPx);
            const x1 = u.valToPos(idx, "x", true);
            const x2 = u.valToPos(idx + 1, "x", true);
            const yAverage = u.valToPos(point.average_value, "y", true);
            const yMin = u.valToPos(point.min_value, "y", true);
            const yMax = u.valToPos(point.max_value, "y", true);
            const width = x2 - x1;
            const height = yMin - yMax;

            // Min - Max Band
            ctx.fillStyle = isHover ? String(style.bandHoverColor) : String(style.bandColor);
            ctx.strokeStyle = isHover ? String(style.bandBorderHoverColor) : String(style.bandBorderColor);
            ctx.fillRect(x1, yMax, width, height);
            ctx.strokeRect(x1, yMax, width, height);

            // Average Line
            ctx.lineWidth = Number(style.lineWidthPx);
            ctx.strokeStyle = isHover ? String(style.lineHoverColor) : String(style.lineColor);
            const segmentLine = this.getAverageLine(x1, x2, yAverage);
            ctx.stroke(segmentLine);

        });
        ctx.restore();
    }
}