<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import uPlot from "uplot";
    import "uplot/dist/uPlot.min.css";
    import type { ProcessedCounterLogPoint } from "$lib/types/nodes/logs";

    //Props
    export let data: Array<ProcessedCounterLogPoint>;
    export let unit: string = "";

    // Layout / styling props
    export let width: string | undefined = "100%";
    export let height: string | undefined = "400px";
    export let borderRadius: string | undefined = "10px";
    export let backgroundColor: string | undefined = "rgba(20, 22, 28, 0.6)";
    export let borderColor: string | undefined = "rgba(255, 255, 255, 0.08)";
    export let boxShadow: string | undefined = "0 2px 4px rgba(0, 0, 0, 0.1)";
    export let plotBackgroundColor: string | undefined = "rgba(0,0,0,0)";

    // Variables
    let chartContainer: HTMLDivElement;
    let chart: uPlot;
    let resizeObserver: ResizeObserver;

    // Functions
    function convertDataForUplot(data: Array<ProcessedCounterLogPoint>): uPlot.AlignedData {
        const timestamps: number[] = [];
        const values: number[] = [];

        for (let point of data) {
            timestamps.push(point.start_time);
            values.push(point.value);
        }

        return [timestamps, values] as uPlot.AlignedData;
    }

    function getContainerSize(): { width: number; height: number } {
        let width = 0;
        let height = 0;
        if (chartContainer) {
            const containerRect = chartContainer.getBoundingClientRect();
            width = containerRect.width;
            height = containerRect.height;
        }
        return { width, height };
    }

    function updateChartSize() {
        if (chart) {
            let { width, height } = getContainerSize();
            if (width > 0 && height > 0) {
                chart.setSize({ width: width, height: height });
            }
        }
    }

    onMount(() => {
        const uplotData = convertDataForUplot(data);

        let { width, height } = getContainerSize();
        const root = document.querySelector("body") as HTMLBodyElement;
        const rootFont = getComputedStyle(root).fontFamily;

        let opts: uPlot.Options = {
            width: width,
            height: height,
            series: [
                {}, // x-axis (time)
                { stroke: "blue", width: 2 },
            ],
            axes: [
                {
                    // x-axis (time)
                    alignTo: 1,
                    values: (u, ticks) => ticks.map((t) => new Date(t * 1000).toLocaleTimeString()),
                    gap: 10,
                    size: 40,
                    font: `12px ${rootFont}`,
                    stroke: "white",
                    grid: {
                        show: true,
                        stroke: "rgba(255, 255, 255, 0.06)",
                        width: 1,
                    },
                },
                {
                    // y-axis (values)
                    alignTo: 1,
                    align: 2,
                    font: `12px ${rootFont}`,
                    gap: 10,
                    size: 60,
                    stroke: "white",
                    grid: {
                        show: true,
                        stroke: "rgba(255, 255, 255, 0.06)",
                        width: 1,
                    },
                },
            ],
            cursor: {
                drag: {
                    x: false, // Disable horizontal drag/zoom
                    y: false, // Disable vertical drag/zoom
                },
            },
        };

        chart = new uPlot(opts, uplotData, chartContainer);

        resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.target === chartContainer) {
                    updateChartSize();
                }
            }
        });

        resizeObserver.observe(chartContainer);
    });

    onDestroy(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
        if (chart) {
            chart.destroy();
        }
    });
</script>

<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --box-shadow: {boxShadow};
        --plot-background-color: {plotBackgroundColor};
    "
    class="graph-div"
    bind:this={chartContainer}
></div>

<style>
    .graph-div {
        margin: 0;
        position: relative;
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        background: var(--background-color);
        border: 1px solid var(--border-color);
        box-shadow: var(--box-shadow);
        overflow: hidden;
        transition: all 0.2s ease;
        box-sizing: border-box;

        /* Temporary debug - remove later */
        min-height: 400px;
    }

    /* uPlot canvas styling */
    .graph-div :global(canvas) {
        display: block;
    }

    /* Inner plot background (area where series are drawn) */
    .graph-div :global(.u-under) {
        background: var(--plot-background-color);
    }

    .graph-div :global(.u-axis) {
        color: white;
    }
</style>
