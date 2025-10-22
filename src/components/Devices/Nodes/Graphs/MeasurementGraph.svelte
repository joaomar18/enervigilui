<script lang="ts">
    import { onDestroy } from "svelte";
    import { MeasurementGraphObject } from "$lib/logic/view/graph/measurement";
    import type { MeasurementLogPoint, ProcessedMeasurementLogPoint } from "$lib/types/nodes/logs";
    import type { FormattedTimeStep } from "$lib/types/date";
    import type { LogSpanPeriod } from "$lib/types/view/nodes";
    import BaseGraph from "./BaseGraph.svelte";

    // Texts
    import { selectedLang } from "$lib/stores/lang/definition";

    // Styles
    import { MeasurementGraphStyle, BaseGraphStyle } from "$lib/style/graph";

    // Style object (from theme)
    export let baseStyle: { [property: string]: string | number } | null = null;
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveBaseStyle = baseStyle ?? $BaseGraphStyle;
    $: effectiveStyle = style ?? $MeasurementGraphStyle;

    // Props
    export let initialDate: Date;
    export let endDate: Date;
    export let data: Array<ProcessedMeasurementLogPoint>;
    export let timeStep: FormattedTimeStep;
    export let logSpanPeriod: LogSpanPeriod;
    export let unit: string = "";

    // Layout / styling props
    export let height: string | undefined = undefined;

    // Merged style
    $: mergedStyle = Object.assign(effectiveBaseStyle, effectiveStyle);

    // Variables
    let graphContainer: HTMLDivElement;
    let graph: MeasurementGraphObject;
    let created: boolean = false;
    let noData: boolean = true;

    // Reactive Statements
    $: if (graphContainer) {
        createGraphObject();
    }

    $: if (graph && data && $selectedLang) {
        updateGraphData();
    }

    // Functions
    function createGraphObject(): void {
        graph = new MeasurementGraphObject(graphContainer, hoveredLogPointChange, data);
    }

    function hoveredLogPointChange(logPoint: MeasurementLogPoint | null): void {
        console.log(logPoint);
    }

    function updateGraphData(): void {
        graph.destroy();
        graph.updatePoints(data);
        graph.createGraph(timeStep, logSpanPeriod, mergedStyle);
        created = true;
        noData = !graph.hasData();
    }

    onDestroy(() => {
        if (graph) {
            graph.destroy();
        }
    });
</script>

<BaseGraph {height} bind:graphContainer {initialDate} {endDate} graphCreated={created} graphNoData={noData} {unit} />
