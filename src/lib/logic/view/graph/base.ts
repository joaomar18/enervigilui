import uPlot from "uplot";
import { FormattedTimeStep } from "$lib/types/date";
import { LogSpanPeriod } from "$lib/types/view/nodes";
import type { BaseLogPoint } from "$lib/types/nodes/logs";

/**
 * Graph visualization types for different data representations.
 */
export enum GraphType {
    Measurement = "Measurement",
    Counter = "Counter",
}

/**
 * Abstract base class for graph objects that manage uPlot chart instances.
 * 
 * Provides common functionality for graph visualization including cursor tracking,
 * hover detection, callback management, and lifecycle operations. Serves as the
 * foundation for specialized graph types like MeasurementGraph.
 * 
 * @template T - The log point type extending BaseLogPoint
 * 
 * @property {GraphType} graphType - Identifies the specific graph implementation
 * @property {HTMLElement} container - DOM element that hosts the graph
 * @property {uPlot} graph - The underlying uPlot chart instance
 * @property {HTMLDivElement} gridElement - Graph overlay element for interactions
 * @property {Array<string>} labels - Time axis labels for the current dataset
 * @property {boolean} noData - Indicates whether the graph has valid data
 * @property {number} xPos - Current mouse X position over the graph
 * @property {number} yPos - Current mouse Y position over the graph
 * @property {number} currentHoverPeriod - Index of currently hovered time period
 */
export abstract class BaseGraphObject<T extends BaseLogPoint> {
    protected abstract graphType: GraphType;
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
    protected gridDoubleClickCallback: ((startTime: Date, endTime: Date) => void) | null = null;

    constructor(container: HTMLElement, hoveredLogPointChange: ((logPoint: T | null) => void) | null, mousePositionChange: ((xPos: number | undefined, yPos: number | undefined) => void) | null, gridDoubleClick: ((startTime: Date, endTime: Date) => void) | null) {
        this.container = container;
        this.hoveredLogPointCallback = hoveredLogPointChange;
        this.mousePositionChangeCallback = mousePositionChange;
        this.gridDoubleClickCallback = gridDoubleClick;
    }

    // Abstract methods (subclasses must implement)
    
    /**
     * Creates and initializes the uPlot graph with specified time parameters and styling.
     */
    abstract createGraph(timeStep: FormattedTimeStep, logSpanPeriod: LogSpanPeriod, style: { [property: string]: string | number },): void;
    
    /**
     * Handles double-click events on the graph grid for interactive data drilling.
     */
    abstract processGridDoubleClick(): void;

    /**
     * Returns whether the graph has valid data to display.
     */
    hasData(): boolean {
        return !this.noData;
    }

    /**
     * Gets the graph type for component identification and styling.
     */
    getGraphType(): GraphType {
        return this.graphType;
    }

    /**
     * Returns the graph's interaction overlay element for tooltip positioning.
     */
    getGridElement(): HTMLDivElement | null {
        return this.gridElement;
    }

    destroy(): void {
        if (this.graph) {
            if (this.gridElement && this.gridDoubleClickCallback) {
                this.gridElement.removeEventListener("dblclick", () => this.processGridDoubleClick());
            }
            this.graph.destroy()
            this.graph = null;
            this.gridElement = null;
        }
    }
}

