<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { DefaultButtonStyle } from "$lib/style/button";

    //Props
    export let enabled: boolean = true;
    export let processing: boolean = false;
    export let buttonText: string;
    export let imageURL: string = "";

    // Style object (from theme)
    export let style: { [property: string]: string } | null = null;
    $: effectiveStyle = style ?? $DefaultButtonStyle;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let minWidth: string | undefined = undefined;
    export let maxWidth: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let disabledBackgroundColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let disabledBorderColor: string | undefined = undefined;
    export let hoverColor: string | undefined = undefined;
    export let disabledHoverColor: string | undefined = undefined;
    export let fontColor: string | undefined = undefined;
    export let disabledFontColor: string | undefined = undefined;
    export let fontSize: string | undefined = undefined;
    export let fontWeight: string | undefined = undefined;
    export let imageWidth: string | undefined = undefined;
    export let imageHeight: string | undefined = undefined;
    export let imageRightPos: string | undefined = undefined;
    export let imageLeftPos: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        borderRadius,
        backgroundColor,
        disabledBackgroundColor,
        borderColor,
        disabledBorderColor,
        hoverColor,
        disabledHoverColor,
        fontColor,
        disabledFontColor,
        fontSize,
        fontWeight,
        imageWidth,
        imageHeight,
        imageRightPos,
        imageLeftPos,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Click Export Function
    export let onClick: () => void;

    // Functions
    function handleClick(): void {
        if (onClick && enabled) {
            onClick();
        }
    }
</script>

<!--
  Reusable Button component:
  - Highly customizable via CSS variables for size, colors, border, and typography.
  - Supports optional icon (image) on the left or right, with configurable size and position.
  - Handles enabled/disabled states with separate styles and disables click when not enabled.
  - Accepts a click handler via the `onClick` prop.
  - Accessible: sets `aria-label` to button text.
  - Usage: <Button buttonText="Click me" onClick={...} ...otherProps />
-->
<button
    style="
        --width: {mergedStyle.width};
        --min-width: {minWidth};
        --max-width: {maxWidth};
        --height: {mergedStyle.height};
        --border-radius: {mergedStyle.borderRadius};
        --background-color: {mergedStyle.backgroundColor};
        --disabled-background-color: {mergedStyle.disabledBackgroundColor};
        --border-color: {mergedStyle.borderColor};
        --disabled-border-color: {mergedStyle.disabledBorderColor};
        --hover-color: {mergedStyle.hoverColor};
        --disabled-hover-color: {mergedStyle.disabledHoverColor};
        --font-color: {mergedStyle.fontColor};
        --disabled-font-color: {mergedStyle.disabledFontColor};
        --font-size: {mergedStyle.fontSize};
        --font-weight: {mergedStyle.fontWeight};
        --image-width: {mergedStyle.imageWidth};
        --image-height: {mergedStyle.imageHeight};
        --image-right-position: {mergedStyle.imageRightPos};
        --image-left-position: {mergedStyle.imageLeftPos};
    "
    class:align-left={mergedStyle.imageRightPos != "auto" && imageURL && !processing}
    class:align-right={mergedStyle.imageLeftPos != "auto" && imageURL && !processing}
    class:disabled={!enabled || processing}
    aria-label={buttonText}
    on:click={handleClick}
>
    {#if !processing}
        {buttonText}
        {#if imageURL}
            <img src={imageURL} alt={imageURL} />
        {/if}
    {:else}
        <svg class="loader" width={mergedStyle.imageWidth} height={mergedStyle.imageHeight} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4" />
        </svg>
    {/if}
</button>

<style>
    /* Main button styles: layout, typography, and transitions */
    button {
        margin: 0;
        padding: 0;
        position: relative;
        width: var(--width);
        min-width: var(--min-width, 0px);
        max-width: var(--max-width, --width);
        height: var(--height);
        border-radius: var(--border-radius, 0px);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        font-size: var(--font-size);
        color: var(--font-color);
        font-weight: var(--font-weight);
        cursor: pointer;
        transition: background-color 0.2s ease;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Disabled state: muted colors and no pointer */
    button.disabled {
        background-color: var(--disabled-background-color);
        border: 1px solid var(--disabled-border-color);
        cursor: auto;
    }

    /* Icon on the left: align text left and add left padding */
    button.align-left {
        text-align: left;
        padding-left: var(--image-right-position);
    }

    /* Icon on the right: align text right and add right padding */
    button.align-right {
        text-align: right;
        padding-right: var(--image-left-position);
    }

    /* Hover state: change background color */
    button:hover {
        background-color: var(--hover-color);
    }

    /* Disabled hover: keep disabled background */
    button.disabled:hover {
        background-color: var(--disabled-hover-color);
    }

    /* Icon styles: size and vertical centering, position left or right */
    button img {
        width: var(--image-width);
        height: var(--image-height);
        position: absolute;
        top: 50%;
        left: var(--image-left-position);
        right: var(--image-right-position);
        transform: translateY(-50%);
    }

    /* Loading spinner: rotating animation */
    .loader {
        animation: rotate 1s linear infinite;
        transform-origin: center;
    }

    /* Spinner circle path: animated stroke */
    .path {
        stroke: white;
        stroke-linecap: butt;
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
    }

    /* Keyframe animation: full 360 degree rotation */
    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }
</style>
