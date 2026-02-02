<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    // Variables
    let realtime_eventSource: EventSource | null = null;
    let cpu_usage_eventSource: EventSource | null = null;
    let ram_usage_eventSource: EventSource | null = null;

    // Navigation
    import { resetDashboardLoader } from "$lib/logic/view/navigation";

    onMount(() => {
        resetDashboardLoader();
        realtime_eventSource = new EventSource("/sse/system/get_realtime_metrics");
        cpu_usage_eventSource = new EventSource("/sse/system/get_cpu_usage_history");
        ram_usage_eventSource = new EventSource("/sse/system/get_ram_usage_history");

        realtime_eventSource.onmessage = function (event) {
            console.log(event.data);
        };
        cpu_usage_eventSource.onmessage = function (event) {
            console.log(event.data);
        };
        ram_usage_eventSource.onmessage = function (event) {
            console.log(event.data);
        };
        realtime_eventSource.onerror = function () {
            console.error("SSE connection error");
        };
        cpu_usage_eventSource.onerror = function () {
            console.error("SSE connection error");
        };
        ram_usage_eventSource.onerror = function () {
            console.error("SSE connection error");
        };
    });
    onDestroy(() => {
        if (realtime_eventSource) {
            realtime_eventSource.close();
            realtime_eventSource = null;
        }
        if (cpu_usage_eventSource) {
            cpu_usage_eventSource.close();
            cpu_usage_eventSource = null;
        }
        if (ram_usage_eventSource) {
            ram_usage_eventSource.close();
            ram_usage_eventSource = null;
        }
    });
</script>

<style>
</style>
