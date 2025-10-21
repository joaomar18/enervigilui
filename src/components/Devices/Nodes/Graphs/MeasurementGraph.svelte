<script lang="ts">
    import uPlot from "uplot";
    import "uplot/dist/uPlot.min.css";
    import { onDestroy } from "svelte";
    import { createMeasurementGraph } from "$lib/logic/view/graph";
    import type { ProcessedMeasurementLogPoint } from "$lib/types/nodes/logs";
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
    let graph: uPlot | null;
    let graphNoData: boolean = false; // Graph has real data to show

    // Reactive Statements
    $: if (data && graphContainer && $selectedLang) {
        destroyGraph();
        ({ graph, graphNoData } = createMeasurementGraph(graphContainer, data, timeStep, logSpanPeriod, mergedStyle));
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

<BaseGraph {height} bind:graphContainer {initialDate} {endDate} {graph} {graphNoData} {unit} />
