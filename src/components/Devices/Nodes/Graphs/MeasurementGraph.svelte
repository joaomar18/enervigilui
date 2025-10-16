<script lang="ts">
    import { onDestroy } from "svelte";
    import { getMeasurementGraphFormat, createMeasurementGraph } from "$lib/logic/view/graph";
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
    export let paddingBottom: string | undefined = "10px";
    export let backgroundColor: string | undefined = "rgba(20, 22, 28, 0.6)";
    export let borderColor: string | undefined = "rgba(255, 255, 255, 0.08)";
    export let boxShadow: string | undefined = "0 2px 4px rgba(0, 0, 0, 0.1)";
    export let plotBackgroundColor: string | undefined = "rgba(0,0,0,0)";

    export let scrollbarTrackColor: string | undefined = undefined;
    export let scrollbarThumbColor: string | undefined = undefined;

    // Variables
    let graphContainer: HTMLDivElement;
    let graph: uPlot;

    // Reactive Statements
    $: if (data && graphContainer) {
        destroyGraph(graph);
        let graphData = getMeasurementGraphFormat(data);
        graph = createMeasurementGraph(graphContainer, graphData, timeStep, logSpanPeriod);
    }

    // Functions

    function destroyGraph(graph: uPlot) {
        if (graph) {
            graph.destroy();
        }
    }

    onDestroy(() => {
        destroyGraph(graph);
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
    "
    class="graph-div-wrapper"
>
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
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-track-color) var(--scrollbar-thumb-color);
        scrollbar-gutter: stable;
    }

    .graph-div {
        padding: 0;
        margin: 0;
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* uPlot canvas styling */
    .graph-div :global(canvas) {
        display: block;
    }

    /* Inner plot background (area where series are drawn) */
    .graph-div :global(.u-under) {
        background: var(--plot-background-color);
    }

    .graph-div :global(.u-axis) {
        color: white;
    }
</style>
