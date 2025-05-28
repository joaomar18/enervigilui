<script lang="ts">
    import Action from "../General/Action.svelte";
    import Notification from "../Dashboard/Buttons/Notification.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    //Props
    export let deviceID: number;
    export let deviceName: string;
    export let connected: boolean;
    export let notifications: string;

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
    export let imageURL: string;
    export let imageBackgroundColor: string;
    export let imageWidth: string;
    export let imageHeight: string;

    // Export Funcions
    export let onEdit: () => void;
    export let onEnter: () => void;

    // Functions
    function handleEdit(): void {
        if (onEdit) {
            onEdit();
        }
    }
    function handleEnter(): void {
        if (onEnter) {
            onEnter();
        }
    }
</script>

<!-- Device Card: displays a device’s name, image, action buttons, ID and connection status -->
<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --image-background-color: {imageBackgroundColor};
        --image-width: {imageWidth};
        --image-height: {imageHeight};
    "
    class="container"
>
    <div class="content">
        <h3>{deviceName}</h3>
        <div style="background-image: url('{imageURL}');" class="device-image-div">
            <button class="device-image-mask" onclick={handleEnter} aria-label="Enter Device"
            ></button>
        </div>
        <div class="actions-div">
            <Notification
                notificationsOpen={false}
                notificationsNumber={notifications}
                width="50px"
                height="50px"
                borderRadius="50%"
                backgroundColor="rgba(255, 255, 255, 0.1)"
                hoverColor="rgba(255, 255, 255, 0.2)"
                borderColor="transparent"
                imageWidth="25px"
                imageHeight="25px"
            />
            <Action
                width="50px"
                height="50px"
                borderRadius="50%"
                backgroundColor="rgba(255, 255, 255, 0.1)"
                hoverColor="rgba(255, 255, 255, 0.2)"
                borderColor="transparent"
                imageURL="/img/edit.png"
                imageWidth="25px"
                imageHeight="25px"
                onClick={handleEdit}
            />
            <Action
                width="50px"
                height="50px"
                borderRadius="50%"
                backgroundColor="rgba(255, 255, 255, 0.1)"
                hoverColor="rgba(255, 255, 255, 0.2)"
                borderColor="transparent"
                imageURL="/img/enter.png"
                imageWidth="32px"
                imageHeight="32px"
                onClick={handleEnter}
            />
        </div>
        <span class="id-text">ID: {String(deviceID).padStart(3, "0")}</span>
        <div class="connection-state-div">
            <div class:connected class="connection-status"></div>
            {#if connected}
                <span class="connection-text">{$texts.connected[$selectedLang]}</span>
            {:else}
                <span class="connection-text">{$texts.disconnected[$selectedLang]}</span>
            {/if}
        </div>
    </div>
</div>

<style>
    /* Container: card wrapper with size, bg, border and transitions */
    .container {
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius, 0px);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        transition:
            transform 0.2s ease-in-out,
            box-shadow 0.2s ease-in-out;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Hover state: lift and shadow for emphasis */
    .container:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    /* Content: vertical flex container, centered items */
    .content {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
    }

    /* Title: centered light-weight heading */
    h3 {
        color: #f5f5f5;
        width: 100%;
        text-align: center;
        font-weight: 300;
    }

    /* Image div: circular placeholder with bg image */
    .device-image-div {
        position: relative;
        padding: 0;
        margin: 0;
        margin-top: 10px;
        width: var(--image-width);
        height: var(--image-height);
        background-color: var(--image-background-color);
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 87.5%;
        border-radius: 50%;
        -webkit-tap-highlight-color: transparent;
    }

    /* Image hover: slightly dim the device image on hover */
    .device-image-div:hover {
        opacity: 0.8;
    }

    /* Overlay mask: invisible full-circle button to capture clicks */
    .device-image-div .device-image-mask {
        padding: 0;
        margin: 0;
        border: none;
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        cursor: pointer;
        background: transparent;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 128px 128px;
        transition:
            background-color 0.2s ease-in-out,
            opacity 0.2s ease-in-out;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Overlay hover: show enter icon and translucent gray overlay */
    .device-image-mask:hover {
        background-image: url("/img/enter.png");
        background-color: rgba(50, 50, 50, 0.4);
    }

    /* Actions: horizontal flex layout for buttons */
    .actions-div {
        margin: 0;
        padding: 0;
        padding-top: 25px;
        width: fit-content;
        gap: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* ID text: positioned bottom-left, subtle styling */
    .id-text {
        position: absolute;
        left: 20px;
        bottom: 10px;
        color: #e0e0e0;
        font-size: 0.9rem;
        font-weight: 300;
    }

    /* Connection state container: bottom-right alignment */
    .connection-state-div {
        position: absolute;
        right: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        bottom: 10px;
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
        color: #e0e0e0;
        font-size: 0.9rem;
        font-weight: 300;
    }
</style>
