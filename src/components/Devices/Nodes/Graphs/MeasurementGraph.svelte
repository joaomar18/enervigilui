<script lang="ts">
    import { onDestroy } from "svelte";
    import { createMeasurementGraph } from "$lib/logic/view/graph";
    import uPlot from "uplot";
    import "uplot/dist/uPlot.min.css";
    import type { ProcessedMeasurementLogPoint } from "$lib/types/nodes/logs";
    import type { FormattedTimeStep } from "$lib/types/date";
    import type { LogSpanPeriod } from "$lib/types/view/nodes";

    //Props
    export let data: Array<ProcessedMeasurementLogPoint>;
    export let timeStep: FormattedTimeStep;
    export let logSpanPeriod: LogSpanPeriod;
    export let unit: string = "";

    // Layout / styling props
    export let width: string | undefined = "100%";
    export let height: string | undefined = "450px";
    export let borderRadius: string | undefined = "10px";
    export let paddingHorizontal: string | undefined = "15px";
    export let paddingTop: string | undefined = "40px";
    export let paddingBottom: string | undefined = "0px";
    export let backgroundColor: string | undefined = "rgba(20, 22, 28, 0.6)";
    export let borderColor: string | undefined = "rgba(255, 255, 255, 0.08)";
    export let boxShadow: string | undefined = "0 2px 4px rgba(0, 0, 0, 0.1)";
    export let plotBackgroundColor: string | undefined = "rgba(0,0,0,0)";
    export let textColor: string | undefined = "rgba(255, 255, 255, 0.9)";
    export let textWeight: string | undefined = "500";
    export let subTextColor: string | undefined = "rgba(255, 255, 255, 0.5)";
    export let subTextWeight: string | undefined = "400";

    export let scrollbarTrackColor: string | undefined = undefined;
    export let scrollbarThumbColor: string | undefined = undefined;

    // Variables
    let yAxisContainer: HTMLDivElement;
    let graphContainer: HTMLDivElement;
    let yAxis: uPlot | null;
    let graph: uPlot | null;

    // Reactive Statements
    $: if (data && graphContainer) {
        destroyGraph();
        ({ yAxis, graph } = createMeasurementGraph(graphContainer, yAxisContainer, data, timeStep, logSpanPeriod));
    }

    // Functions

    function destroyGraph() {
        if (graph) {
            graph.destroy();
            graph = null;
        }
        if (yAxis) {
            yAxis.destroy();
            yAxis = null;
        }
    }

    onDestroy(() => {
        destroyGraph();
    });
</script>

<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --padding-horizontal: {paddingHorizontal};
        --padding-top: {paddingTop};
        --padding-bottom: {paddingBottom};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --box-shadow: {boxShadow};
        --plot-background-color: {plotBackgroundColor};
        --scrollbar-track-color: {scrollbarTrackColor};
        --scrollbar-thumb-color: {scrollbarThumbColor};
        --text-color: {textColor};
        --text-weight: {textWeight};
        --sub-text-color: {subTextColor};
        --sub-text-weight: {subTextWeight};
    "
    class="graph-div-wrapper"
>
    <div class="y-axis-div" bind:this={yAxisContainer}>
        {#if yAxis === null && graph !== null}
            <span class="no-data-label">No data available</span>
        {/if}
    </div>
    <div class="graph-div" bind:this={graphContainer}></div>
</div>

<style>
    .graph-div-wrapper {
        box-sizing: border-box;
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        margin: 0;
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        background: var(--background-color);
        border: 1px solid var(--border-color);
        box-shadow: var(--box-shadow);
        display: flex;
    }

    .y-axis-div {
        padding: 0;
        margin: 0;
        position: relative;
        height: 100%;
        width: 50px;
        overflow: hidden;
    }

    .graph-div {
        padding: 0;
        margin: 0;
        position: relative;
        width: calc(100% - 50px);
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-track-color) var(--scrollbar-thumb-color);
        scrollbar-gutter: stable;
    }

    .no-data-label {
        position: absolute;
        top: 50%;
        left: 50%;
        color: var(--sub-text-color);
        font-weight: var(--sub-text-weight);
        font-size: 14px;
        text-align: center;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
        transform: translate(calc(-50% + 10px), calc(-50% - 25px)) rotate(-90deg);
    }
</style>
