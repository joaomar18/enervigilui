<script lang="ts">
    import type { MeasurementLogPoint } from "$lib/types/nodes/base";

    // Props
    export let measurementPoints: Array<MeasurementLogPoint> = [];

    // Layout / styling props
    export let width: string | undefined = "100%";
    export let height: string | undefined = "400px";

    // Variables
    let divContainer: HTMLDivElement;
    let dataAvailable: boolean;

    // Reactive Statements
    $: dataAvailable = !!measurementPoints && measurementPoints.length > 0;
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
