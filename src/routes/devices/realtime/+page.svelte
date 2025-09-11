<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import DeviceRealTimeCard from "../../../components/Devices/DeviceRealTimeCard.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Stores
    import { loadedDone } from "$lib/stores/view/navigation";
    import { leftPanelOpen } from "$lib/stores/view/navigation";

    onMount(() => {
        loadedDone.set(true);
    });
</script>

<div class="content" in:fade={{ duration: 300 }} class:left-panel-open={$leftPanelOpen}>
    <DeviceRealTimeCard titleText={$texts.l1Phase}></DeviceRealTimeCard>
    <DeviceRealTimeCard titleText={$texts.l2Phase}></DeviceRealTimeCard>
    <DeviceRealTimeCard titleText={$texts.l3Phase}></DeviceRealTimeCard>
    <DeviceRealTimeCard titleText={$texts.total}></DeviceRealTimeCard>
    <DeviceRealTimeCard titleText={$texts.general}></DeviceRealTimeCard>
    <DeviceRealTimeCard titleText={$texts.metrics}></DeviceRealTimeCard>
    <div class="span-2">
        <DeviceRealTimeCard titleText={$texts.energyConsumption}></DeviceRealTimeCard>
    </div>
</div>

<style>
    .content {
        padding: 0;
        margin: 0;
        width: 100%;
        min-height: calc(100vh - 74px - 60px);
        display: grid;
        grid-template-columns: repeat(4, minmax(300px, 1fr));
        gap: 20px;
        justify-content: center;
        align-content: center;
    }

    .content .span-2 {
        grid-column: span 2;
    }

    @media (max-width: 1319px) {
        .content {
            grid-template-columns: repeat(2, minmax(300px, 1fr));
        }
    }

    @media (max-width: 1569px) {
        .content.left-panel-open {
            grid-template-columns: repeat(2, minmax(300px, 1fr));
        }
    }

    @media (max-width: 696px) {
        .content {
            grid-template-columns: repeat(1, minmax(300px, 1fr));
        }
        .content .span-2 {
            grid-column: auto;
        }
    }

    @media (max-width: 946px) {
        .content.left-panel-open {
            grid-template-columns: repeat(1, minmax(300px, 1fr));
        }
        .content.left-panel-open .span-2 {
            grid-column: auto;
        }
    }
</style>
