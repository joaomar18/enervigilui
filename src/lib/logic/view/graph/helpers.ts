import uPlot from "uplot";
import type { AlignedData } from "uplot";
import { GraphType } from "./base";
import type { SvelteComponent } from "svelte";
import MeasurementToolTip from "../../../../components/Devices/Nodes/Graphs/MeasurementToolTip.svelte";
import CounterToolTip from "../../../../components/Devices/Nodes/Graphs/CounterToolTip.svelte";

/**
 * Extracts period start timestamps from aligned data for x-axis splits.
 * Filters even-indexed timestamps since data contains start/end pairs.
 * 
 * @param data - Aligned data array where data[0] contains timestamps
 * @returns Array of period start timestamps
 */
export function getGraphTimeSplits(data: AlignedData): Array<number> {
    const timestamps = data[0] as number[];
    const startsOnly = timestamps.filter((_, i) => i % 2 === 0);
    return startsOnly;
}

/**
 * Calculates graph dimensions based on container, data, and styling.
 * Width includes data width plus y-axis and padding; height from container.
 * 
 * @param graphContainer - Container element for height measurement
 * @param pxPerPeriod - Pixels per time period for width calculation
 * @param alignedData - Graph data for period count
 * @param style - Style object containing axis and padding dimensions
 * @returns Object with calculated width and height
 */
export function getGraphSize(graphContainer: HTMLElement, pxPerPeriod: number, alignedData: AlignedData, style: { [property: string]: string | number }): { width: number; height: number } {
    let width = 0;
    let height = 0;
    if (graphContainer) {
        const containerRect = graphContainer.getBoundingClientRect();
        height = containerRect.height;
    }
    const dataWidth = (getGraphTimeSplits(alignedData).length - 1) * pxPerPeriod;
    width = dataWidth + parseInt(String(style.yAxisWidth)) + parseInt(String(style.graphPaddingLeft)) + parseInt(String(style.graphPaddingRight));

    return { width, height };
}

/**
 * Creates a y-axis formatter that trims trailing zeros and removes duplicate labels.
 * Returns a function for uPlot to format y-axis tick values cleanly.
 * 
 * @returns Formatter function that takes uPlot instance and splits, returns formatted labels
 */
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

/**
 * Returns the appropriate tooltip component for the given graph type.
 * 
 * @param graphType - The type of graph
 * @returns Svelte component constructor for the tooltip
 */
export function getGraphToolTipDisplayComponent(graphType: GraphType): typeof SvelteComponent<any> {
    switch (graphType) {
        case GraphType.Measurement:
            return MeasurementToolTip;
        case GraphType.Counter:
            return CounterToolTip;
    }
}