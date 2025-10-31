<script lang="ts">
    import { GraphType } from "$lib/logic/view/graph/base";
    import type { BaseLogPoint, BaseMetrics } from "$lib/types/nodes/logs";
    import FullScreenPanel from "../../../Dashboard/FullScreenPanel.svelte";
    import BaseGraph from "./BaseGraph.svelte";

    // Styles
    import { FullScreenBaseGraphStyle, FullScreenGraphMetricStyle } from "$lib/style/graph";
    import { onMount } from "svelte";

    // Props
    export let show: boolean;
    export let goBackEnabled: boolean = true;
    export let gridElement: HTMLDivElement | null = null;
    export let graphType: GraphType;
    export let insideGraph: boolean;
    export let cursorPos: { x: number | undefined; y: number | undefined };
    export let graphContainer: HTMLDivElement;
    export let initialDate: Date;
    export let endDate: Date;
    export let graphCreated: boolean;
    export let dataFetched: boolean;
    export let firstFetch: boolean;
    export let graphNoData: boolean;
    export let logPoint: BaseLogPoint | null;
    export let globalMetrics: BaseMetrics;
    export let unit: string = "";
    export let decimalPlaces: number | null = null;

    $: console.log(globalMetrics);

    // Export Functions
    export let goBack: () => void;

    onMount(() => {
        console.log(globalMetrics);
    });
</script>

<FullScreenPanel bind:show>
    <BaseGraph
        style={$FullScreenBaseGraphStyle}
        metricsStyle={$FullScreenGraphMetricStyle}
        fullScreen={true}
        bind:showFullScreen={show}
        {gridElement}
        {graphType}
        {insideGraph}
        {cursorPos}
        {graphContainer}
        {initialDate}
        {endDate}
        {graphCreated}
        {dataFetched}
        {firstFetch}
        {graphNoData}
        {logPoint}
        {globalMetrics}
        {unit}
        {decimalPlaces}
        {goBackEnabled}
        {goBack}
    />
</FullScreenPanel>
