<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { SSEHandler } from "$lib/logic/sse/sse";
    import type { RealTimeSystemData } from "$lib/types/analytics/system";

    // Navigation
    import { resetDashboardLoader } from "$lib/logic/view/navigation";

    // Variables
    let realtimeStream: SSEHandler<RealTimeSystemData> | null = null;
    let cpuHistoryStream: SSEHandler<number[]> | null = null;
    let ramHistoryStream: SSEHandler<number[]> | null = null;
    let realtimeData: RealTimeSystemData | undefined = undefined;
    let cpuHistoryData: number[] | undefined = undefined;
    let ramHistoryData: number[] | undefined = undefined;

    // Reactive statements
    $: console.log(realtimeData);
    $: console.log(cpuHistoryData);
    $: console.log(ramHistoryData);

    // Functions
    function closeAllStreams() {
        realtimeStream?.close();
        cpuHistoryStream?.close();
        ramHistoryStream?.close();
        realtimeStream = null;
        cpuHistoryStream = null;
        ramHistoryStream = null;
    }

    onMount(() => {
        resetDashboardLoader();
        window.addEventListener("beforeunload", closeAllStreams);

        realtimeStream = new SSEHandler<RealTimeSystemData>(
            "/sse/system/get_realtime_metrics",
            (data: RealTimeSystemData) => {
                realtimeData = data;
            },
            3000,
        );
        cpuHistoryStream = new SSEHandler(
            "/sse/system/get_cpu_usage_history",
            (data: number[]) => {
                cpuHistoryData = data;
            },
            3000,
        );
        ramHistoryStream = new SSEHandler(
            "/sse/system/get_ram_usage_history",
            (data: number[]) => {
                ramHistoryData = data;
            },
            3000,
        );
    });
    onDestroy(() => {
        window.removeEventListener("beforeunload", closeAllStreams);
        closeAllStreams();
    });
</script>

<style>
</style>
