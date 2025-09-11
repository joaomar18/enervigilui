<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import DeviceRealTimeCard from "../../../components/Devices/DeviceRealTimeCard.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Stores
    import { loadedDone } from "$lib/stores/view/navigation";

    onMount(() => {
        loadedDone.set(true);
    });
</script>

<div class="content" in:fade={{ duration: 300 }}>
    <div class="grid">
        <div class="grid-col">
            <DeviceRealTimeCard titleText={$texts.l1Phase}></DeviceRealTimeCard>
        </div>
        <div class="grid-col">
            <DeviceRealTimeCard titleText={$texts.l2Phase}></DeviceRealTimeCard>
        </div>
        <div class="grid-col">
            <DeviceRealTimeCard titleText={$texts.l3Phase}></DeviceRealTimeCard>
        </div>
        <div class="grid-col">
            <DeviceRealTimeCard titleText={$texts.total}></DeviceRealTimeCard>
        </div>
        <div class="grid-col">
            <DeviceRealTimeCard titleText={$texts.general}></DeviceRealTimeCard>
        </div>
        <div class="grid-col">
            <DeviceRealTimeCard titleText={$texts.metrics}></DeviceRealTimeCard>
        </div>
        <div class="grid-col span-2">
            <DeviceRealTimeCard titleText={$texts.energyConsumption}></DeviceRealTimeCard>
        </div>
    </div>
</div>

<style>
    .content {
        padding: 0;
        width: 100%;
        min-height: calc(100vh - 74px - 60px);
    }

    .grid {
        margin: 0 auto;
        padding: 0;
        position: relative;
        display: grid;
        grid-template-columns: repeat(4, minmax(300px, 1fr));
        max-width: calc(4 * 540px + 1 * 20px);
        gap: 20px;
        justify-items: stretch;
        align-items: stretch;
        align-content: start;
    }

    .grid .grid-col.span-2 {
        grid-column: span 2;
    }

    @media (max-width: 1569px) {
        .grid {
            max-width: calc(2 * 540px + 1 * 20px);
            grid-template-columns: repeat(2, minmax(300px, 1fr));
        }
    }

    @media (max-width: 946px) {
        .grid {
            max-width: 540px;
            grid-template-columns: repeat(1, minmax(300px, 1fr));
        }
        .grid .grid-col.span-2 {
            grid-column: auto;
        }
    }
</style>
