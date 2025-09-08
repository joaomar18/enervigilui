<script lang="ts">
    import type { DeviceInfo } from "$lib/types/device/base";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Props
    export let deviceInfo: DeviceInfo;
    export let deviceImageUrl: string;
</script>

<div class="wrapper-div">
    {#if deviceInfo}
        <div class="info-div">
            <div class="section">
                <div style="background-image: {`url('${deviceImageUrl}')`};" class="device-image-div" class:image-loaded={true}></div>
                <div class="inner-section device-identification" style="padding-left: 20px;">
                    <span class="device-name">{deviceInfo.name}</span>
                    <span class="device-id sub-text">ID: {String(deviceInfo.id).padStart(3, "0")}</span>
                    
                </div>
            </div>
            <div class="separator" style="padding-left:20px;"></div>
            <div class="section">
                <div class="inner-section connection-state-div" style="padding-left: 20px;">
                    <div class="status-div">
                        <div class:connected={deviceInfo.connected} class="connection-status"></div>
                        {#if deviceInfo.connected}
                            <span class="connection-text">{$texts.connected}</span>
                        {:else}
                            <span class="connection-text">{$texts.disconnected}</span>
                        {/if}
                    </div>
                    {#if deviceInfo.connected}
                        <span class="sub-text">{deviceInfo.history?.connection_on_datetime}</span>
                    {:else}
                        <span class="sub-text">{deviceInfo.history?.updated_at}</span>
                    {/if}
                </div>
                <img alt="Last update" src="/img/network.svg" />
            </div>
            <div class="separator" style="padding-left:20px;"></div>
            <div class="section">
                <div class="inner-section last-update-div" style="padding-left: 20px;">
                    <span class="last-update">{$texts.lastUpdate}</span>
                    <span class="sub-text">{deviceInfo.history?.updated_at}</span>
                </div>
                <img alt="Last update" src="/img/last-update.svg" />
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

    .section {
        width: 325px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .section .inner-section {
        flex: 1;
        gap: 10px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
    }

    .separator {
        height: 50px;
        width: 1px;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
    }

    .device-identification .device-name {
        color: white;
        font-size: 1.1rem;
    }

    .sub-text {
        color: rgb(170, 170, 170);
    }

    /* Image div: placeholder with bg image */
    .device-image-div {
        position: relative;
        padding: 0;
        margin: 0;
        width: 50px;
        height: 50px;
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

    .connection-state-div .status-div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        gap: 10px;
    }

    /* Status dot: default disconnected color */
    .connection-state-div .connection-status {
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background-color: #f44336;
    }

    /* Status dot when connected */
    .connection-state-div .connection-status.connected {
        background-color: #4caf50;
    }

    /* Connection text: subtle label next to dot */
    .connection-state-div .connection-text {
        color: rgb(242, 242, 242);
        font-size: 0.9rem;
        font-weight: 300;
    }

    .last-update-div .last-update {
        color: rgb(242, 242, 242);
        font-size: 0.9rem;
        font-weight: 300;
    }
</style>
