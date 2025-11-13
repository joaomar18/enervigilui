<script lang="ts">
    import { BaseGraphObject } from "$lib/logic/view/graph/base";
    import { FormattedTimeStep } from "$lib/types/date";
    import { LogSpanPeriod } from "$lib/types/view/nodes";
    import { GraphType } from "$lib/logic/view/graph/base";
    import { getGraphStyle } from "$lib/logic/view/graph/helpers";
    import BaseGraph from "./BaseGraph.svelte";
    import FullScreenBaseGraph from "./FullScreenBaseGraph.svelte";
    import GraphToolTip from "./Tooltips/GraphToolTip.svelte";
    import type { EnergyConsumptionMetrics, EnergyConsumptionLogPoint, ProcessedEnergyConsumptionLogPoint } from "$lib/types/nodes/logs";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { selectedLang } from "$lib/stores/lang/definition";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { BaseGraphStyle, GraphMetricStyle } from "$lib/style/graph";
    import { EnergyConsumptionGraphObject } from "$lib/logic/view/graph/energyConsumption";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    export let metricsStyle: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $BaseGraphStyle;
    $: effectiveMetricStyle = metricsStyle ?? $GraphMetricStyle;

    // Props
    export let data: Array<ProcessedEnergyConsumptionLogPoint> | undefined;
    export let timeStep: FormattedTimeStep | null | undefined;
    export let logSpanPeriod: LogSpanPeriod;
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
    let baseGraphRef: BaseGraph;
    let graphContainer: HTMLDivElement;
    let gridElement: HTMLDivElement | null = null;
    let graph: EnergyConsumptionGraphObject | null = null;
    let graphCreated: boolean = false;
    let activeEnergyNoData: boolean = true;
    let reactiveEnergyNoData: boolean = true;

    // Reactive Statements
    $: if (graphContainer) {
        createGraphObject();
    }

    $: if (graph && dataFetched && data && timeStep && $selectedLang) {
        updateGraphData();
    }

    // Functions
    function createGraphObject(): void {
        if (graph) graph.destroy();
        requestAnimationFrame(() => {
            mergedStyle = effectiveStyle;
            new EnergyConsumptionGraphObject(
                graphContainer,
                baseGraphRef.hoveredLogPointChange,
                baseGraphRef.mousePositionChange,
                baseGraphRef.gridDoubleClick,
                data ? (data as ProcessedEnergyConsumptionLogPoint[]) : undefined,
            );
            Object.assign(mergedStyle, getGraphStyle(GraphType.EnergyConsumption));
        });
    }

    function updateGraphData(): void {
        if (graph && data && timeStep) {
            graph.destroy();
            graph.updatePoints(data, true, { activeEnergyDecimalPlaces, reactiveEnergyDecimalPlaces, powerFactorDecimalPlaces });
            graph.createGraph(timeStep, logSpanPeriod, mergedStyle);
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
    bind:this={baseGraphRef}
    data={undefined}
    {timeStep}
    {logSpanPeriod}
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
    externalGraph={graph}
    externalGraphContainer={graphContainer}
>
    <div slot="full-screen">
        {#if !fullScreen && showFullScreen}
            <FullScreenBaseGraph
                {data}
                {timeStep}
                {logSpanPeriod}
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
    <div slot="graph">
        <div class="unit-div">
            <div class="unit-content">
                <div class="unit-wrapper">
                    {#if graphCreated && !activeEnergyNoData}
                        <span class="unit-label">{activeEnergyUnit}</span>
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
                <!--<GraphToolTip {gridElement} {insideGraph} {cursorPos}></GraphToolTip>-->
            {/if}
            <div class="y-axis-inner-div">
                <div class="y-axis-inner-content">
                    {#if graphCreated && reactiveEnergyNoData}
                        <span class="no-data-label">{$texts.noDataAvailable}</span>
                    {/if}
                </div>
            </div>
        </div>
        <div class="unit-div">
            <div class="unit-content">
                <div class="unit-wrapper">
                    {#if graphCreated && !reactiveEnergyNoData}
                        <span class="unit-label">{reactiveEnergyUnit}</span>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</BaseGraph>

<style>
</style>
