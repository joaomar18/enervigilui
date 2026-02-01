<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    // Variables
    let eventSource: EventSource | null = null;

    // Navigation
    import { resetDashboardLoader } from "$lib/logic/view/navigation";

    onMount(() => {
        resetDashboardLoader();
        eventSource = new EventSource("/sse/system/get_realtime_metrics");
        eventSource.onmessage = function (event) {
            console.log(event.data);
        };
        eventSource.onerror = function () {
            console.error("SSE connection error");
        };
    });
    onDestroy(() => {
        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }
    });
</script>

<style>
</style>
