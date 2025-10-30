<script lang="ts">
    import { onDestroy } from "svelte";
    import { CounterGraphObject } from "$lib/logic/view/graph/counter";
    import type { CounterMetrics, CounterLogPoint, ProcessedCounterLogPoint } from "$lib/types/nodes/logs";
    import type { FormattedTimeStep } from "$lib/types/date";
    import type { LogSpanPeriod } from "$lib/types/view/nodes";
    import BaseGraph from "./BaseGraph.svelte";

    // Texts
    import { selectedLang } from "$lib/stores/lang/definition";

    // Styles
    import { CounterGraphStyle, BaseGraphStyle } from "$lib/style/graph";
    import type { GraphType } from "$lib/logic/view/graph/base";
    import CounterMetricsComponent from "../Metrics/CounterMetrics.svelte";

    // Style object (from theme)
    export let baseStyle: { [property: string]: string | number } | null = null;
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveBaseStyle = baseStyle ?? $BaseGraphStyle;
    $: effectiveStyle = style ?? $CounterGraphStyle;

    // Props
    export let goBackEnabled: boolean = true;
    export let initialDate: Date;
    export let endDate: Date;
    export let data: Array<ProcessedCounterLogPoint>;
    export let dataFetched: boolean;
    export let firstFetch: boolean;
    export let timeStep: FormattedTimeStep;
    export let logSpanPeriod: LogSpanPeriod;
    export let globalMetrics: CounterMetrics;
    export let unit: string = "";
    export let decimalPlaces: number | null = null;

    // Layout / styling props
    export let height: string | undefined = undefined;

    // Merged style
    $: mergedStyle = Object.assign(effectiveBaseStyle, effectiveStyle);

    // Variables
    let cursorPos: { x: number | undefined; y: number | undefined } = { x: undefined, y: undefined };
    let graphContainer: HTMLDivElement;
    let graph: CounterGraphObject;
    let gridElement: HTMLDivElement | null = null;
    let graphType: GraphType;
    let created: boolean = false;
    let noData: boolean = true;
    let insideGraph: boolean = false;
    let currentLogPoint: CounterLogPoint | null = null;

    // Reactive Statements
    $: if (graphContainer) {
        createGraphObject();
    }

    $: if (graph && dataFetched && data && $selectedLang) {
        updateGraphData();
    }

    // Export Functions
    export let getNewTimeSpan: (startTime: Date, endTime: Date) => void;
    export let goBack: () => void;

    // Functions
    function createGraphObject(): void {
        graph = new CounterGraphObject(graphContainer, hoveredLogPointChange, mousePositionChange, gridDoubleClick, data);
        graphType = graph.getGraphType();
    }

    function hoveredLogPointChange(logPoint: CounterLogPoint | null): void {
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
        graph.updatePoints(data, decimalPlaces, true);
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
        {#if globalMetrics && dataFetched}
            <CounterMetricsComponent forceColStack={true} metrics={globalMetrics} {unit} {decimalPlaces} {dataFetched} roundMetrics={true} />
        {/if}
    </div>
</BaseGraph>
