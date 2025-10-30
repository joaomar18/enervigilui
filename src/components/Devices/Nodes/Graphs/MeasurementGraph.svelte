<script lang="ts">
    import { onDestroy } from "svelte";
    import { MeasurementGraphObject } from "$lib/logic/view/graph/measurement";
    import type { MeasurementMetrics, MeasurementLogPoint, ProcessedMeasurementLogPoint } from "$lib/types/nodes/logs";
    import type { FormattedTimeStep } from "$lib/types/date";
    import type { LogSpanPeriod } from "$lib/types/view/nodes";
    import BaseGraph from "./BaseGraph.svelte";

    // Texts
    import { selectedLang } from "$lib/stores/lang/definition";

    // Styles
    import { MeasurementGraphStyle, BaseGraphStyle } from "$lib/style/graph";
    import type { GraphType } from "$lib/logic/view/graph/base";
    import MeasurementMetricsComponent from "../Metrics/MeasurementMetrics.svelte";

    // Style object (from theme)
    export let baseStyle: { [property: string]: string | number } | null = null;
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveBaseStyle = baseStyle ?? $BaseGraphStyle;
    $: effectiveStyle = style ?? $MeasurementGraphStyle;

    // Props
    export let goBackEnabled: boolean = true;
    export let initialDate: Date;
    export let endDate: Date;
    export let data: Array<ProcessedMeasurementLogPoint>;
    export let dataFetched: boolean;
    export let firstFetch: boolean;
    export let timeStep: FormattedTimeStep;
    export let logSpanPeriod: LogSpanPeriod;
    export let globalMetrics: MeasurementMetrics;
    export let unit: string = "";
    export let decimalPlaces: number | null = null;

    // Layout / styling props
    export let height: string | undefined = undefined;

    // Merged style
    $: mergedStyle = Object.assign(effectiveBaseStyle, effectiveStyle);

    // Variables
    let cursorPos: { x: number | undefined; y: number | undefined } = { x: undefined, y: undefined };
    let graphContainer: HTMLDivElement;
    let graph: MeasurementGraphObject;
    let gridElement: HTMLDivElement | null = null;
    let graphType: GraphType;
    let created: boolean = false;
    let noData: boolean = true;
    let insideGraph: boolean = false;
    let currentLogPoint: MeasurementLogPoint | null = null;

    // Reactive Statements
    $: if (graphContainer) {
        createGraphObject();
    }

    $: if (graph && data && $selectedLang) {
        updateGraphData();
    }

    // Export Functions
    export let getNewTimeSpan: (startTime: Date, endTime: Date) => void;
    export let goBack: () => void;

    // Functions
    function createGraphObject(): void {
        graph = new MeasurementGraphObject(graphContainer, hoveredLogPointChange, mousePositionChange, gridDoubleClick, data);
        graphType = graph.getGraphType();
    }

    function hoveredLogPointChange(logPoint: MeasurementLogPoint | null): void {
        insideGraph = !!logPoint;
        currentLogPoint = logPoint;
    }

    function mousePositionChange(xPos: number | undefined, yPos: number | undefined): void {
        cursorPos = { x: xPos, y: yPos };
    }

    function gridDoubleClick(startTime: Date, endTime: Date): void {
        getNewTimeSpan(startTime, endTime);
    }

    function updateGraphData(): void {
        graph.destroy();
        graph.updatePoints(data, decimalPlaces);
        graph.createGraph(timeStep, logSpanPeriod, mergedStyle);
        gridElement = graph.getGridElement();
        created = true;
        noData = !graph.hasData();
    }

    onDestroy(() => {
        if (graph) {
            graph.destroy();
        }
    });
</script>

<!--
    MeasurementGraph Component
    
    A specialized graph component for displaying measurement data with min/max/average visualization.
    Features uPlot integration with custom band rendering, real-time cursor tracking, and interactive
    data drilling functionality. Handles time-series data processing, dynamic graph creation based on
    time steps, and provides measurement-specific tooltip integration. Supports comprehensive styling
    through BaseGraph inheritance and measurement-specific theming for industrial data visualization.
-->
<BaseGraph
    {gridElement}
    {graphType}
    {insideGraph}
    {cursorPos}
    {height}
    bind:graphContainer
    {initialDate}
    {endDate}
    graphCreated={created}
    {dataFetched}
    {firstFetch}
    graphNoData={noData}
    logPoint={currentLogPoint}
    {unit}
    {goBackEnabled}
    {goBack}
>
    <div slot="metrics" class="metrics-div">
        {#if globalMetrics}
            <MeasurementMetricsComponent labelWidth="125px" metrics={globalMetrics} {unit} {decimalPlaces} {dataFetched} {firstFetch} />
        {/if}
    </div>
</BaseGraph>
