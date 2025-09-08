<script lang="ts">
    import type { DeviceInfo } from "$lib/types/device/base";
    import Action from "../General/Action.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Props
    export let deviceInfo: DeviceInfo;
    export let deviceImageUrl: string;
</script>

{#if deviceInfo}
    <div class="info-div">
        <div class="section">
            <div style="background-image: {`url('${deviceImageUrl}')`};" class="device-image-div" class:image-loaded={true}></div>
            <div class="inner-section device-identification" style="padding-left: 10px;">
                <span class="device-name">{deviceInfo.name}</span>
                <span class="sub-text">ID: {String(deviceInfo.id).padStart(3, "0")}</span>
            </div>
        </div>
        <div class="expand-more-div">
            <Action imageURL="/img/expand-down.svg" onClick={() => {}} />
        </div>
    </div>
{/if}

<style>
    .info-div {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    .section {
        width: 375px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .section .inner-section {
        flex: 1;
        gap: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-top: 3px;
    }

    .device-identification .device-name {
        color: #c9c9c9;
        font-size: 1.05rem;
        font-weight: 300;
    }

    .expand-more-div {
        padding-left: 10px;
    }

    .sub-text {
        color: #9a9a9a;
        font-weight: 300;
        font-size: 0.85rem;
    }

    /* Image div: placeholder with bg image */
    .device-image-div {
        position: relative;
        padding: 0;
        margin: 0;
        width: 40px;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.1);
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 100%;
        border-radius: 50%;
        -webkit-tap-highlight-color: transparent;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        transform-origin: center;
        -webkit-font-smoothing: antialiased;
        object-fit: cover;
    }

    /* Image loaded state: fully visible */
    .device-image-div.image-loaded {
        opacity: 1;
    }
</style>
