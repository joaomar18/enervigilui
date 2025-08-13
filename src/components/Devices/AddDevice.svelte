<script lang="ts">
    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { AddDeviceStyle } from "$lib/style/device";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $AddDeviceStyle;

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
    export let strokeColor: string | undefined = undefined;
    export let strokeSelectedColor: string | undefined = undefined;
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
        strokeColor,
        strokeSelectedColor,
        shadowColor,
        titleColor,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Click Export Funcion
    export let onClick: () => void;

    // Functions
    function handleClick(): void {
        if (onClick) {
            onClick();
        }
    }
</script>

<!-- Add Device Card: clickable card with a plus icon to add a new device -->
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
        --stroke-color: {mergedStyle.strokeColor};
        --stroke-selected-color: {mergedStyle.strokeSelectedColor};
        --shadow-color: {mergedStyle.shadowColor};
        --title-color: {mergedStyle.titleColor};
    "
    class="container"
>
    <div class="content">
        <h3>{$texts.addDevice[$selectedLang]}</h3>
        <div class="add-device-image-div">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={mergedStyle.imageContainerWidth}
                height={mergedStyle.imageContainerHeight}
                viewBox="0 0 200 200"
            >
                <circle cx="100" cy="100" r="100" fill="transparent" />

                <!-- Vertical bar of the plus -->
                <line x1="100" y1="50" x2="100" y2="150" stroke-width="10" stroke-linecap="round" />

                <!-- Horizontal bar of the plus -->
                <line x1="50" y1="100" x2="150" y2="100" stroke-width="10" stroke-linecap="round" />
            </svg>
        </div>
        <button on:click={handleClick} aria-label="Add Device Button"></button>
    </div>
</div>

<style>
    /* Container: card wrapper with size, background, border and transitions */
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
        backface-visibility: hidden;
        transform: scale(1) translateZ(0);
        -webkit-font-smoothing: antialiased;
    }

    /* Hover: scale up and apply subtle shadow */
    .container:hover {
        transform: scale(1.1) translateZ(0);
        box-shadow: 0 8px 16px var(--shadow-color);
    }

    /* Content: vertical flex layout, centered items */
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

    /* Title: centered, light-weight heading */
    h3 {
        margin: 0;
        padding: 0;
        padding-top: 20px;
        padding-bottom: 20px;
        color: var(--title-color);
        width: 100%;
        text-align: center;
        font-weight: 400;
    }

    /* Image div: placeholder with background and sizing */
    .add-device-image-div {
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
    }

    /* Plus icon lines: base stroke color with transition */
    svg line {
        stroke: var(--stroke-color);
        transition: stroke 0.2s ease-in-out;
    }

    /* Hover icon: stroke changes when container is hovered */
    .container:hover svg line {
        stroke: var(--stroke-selected-color);
    }

    /* Button overlay: invisible full-card click surface */
    .content button {
        position: absolute;
        margin: 0;
        padding: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }
</style>
