<script lang="ts">
    import { GraphType } from "$lib/logic/view/graph/base";
    import type { BaseMetrics, ProcessedBaseLogPoint } from "$lib/types/nodes/logs";
    import { FormattedTimeStep } from "$lib/types/date";
    import { LogSpanPeriod } from "$lib/types/view/nodes";
    import FullScreenPanel from "../../../Dashboard/FullScreenPanel.svelte";
    import Graph from "./Graph.svelte";

    // Styles
    import { FullScreenBaseGraphStyle, FullScreenGraphMetricStyle } from "$lib/style/graph";

    // Props
    export let data: Array<ProcessedBaseLogPoint> | undefined;
    export let timeStep: FormattedTimeStep | null | undefined;
    export let logSpanPeriod: LogSpanPeriod;
    export let show: boolean;
    export let goBackEnabled: boolean = true;
    export let graphType: GraphType;
    export let initialDate: Date;
    export let endDate: Date;
    export let dataFetched: boolean;
    export let firstFetch: boolean;
    export let globalMetrics: BaseMetrics | undefined;
    export let unit: string = "";
    export let decimalPlaces: number | null = null;
    export let selectedTimeSpan: LogSpanPeriod;

    // Export Functions
    export let getNewTimeSpan: (startTime: Date, endTime: Date) => void;
    export let getNewDefaultTimeSpan: (timeSpan: LogSpanPeriod) => void;
    export let goBack: () => void;
</script>

<FullScreenPanel bind:show>
    <Graph
        style={$FullScreenBaseGraphStyle}
        metricsStyle={$FullScreenGraphMetricStyle}
        {data}
        {timeStep}
        {logSpanPeriod}
        fullScreen={true}
        showDatePicker={true}
        bind:showFullScreen={show}
        {graphType}
        bind:initialDate
        bind:endDate
        {dataFetched}
        {firstFetch}
        {globalMetrics}
        {unit}
        {decimalPlaces}
        bind:selectedTimeSpan
        {goBackEnabled}
        {goBack}
        {getNewTimeSpan}
        {getNewDefaultTimeSpan}
    />
</FullScreenPanel>
