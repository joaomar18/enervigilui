<script lang="ts">
    import ToolTip from "./ToolTip.svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { DefaultButtonStyle } from "$lib/style/button";
    import { ToolTipStyle } from "$lib/style/general";

    //Props
    export let enabled: boolean = true;
    export let selected: boolean = false;
    export let processing: boolean = false;
    export let buttonText: string;
    export let imageURL: string = "";
    export let enableToolTip: boolean = false;
    export let toolTipAutoPos: boolean = true;

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    export let toolTipStyle: { [property: string]: string | number } = $ToolTipStyle;
    $: effectiveStyle = style ?? $DefaultButtonStyle;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let minWidth: string | undefined = undefined;
    export let maxWidth: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let disabledBackgroundColor: string | undefined = undefined;
    export let selectedBackgroundColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let disabledBorderColor: string | undefined = undefined;
    export let selectedBorderColor: string | undefined = undefined;
    export let hoverColor: string | undefined = undefined;
    export let disabledHoverColor: string | undefined = undefined;
    export let selectedHoverColor: string | undefined = undefined;
    export let fontColor: string | undefined = undefined;
    export let disabledFontColor: string | undefined = undefined;
    export let selectedFontColor: string | undefined = undefined;
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
        selectedBackgroundColor,
        borderColor,
        disabledBorderColor,
        selectedBorderColor,
        hoverColor,
        disabledHoverColor,
        selectedHoverColor,
        fontColor,
        disabledFontColor,
        selectedFontColor,
        fontSize,
        fontWeight,
        imageWidth,
        imageHeight,
        imageRightPos,
        imageLeftPos,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let showToolTip: boolean = false;
    let showToolTipTimeout: ReturnType<typeof setTimeout> | null = null;
    let showToolTipDelayNumber: number;

    // Reactive Statements
    $: showToolTipDelayNumber = parseInt(String(mergedStyle.showToolTipDelay));

    // Click Export Function
    export let onClick: () => void;

    // Functions
    function handleClick(): void {
        if (onClick && enabled) {
            onClick();
        }
    }

    function handleMouseEnter(): void {
        if (enableToolTip) {
            showToolTipTimeout = setTimeout(() => {
                showToolTip = true;
            }, showToolTipDelayNumber);
        }
    }

    function handleMouseLeave(): void {
        if (enableToolTip) {
            if (showToolTipTimeout) {
                clearTimeout(showToolTipTimeout);
                showToolTipTimeout = null;
            }
            showToolTip = false;
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
        --selected-background-color: {mergedStyle.selectedBackgroundColor};
        --border-color: {mergedStyle.borderColor};
        --disabled-border-color: {mergedStyle.disabledBorderColor};
        --selected-border-color: {mergedStyle.selectedBorderColor};
        --hover-color: {mergedStyle.hoverColor};
        --disabled-hover-color: {mergedStyle.disabledHoverColor};
        --selected-hover-color: {mergedStyle.selectedHoverColor};
        --font-color: {mergedStyle.fontColor};
        --disabled-font-color: {mergedStyle.disabledFontColor};
        --selected-font-color: {mergedStyle.selectedFontColor};
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
    class:selected={enabled && selected}
    aria-label={buttonText}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
>
    {#if !processing}
        {#if buttonText}
            {buttonText}
        {/if}
        {#if imageURL}
            <img class:center={!buttonText} src={imageURL} alt={imageURL} />
        {/if}
    {:else}
        <svg class="loader" width={mergedStyle.imageWidth} height={mergedStyle.imageHeight} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4" />
        </svg>
    {/if}
    <ToolTip style={toolTipStyle} {showToolTip} autoPosition={toolTipAutoPos}>
        <slot name="tooltip" />
    </ToolTip>
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

    button.selected {
        background-color: var(--selected-background-color);
        border: 1px solid var(--selected-border-color);
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

    button.selected:hover {
        background-color: var(--selected-hover-color);
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

    /* Center the image on the button when there is no text */
    button img.center {
        left: 50%;
        transform: translate(-50%, -50%);
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
