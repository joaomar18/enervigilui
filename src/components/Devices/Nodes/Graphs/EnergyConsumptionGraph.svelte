<script lang="ts">
    import { EnergyConsumptionGraphObject } from "$lib/logic/view/graph/energyConsumption";
    import { BaseGraphObject } from "$lib/logic/view/graph/base";
    import { FormattedTimeStep } from "$lib/types/date";
    import { LogSpanPeriod } from "$lib/types/view/nodes";
    import { GraphType } from "$lib/logic/view/graph/base";
    import { getGraphStyle } from "$lib/logic/view/graph/helpers";
    import BaseGraph from "./BaseGraph.svelte";
    import FullScreenBaseGraph from "./FullScreenBaseGraph.svelte";
    import GraphToolTip from "./Tooltips/GraphToolTip.svelte";
    import EnergyConsToolTip from "./Tooltips/Data/EnergyConsToolTip.svelte";
    import type { EnergyConsumptionMetrics, ProcessedEnergyConsumptionLogPoint, BaseLogPoint, EnergyConsumptionLogPoint } from "$lib/types/nodes/logs";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { selectedLang } from "$lib/stores/lang/definition";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { BaseGraphStyle, GraphMetricStyle } from "$lib/style/graph";
    import { EnergyConsBaseGraphStyle } from "$lib/style/graph";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    export let metricsStyle: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $BaseGraphStyle;
    $: effectiveMetricStyle = metricsStyle ?? $GraphMetricStyle;

    // Props
    export let data: Array<ProcessedEnergyConsumptionLogPoint> | undefined;
    export let timeStep: FormattedTimeStep | null | undefined;
    export let fullScreen: boolean = false;
    export let showFullScreen: boolean = false; // Used externally on Full Screen Graph
    export let showDatePicker: boolean = false;
    export let goBackEnabled: boolean;
    export let selectedTimeSpan: LogSpanPeriod;
    export let initialDate: Date;
    export let endDate: Date;
    export let dataFetched: boolean;
    export let firstFetch: boolean;
    export let globalMetrics: EnergyConsumptionMetrics | undefined;
    export let activeEnergyUnit: string = "";
    export let reactiveEnergyUnit: string = "";
    export let activeEnergyDecimalPlaces: number | null = null;
    export let reactiveEnergyDecimalPlaces: number | null = null;
    export let powerFactorDecimalPlaces: number | null = null;

    // Merged style
    $: mergedStyle = effectiveStyle;

    // Variables
    let graphContainer: HTMLDivElement;
    let gridElement: HTMLDivElement | null = null;
    let graph: EnergyConsumptionGraphObject | null = null;
    let graphCreated: boolean = false;
    let activeEnergyNoData: boolean = true;
    let reactiveEnergyNoData: boolean = true;
    let insideGraph: boolean = false;
    let logPoint: EnergyConsumptionLogPoint | null = null;
    let cursorPos: { x: number | undefined; y: number | undefined };

    // Reactive Statements
    $: if (graphContainer) {
        requestAnimationFrame(() => {
            createGraphObject();
            console.log(graphContainer.getBoundingClientRect().height);
        });
    }

    $: if (graph && dataFetched && data && timeStep && $selectedLang) {
        updateGraphData();
    }

    // Functions
    function hoveredLogPointChange(currentLogPoint: EnergyConsumptionLogPoint | null): void {
        insideGraph = !!currentLogPoint;
        logPoint = currentLogPoint;
    }

    function mousePositionChange(xPos: number | undefined, yPos: number | undefined): void {
        cursorPos = { x: xPos, y: yPos };
    }

    function gridDoubleClick(startTime: Date, endTime: Date): void {
        getNewTimeSpan(startTime, endTime);
    }

    function createGraphObject(): void {
        if (graph) graph.destroy();
        requestAnimationFrame(() => {
            mergedStyle = effectiveStyle;
            graph = new EnergyConsumptionGraphObject(
                graphContainer,
                hoveredLogPointChange,
                mousePositionChange,
                gridDoubleClick,
                data ? (data as ProcessedEnergyConsumptionLogPoint[]) : undefined,
            );
            Object.assign(mergedStyle, getGraphStyle(GraphType.EnergyConsumption));
        });
    }

    function updateGraphData(): void {
        if (graph && data && timeStep) {
            graph.destroy();
            graph.updatePoints(data, true, { activeEnergyDecimalPlaces, reactiveEnergyDecimalPlaces, powerFactorDecimalPlaces });
            graph.createGraph(timeStep, selectedTimeSpan, mergedStyle);
            gridElement = graph.getGridElement();
            graphCreated = true;
            activeEnergyNoData = !graph.hasActiveEnergyData();
            reactiveEnergyNoData = !graph.hasReactiveEnergyData();
        }
    }

    // Export Functions
    export let getNewTimeSpan: (startTime: Date, endTime: Date) => void;
    export let getNewDefaultTimeSpan: (timeSpan: LogSpanPeriod) => void;
    export let goBack: () => void;
