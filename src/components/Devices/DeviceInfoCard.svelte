<script lang="ts">
    import type { DeviceInfo } from "$lib/types/device/base";
    import Action from "../General/Action.svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { DeviceInfoCardStyle } from "$lib/style/device";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $DeviceInfoCardStyle;

    // Props
    export let deviceInfo: DeviceInfo;
    export let deviceImageUrl: string;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let deviceNameMaxWidth: string | undefined = undefined;
    export let mainTextColor: string | undefined = undefined;
    export let mainTextWeight: string | undefined = undefined;
    export let subTextColor: string | undefined = undefined;
    export let subTextWeight: string | undefined = undefined;
    export let imageWidth: string | undefined = undefined;
    export let imageHeight: string | undefined = undefined;
    export let imageBackgroundColor: string | undefined = undefined;
    export let imageBorderRadius: string | undefined = undefined;

    $: localOverrides = {
        width,
        deviceNameMaxWidth,
        mainTextColor,
        mainTextWeight,
        subTextColor,
        subTextWeight,
        imageWidth,
        imageHeight,
        imageBackgroundColor,
        imageBorderRadius,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);
</script>

<!-- Device Info Card: displays a device’s name, image, action buttons, ID, and connection status -->
{#if deviceInfo}
    <div
        class="info-div"
        style="
            --width: {mergedStyle.width};
            --device-name-max-width: {mergedStyle.deviceNameMaxWidth};
            --main-text-color: {mergedStyle.mainTextColor};
            --main-text-weight: {mergedStyle.mainTextWeight};
            --sub-text-color: {mergedStyle.subTextColor};
            --sub-text-weight: {mergedStyle.subTextWeight};
            --image-width: {mergedStyle.imageWidth};
            --image-height: {mergedStyle.imageHeight};
            --image-background-color: {mergedStyle.imageBackgroundColor};
            --image-border-radius: {mergedStyle.imageBorderRadius};
        "
    >
        <div class="section">
            <div style="background-image: {`url('${deviceImageUrl}')`};" class="device-image-div" class:image-loaded={Boolean(deviceImageUrl)}></div>
            <div class="inner-section device-identification">
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
    /* Container: card wrapper for device info */
    .info-div {
        margin: 0;
        padding: 0;
        width: var(--width);
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    /* Section: horizontal flex for image and identification */
    .section {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-grow: 1;
        height: fit-content;
    }

    /* Inner Section: device name and ID, spaced */
    .section .inner-section {
        margin: 0;
        padding: 0;
        padding-left: 10px;
        gap: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-grow: 1;
        justify-content: space-between;
    }

    /* Device Name: main text styling */
    .device-identification .device-name {
        font-size: 16px;
        color: var(--main-text-color);
        font-weight: var(--main-text-weight);
        white-space: nowrap;
        max-width: var(--device-name-max-width);
        overflow: hidden;
        text-overflow: ellipsis;
        padding-bottom: 2px;
    }

    /* Expand Button: right-side action */
    .expand-more-div {
        margin: 0;
        padding: 0;
        padding-left: 10px;
        width: fit-content;
        height: fit-content;
    }

    /* Sub Text: device ID styling */
    .sub-text {
        font-size: 14px;
        color: var(--sub-text-color);
        font-weight: var(--sub-text-weight);
    }

    /* Device Image: device photo or icon */
    .device-image-div {
        position: relative;
        padding: 0;
        margin: 0;
        width: var(--image-width);
        height: var(--image-height);
        background-color: var(--image-background-color);
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 100%;
        border-radius: var(--image-border-radius);
        -webkit-tap-highlight-color: transparent;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        transform-origin: center;
        -webkit-font-smoothing: antialiased;
        object-fit: cover;
    }

    /* Image Loaded: fade in when loaded */
    .device-image-div.image-loaded {
        opacity: 1;
    }
</style>
