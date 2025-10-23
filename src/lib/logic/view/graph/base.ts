import uPlot from "uplot";
import { FormattedTimeStep } from "$lib/types/date";
import { LogSpanPeriod } from "$lib/types/view/nodes";
import type { BaseLogPoint } from "$lib/types/nodes/logs";

export abstract class BaseGraphObject<T extends BaseLogPoint> {
    protected abstract graphType: string;
    protected currentHoverPeriod: number = -1;
    protected container: HTMLElement;
    protected graph: uPlot | null = null;
    protected gridElement: HTMLDivElement | null = null;
    protected labels: Array<string> = [];
    protected noData: boolean = true;
    protected xPos: number | undefined = undefined;
    protected yPos: number | undefined = undefined;
    protected hoveredLogPointCallback: ((logPoint: T | null) => void) | null = null;
    protected mousePositionChangeCallback: ((xPos: number | undefined, yPos: number | undefined) => void) | null = null;

    constructor(container: HTMLElement, hoveredLogPointChange: ((logPoint: T | null) => void) | null, mousePositionChange: ((xPos: number | undefined, yPos: number | undefined) => void) | null) {
        this.container = container;
        this.hoveredLogPointCallback = hoveredLogPointChange;
        this.mousePositionChangeCallback = mousePositionChange;
    }

    // Abstract methods (subclasses must implement)
    abstract createGraph(timeStep: FormattedTimeStep, logSpanPeriod: LogSpanPeriod, style: { [property: string]: string | number },): void;

    hasData(): boolean {
        return !this.noData;
    }

    getGridElement(): HTMLDivElement | null {
        return this.gridElement;
    }

    destroy(): void {
        if (this.graph) {
            this.graph.destroy()
            this.graph = null;
            this.gridElement = null;
        }
    }
}