</script>

<BaseGraph
    style={$EnergyConsBaseGraphStyle}
    data={undefined}
    {timeStep}
    bind:showFullScreen
    bind:showDatePicker
    graphType={GraphType.EnergyConsumption}
    bind:initialDate
    bind:endDate
    {dataFetched}
    {firstFetch}
    {globalMetrics}
    bind:selectedTimeSpan
    {goBackEnabled}
    {goBack}
    {getNewTimeSpan}
    {getNewDefaultTimeSpan}
    useExternalGraph={true}
    useHeader={false}
    externalGraph={graph as BaseGraphObject<BaseLogPoint>}
    externalGraphContainer={graphContainer}
>
    <div slot="full-screen">
        {#if !fullScreen && showFullScreen}
            <FullScreenBaseGraph
                {data}
                {timeStep}
                bind:show={showFullScreen}
                graphType={GraphType.EnergyConsumption}
                {dataFetched}
                {firstFetch}
                {globalMetrics}
                bind:initialDate
                bind:endDate
                bind:selectedTimeSpan
                {goBackEnabled}
                {goBack}
                {getNewTimeSpan}
                {getNewDefaultTimeSpan}
            />
        {/if}
    </div>
    <div slot="metrics"></div>
    <div slot="graph" class="graph-main">
        <div class="unit-div">
            <div class="unit-content">
                <div class="unit-wrapper">
                    {#if graphCreated && !activeEnergyNoData}
                        <span class="unit-label">{activeEnergyUnit} | {reactiveEnergyUnit}</span>
                    {/if}
                </div>
            </div>
        </div>
        <div class="graph-div" bind:this={graphContainer}>
            <div class="y-axis-inner-div">
                <div class="y-axis-inner-content">
                    {#if graphCreated && activeEnergyNoData}
                        <span class="no-data-label">{$texts.noDataAvailable}</span>
                    {/if}
                </div>
            </div>
            {#if gridElement}
                <GraphToolTip {gridElement} {insideGraph} {cursorPos}>
                    <EnergyConsToolTip {logPoint} {activeEnergyUnit} {reactiveEnergyUnit} />
                </GraphToolTip>
            {/if}
        </div>
    </div>
</BaseGraph>

<style>
    /* Unit label section - Left sidebar for measurement unit display */
    .unit-div {
        width: var(--unit-div-width);
        height: var(--graph-height);
    }

    /* Unit content container - Sized to match graph plotting area */
    .unit-content {
        width: 100%;
        height: calc(100% - var(--graph-padding-top) - var(--graph-padding-bottom) - var(--x-axis-height));
        padding-top: var(--graph-padding-top);
        padding-bottom: calc(var(--x-axis-height) + var(--graph-padding-bottom));
    }

    /* Unit wrapper - Relative container for absolutely positioned unit label */
    .unit-wrapper {
        padding: 0;
        margin: 0;
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* Unit label text - Vertically rotated measurement unit (e.g., "kW", "A") */
    .unit-label {
        position: absolute;
        top: 50%;
        left: 50%;
        color: var(--sub-text-color);
        font-weight: var(--sub-text-weight);
        font-size: 13px;
        letter-spacing: 0.5px;
        text-align: center;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        max-width: var(--unit-max-width);
        transform: translate(-50%, -50%) rotate(-90deg);
    }

    /* Graph main content - Horizontal flex container with styled scrollbar for graph overflow */
    .graph-main {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        overflow-x: scroll;
        overflow-y: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-track-color) var(--scrollbar-thumb-color);
        scrollbar-gutter: stable;
    }

    /* Graph container - Main plotting area where uPlot charts are rendered */
    .graph-div {
        padding: 0;
        margin: 0;
        position: relative;
        width: calc(100% - var(--unit-div-width));
        height: var(--graph-height);
    }

    /* Y-axis overlay area - Positioned over uPlot's y-axis for custom content */
    .y-axis-inner-div {
        position: absolute;
        left: 0;
        top: 0;
        width: var(--y-axis-width);
        height: calc(var(--graph-height) - var(--graph-padding-top) - var(--graph-padding-bottom) - var(--x-axis-height));
        padding-top: var(--graph-padding-top);
        padding-bottom: calc(var(--x-axis-height) + var(--graph-padding-bottom));
    }

    /* Y-axis content wrapper - Container for y-axis overlay elements */
    .y-axis-inner-content {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        position: relative;
    }

    /* No-data indicator - Rotated text displayed when graph has no data */
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
