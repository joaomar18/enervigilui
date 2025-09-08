<script lang="ts">
    import type { DeviceInfo } from "$lib/types/device/base";

    // Props
    export let deviceInfo: DeviceInfo;
</script>

<div class="wrapper-div">
    {#if deviceInfo}
        <div class="info-div">
            <div class="device-identification">
                <span class="device-name">{deviceInfo.name}</span>
                <span class="device-id">ID: {String(deviceInfo.id).padStart(3, "0")}</span>
            </div>
            <div class="separator" style="padding-left:20px;"></div>
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
    }

    .separator {
        height: 50px;
        width: 1px;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
    }

    .device-identification {
        gap: 10px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
    }

    .device-identification .device-name {
        color: white;
        font-size: 1.1rem;
    }

    .device-identification .device-id {
        color: rgb(170, 170, 170);
    }
</style>
