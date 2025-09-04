<script lang="ts">
    import Action from "../General/Action.svelte";
    import Notification from "../General/Notification.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { DeviceCardStyle, DeviceActionStyle, DeviceNotificationStyle } from "$lib/style/device";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $DeviceCardStyle;

    //Props
    export let deviceID: number;
    export let deviceName: string;
    export let connected: boolean;
    export let notifications: string;
    export let imageURL: string;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let imageBackgroundColor: string | undefined = undefined;
    export let imageContainerWidth: string | undefined = undefined;
    export let imageContainerHeight: string | undefined = undefined;
    export let imageContainerBorderRadius: string | undefined = undefined;
    export let imageWidth: string | undefined = undefined;
    export let imageHeight: string | undefined = undefined;
    export let textColor: string | undefined = undefined;
    export let imageHoverBackgroundColor: string | undefined = undefined;
    export let shadowColor: string | undefined = undefined;
    export let titleColor: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        borderRadius,
        backgroundColor,
        borderColor,
        imageBackgroundColor,
        imageContainerWidth,
        imageContainerHeight,
        imageContainerBorderRadius,
        imageWidth,
        imageHeight,
        textColor,
        imageHoverBackgroundColor,
        shadowColor,
        titleColor,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let enterButtonSize: string;
    $: enterButtonSize = `${parseInt(String(mergedStyle.imageContainerWidth)) - 50}px`;

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
        --width: {mergedStyle.width};
        --height: {mergedStyle.height};
        --border-radius: {mergedStyle.borderRadius};
        --background-color: {mergedStyle.backgroundColor};
        --border-color: {mergedStyle.borderColor};
        --image-background-color: {mergedStyle.imageBackgroundColor};
        --image-container-width: {mergedStyle.imageContainerWidth};
        --image-container-height: {mergedStyle.imageContainerHeight};
        --image-container-border-radius: {mergedStyle.imageContainerBorderRadius};
        --image-width: {mergedStyle.imageWidth};
        --image-height: {mergedStyle.imageHeight};
        --text-color: {mergedStyle.textColor};
        --image-hover-background-color: {mergedStyle.imageHoverBackgroundColor};
        --shadow-color: {mergedStyle.shadowColor};
        --title-color: {mergedStyle.titleColor};
        --enter-button-size: {enterButtonSize};
    "
    class="container"
>
    <div class="content">
        <h3>{deviceName}</h3>
        <div style="background-image: {`url('${imageURL}')`};" class="device-image-div" class:image-loaded={true}>
            <button class="device-image-mask" on:click={handleEnter} aria-label="Enter Device"></button>
        </div>
        <div class="actions-div">
            <Notification notificationsOpen={false} notificationsNumber={notifications} style={$DeviceNotificationStyle} />
            <Action style={$DeviceActionStyle} imageURL="/img/edit.svg" onClick={handleEdit} />
            <Action style={$DeviceActionStyle} imageURL="/img/enter.png" onClick={handleEnter} />
        </div>
        <span class="id-text">ID: {String(deviceID).padStart(3, "0")}</span>
        <div class="connection-state-div">
            <div class:connected class="connection-status"></div>
            {#if connected}
                <span class="connection-text">{$texts.connected}</span>
            {:else}
                <span class="connection-text">{$texts.disconnected}</span>
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
        transform-origin: center;
        -webkit-font-smoothing: antialiased;
        object-fit: cover;
        overflow: hidden;
        contain: paint;
        shape-rendering: geometricPrecision;
    }

    /* Hover state: lift and shadow for emphasis */
    .container:hover {
        transform: scale(1.0625) translate3d(0, 0, 0);
        box-shadow: 0 8px 16px var(--shadow-color);
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

    /* Title: centered light-weight heading, truncate if too long */
    h3 {
        margin: 0;
        padding: 20px;
        color: var(--title-color);
        width: 100%;
        text-align: center;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        box-sizing: border-box;
    }

    /* Image div: placeholder with bg image */
    .device-image-div {
        position: relative;
        padding: 0;
        margin: 0;
        margin-top: 10px;
        width: var(--image-container-width);
        height: var(--image-container-height);
        background-color: var(--image-background-color);
        background-repeat: no-repeat;
        background-position: center;
        background-size: var(--image-width) var(--image-height);
        border-radius: var(--image-container-border-radius);
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

    /* Image hover: slightly dim the device image on hover */
    .device-image-div:hover {
        opacity: 0.8;
    }

    /* Ensure hover effect works with loaded images */
    .device-image-div.image-loaded:hover {
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
        background-size: var(--enter-button-size) var(--enter-button-size);
        transition:
            background-color 0.2s ease-in-out,
            opacity 0.2s ease-in-out;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Overlay hover: show enter icon and translucent gray overlay */
    .device-image-mask:hover {
        background-image: url("/img/enter.png");
        background-color: var(--image-hover-background-color);
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
        color: var(--text-color);
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
        color: var(--text-color);
        font-size: 0.9rem;
        font-weight: 300;
    }
</style>
