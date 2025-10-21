<script lang="ts">
    import { onDestroy } from "svelte";
    import { createMeasurementGraph } from "$lib/logic/view/graph";
    import uPlot from "uplot";
    import "uplot/dist/uPlot.min.css";
    import type { ProcessedMeasurementLogPoint } from "$lib/types/nodes/logs";
    import type { FormattedTimeStep } from "$lib/types/date";
    import type { LogSpanPeriod } from "$lib/types/view/nodes";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { MeasurementGraphStyle } from "$lib/style/nodes";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $MeasurementGraphStyle;

    // Props
    export let initialDateString: string;
    export let endDateString: string;
    export let data: Array<ProcessedMeasurementLogPoint>;
    export let timeStep: FormattedTimeStep;
    export let logSpanPeriod: LogSpanPeriod;
    export let unit: string = "";

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let headerHeight: string | undefined = undefined;
    export let headerRowHeight: string | undefined = undefined;
    export let xAxisHeight: string | undefined = undefined;
    export let yAxisWidth: string | undefined = undefined;
    export let yAxisLabelsWidth: string | undefined = undefined;
    export let yAxisRightMargin: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let paddingHorizontal: string | undefined = undefined;
    export let paddingTop: string | undefined = undefined;
    export let paddingBottom: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let boxShadow: string | undefined = undefined;
    export let mainTextColor: string | undefined = undefined;
    export let mainTextWeight: string | undefined = undefined;
    export let graphTextColor: string | undefined = undefined;
    export let graphTextWeight: string | undefined = undefined;
    export let subTextColor: string | undefined = undefined;
    export let subTextWeight: string | undefined = undefined;
    export let scrollbarTrackColor: string | undefined = undefined;
    export let scrollbarThumbColor: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        headerHeight,
        headerRowHeight,
        xAxisHeight,
        yAxisWidth,
        yAxisLabelsWidth,
        yAxisRightMargin,
        borderRadius,
        paddingHorizontal,
        paddingTop,
        paddingBottom,
        backgroundColor,
        borderColor,
        boxShadow,
        mainTextColor,
        mainTextWeight,
        graphTextColor,
        graphTextWeight,
        subTextColor,
        subTextWeight,
        scrollbarTrackColor,
        scrollbarThumbColor,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let graphContainer: HTMLDivElement;
    let graph: uPlot | null;

    // Reactive Statements
    $: if (data && graphContainer) {
        destroyGraph();
        ({ graph } = createMeasurementGraph(graphContainer, data, timeStep, logSpanPeriod, mergedStyle));
    }

    // Functions

    function destroyGraph() {
        if (graph) {
            graph.destroy();
            graph = null;
        }
    }

    onDestroy(() => {
        destroyGraph();
    });
</script>

<div
    style="
        --width: {mergedStyle.width};
        --height: {mergedStyle.height};
        --header-height: {mergedStyle.headerHeight};
        --header-row-height: {mergedStyle.headerRowHeight};
        --x-axis-height: {mergedStyle.xAxisHeight};
        --y-axis-width: {mergedStyle.yAxisWidth};
        --y-axis-labels-width: {mergedStyle.yAxisLabelsWidth};
        --y-axis-right-margin: {mergedStyle.yAxisRightMargin};
        --border-radius: {mergedStyle.borderRadius};
        --padding-horizontal: {mergedStyle.paddingHorizontal};
        --padding-top: {mergedStyle.paddingTop};
        --padding-bottom: {mergedStyle.paddingBottom};
        --background-color: {mergedStyle.backgroundColor};
        --border-color: {mergedStyle.borderColor};
        --box-shadow: {mergedStyle.boxShadow};
        --scrollbar-track-color: {mergedStyle.scrollbarTrackColor};
        --scrollbar-thumb-color: {mergedStyle.scrollbarThumbColor};
        --main-text-color: {mergedStyle.mainTextColor};
        --main-text-weight: {mergedStyle.mainTextWeight};
        --graph-text-color: {mergedStyle.graphTextColor};
        --graph-text-weight: {mergedStyle.graphTextWeight};
        --sub-text-color: {mergedStyle.subTextColor};
        --sub-text-weight: {mergedStyle.subTextWeight};
    "
    class="graph-div-wrapper"
>
    <div class="header">
        <div class="unit-div">
            {#if false}
                <span class="unit-label">{unit}</span>
            {/if}
        </div>
        <div class="header-content">
            <!--
            <div class="row">
                <div class="label-div">
                    <span class="label">De</span>
                </div>
                <div class="value-div">
                    <span class="value">{initialDateString}</span>
                </div>
            </div>
            <div class="row">
                <div class="label-div">
                    <span class="label">Até</span>
                </div>
                <div class="value-div">
                    <span class="value">{endDateString}</span>
                </div>
            </div>
            -->
        </div>
    </div>
    <div class="main">
        <!--
        <div class="y-axis-inner-div">
            <div class="y-axis-inner-content">
                {#if false}
                    <span class="no-data-label">{$texts.noDataAvailable}</span>
                {/if}
            </div>
        </div>
        -->
        <div class="graph-div" bind:this={graphContainer}></div>
    </div>
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
        height: fit-content;
        border-radius: var(--border-radius);
        background: var(--background-color);
        border: 1px solid var(--border-color);
        box-shadow: var(--box-shadow);
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }

    .header {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: var(--header-height);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header .unit-div {
        width: calc(var(--y-axis-width) + var(--y-axis-right-margin));
        height: 100%;
        display: flex;
        gap: var(--header-unit-gap);
        flex-direction: column;
        justify-content: end;
    }

    .unit-label {
        color: var(--sub-text-color);
        font-weight: var(--sub-text-weight);
        font-size: 13px;
        letter-spacing: 0.5px;
        text-align: right;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
        width: 100%;
        box-sizing: border-box;
        padding-bottom: 10px;
        padding-right: calc(var(--y-axis-right-margin) + ((var(--y-axis-labels-width) - var(--y-axis-width)) / 2));
    }

    .header .header-content {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        flex-wrap: wrap;
    }

    .row {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding-right: 10px;
        height: var(--header-row-height);
        justify-content: space-between;
        align-items: center;
    }

    .label-div {
        width: 50px;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    .label {
        font-size: 14px;
        font-weight: var(--sub-text-weight);
        color: var(--sub-text-color);
    }

    .value-div {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
    }

    .value {
        font-size: 14px;
        font-weight: var(--main-text-weight);
        color: var(--main-text-color);
    }

    .main {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: calc(100% - var(--header-height));
    }

    .graph-div {
        padding: 0;
        margin: 0;
        position: relative;
        width: 100%;
        height: var(--height);
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-track-color) var(--scrollbar-thumb-color);
        scrollbar-gutter: stable;
    }

    .y-axis-inner-div {
        /* 17 px padding top is the value the graphing value uses by default for the graph canvas*/
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: calc(100% - 17px - var(--x-axis-height));
        padding-top: 17px;
        padding-bottom: var(--x-axis-height);
    }

    .y-axis-inner-content {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        position: relative;
    }

    .no-data-label {
        position: absolute;
        top: 50%;
        left: 50%;
        color: var(--sub-text-color);
        font-weight: var(--sub-text-weight);
        font-size: 13px;
        letter-spacing: 0.5px;
        word-spacing: 0.15em;
        opacity: 0.7;
        text-align: center;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
        transform: translate(-50%, -50%) rotate(-90deg);
    }
</style>
