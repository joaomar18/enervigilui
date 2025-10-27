import uPlot, { type AlignedData } from "uplot";
import { getRootFontFamily } from "$lib/logic/util/style";
import { getGraphSize, getGraphTimeSplits, yAxisValuesFormatter } from "./helpers";
import { BaseGraphObject, GraphType } from "./base";
import { FormattedTimeStep } from "$lib/types/date";
import { LogSpanPeriod } from "$lib/types/view/nodes";
import { timeStepFormatters } from "$lib/types/date";
import { getElegantShortStringFromDate } from "$lib/logic/util/date";
import type { CounterLogPoint, ProcessedCounterLogPoint } from "$lib/types/nodes/logs";

export class CounterGraphObject extends BaseGraphObject<CounterLogPoint> {
    protected graphType = GraphType.Counter;
    protected points: Array<ProcessedCounterLogPoint>;
    public hoveredLogPoint: CounterLogPoint | null = null;

    constructor(container: HTMLElement, hoveredLogPointChange: ((logPoint: CounterLogPoint | null) => void) | null, mousePositionChange: ((xPos: number | undefined, yPos: number | undefined) => void) | null, gridDoubleClick: ((startTime: Date, endTime: Date) => void) | null, points: Array<ProcessedCounterLogPoint>) {
        super(container, hoveredLogPointChange, mousePositionChange, gridDoubleClick);
        this.points = points;
    }

    updatePoints(points: Array<ProcessedCounterLogPoint>, decimalPlaces: number | null, roundPoints: boolean = false): void {
        if (decimalPlaces === null || !roundPoints) {
            this.points = points;
        }
        else {
            this.points = points.map(point => ({
                ...point,
                value: point.value === null ? null : Number(point.value.toFixed(decimalPlaces))
            }));
        }
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
                    label: "Total Bar",
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
        if (this.gridDoubleClickCallback) {
            this.gridElement.addEventListener("dblclick", () => this.processGridDoubleClick());
        }
    }

    convertDataToGraph(timeStep: FormattedTimeStep, logSpanPeriod: LogSpanPeriod): { alignedData: AlignedData } {
        const timestampValues: Array<number> = [];
        const values: Array<number | null> = [];
        this.labels = [];
        this.noData = true;

        for (let i = 0; i < this.points.length; i++) {
            timestampValues.push(i);
            timestampValues.push(i + 1);

            if (this.points[i].value !== null) {
                this.noData = false;
            }

            if (!i) values.push(0); // adjust scale
            values.push(this.points[i].value);
            values.push(this.points[i].value)

            this.labels.push(timeStepFormatters[timeStep](this.points[i].start_time, logSpanPeriod));

            if (i === this.points.length - 1) {
                timestampValues.push(i + 1);
                values.push(this.points[i].value);
                this.labels.push(timeStepFormatters[timeStep](this.points[i].end_time, logSpanPeriod));
            }
        }

        // Dummy data so the axis are allways properly formatted
        if (this.noData) {
            values[0] = 0;
        }

        return { alignedData: [timestampValues, values] };
    }

    /**
     * Tracks cursor position over the graph and triggers position change callbacks.
     */
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

    getHoveredLogPoint(index: number, timeStep: FormattedTimeStep): CounterLogPoint | null {
        if (!this.points || index < 0 || index >= this.points.length) return null;

        return {
            start_time: getElegantShortStringFromDate(new Date(this.points[index].start_time * 1000), timeStep),
            end_time: getElegantShortStringFromDate(new Date(this.points[index].end_time * 1000), timeStep),
            value: this.points[index].value,
        } as CounterLogPoint;
    }

    processGridDoubleClick(): void {
        if (!this.points || this.currentHoverPeriod < 0 || this.currentHoverPeriod >= this.points.length) return;

        const index = this.currentHoverPeriod;
        const noData = this.points[index].value === null;
        if (noData) return;

        if (this.gridDoubleClickCallback) {
            const startTime = new Date(this.points[index].start_time * 1000);
            const endTime = new Date(this.points[index].end_time * 1000);
            this.gridDoubleClickCallback(startTime, endTime);
        }
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
            if (point.value === null) {
                return;
            }
            const isHover = this.currentHoverPeriod === idx;

            ctx.lineWidth = Number(style.barBorderWidthPx);
            const x1 = u.valToPos(idx, "x", true);
            const x2 = u.valToPos(idx + 1, "x", true);
            const yMin = u.valToPos(0, "y", true);
            const yMax = u.valToPos(point.value, "y", true);
            const width = x2 - x1;
            const height = yMin - yMax;

            // Bar 
            ctx.fillStyle = isHover ? String(style.barHoverColor) : String(style.barColor);
            ctx.strokeStyle = isHover ? String(style.barBorderHoverColor) : String(style.barBorderColor);
            ctx.fillRect(x1, yMax, width, height);
            ctx.strokeRect(x1, yMax, width, height);
        });
        ctx.restore();
    }
}