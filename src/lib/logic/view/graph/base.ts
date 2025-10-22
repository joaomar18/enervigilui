import uPlot from "uplot";
import { FormattedTimeStep } from "$lib/types/date";
import { LogSpanPeriod } from "$lib/types/view/nodes";

export abstract class BaseGraphObject {
    protected abstract graphType: string;
    protected currentHoverPeriod: number = -1;
    protected container: HTMLElement;
    protected graph: uPlot | null = null;
    protected labels: Array<string> = [];
    protected noData: boolean = true;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    // Abstract methods (subclasses must implement)
    abstract createGraph(timeStep: FormattedTimeStep, logSpanPeriod: LogSpanPeriod, style: { [property: string]: string | number },): void;

    hasData(): boolean {
        return !this.noData;
    }

    destroy(): void {
        if (this.graph) {
            this.graph.destroy()
            this.graph = null;
        }
    }
}

