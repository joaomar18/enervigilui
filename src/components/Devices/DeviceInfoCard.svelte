<script lang="ts">
    import type { DeviceInfo } from "$lib/types/device/base";

    // Props
    export let deviceInfo: DeviceInfo;
</script>

<div class="wrapper-div">
    {#if deviceInfo}
        <div class="info-div">
            <div class="text-div">
                <span class="device-name">{deviceInfo.name}</span>
                <span class="device-id">ID: {String(deviceInfo.id).padStart(3, "0")}</span>
            </div>
        </div>
    {/if}
</div>

<style>
    .wrapper-div {
        margin: 0;
        padding: 0;
        width: fit-content;
        height: fit-content;
    }

    .info-div {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 10px;
    }

    .text-div {
        gap: 10px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
    }

    .text-div .device-name {
        color: white;
        font-size: 1.1rem;
    }

    .text-div .device-id {
        color: rgb(170, 170, 170);
    }
</style>
