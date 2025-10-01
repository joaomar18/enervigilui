<script lang="ts">
    import { getGraphBounds, getStepToMs } from "$lib/logic/view/graph";
    import { GraphTimeSpan, GraphTimeStep } from "$lib/types/view/graph";
    import type { MeasurementLogPoint } from "$lib/types/nodes/base";
    import { createMeasurementChart } from "./MeasurementsGraph";

    // Props
    export let measurementPoints: Array<MeasurementLogPoint> = [];

    // Layout / styling props
    export let width: string | undefined = "100%";
    export let height: string | undefined = "400px";

    // Variables
    let divContainer: HTMLDivElement;
    let dataAvailable: boolean;
    let timeSpan: GraphTimeSpan;
    let timeStep: GraphTimeStep;

    // Reactive Statements
    $: dataAvailable = !!measurementPoints && measurementPoints.length > 0;
    $: if (dataAvailable && divContainer) {
        ({ timeSpan, timeStep } = getGraphBounds(measurementPoints[0].startTimeMs, measurementPoints[measurementPoints.length - 1].endTimeMs));
        createMeasurementChart(
            divContainer,
            measurementPoints,
            measurementPoints[0].startTimeMs,
            measurementPoints[measurementPoints.length - 1].endTimeMs,
            getStepToMs(timeStep, measurementPoints[0].startTimeMs),
        );
    }
</script>

<div
    style="
        --width: {width};       
        --height: {height};
    "
    class="container"
>
    <div class="graph-div-wrapper">
        <div bind:this={divContainer} class="graph-div"></div>
    </div>
</div>

<style>
    .container {
        padding: 0;
        margin: 0;
        width: var(--width);
        height: var(--height);
    }

    .graph-div-wrapper {
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .graph-div {
        height: 100%;
    }
</style>
