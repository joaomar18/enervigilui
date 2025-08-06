<script lang="ts">
    //Props
    export let enabled: boolean = true;
    export let processing: boolean = false;

    // Layout / styling props
    export let buttonText: string;
    export let width: string;
    export let minWidth: string = "";
    export let maxWidth: string = "";
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let disabledBackgroundColor: string = backgroundColor;
    export let borderColor: string = "transparent";
    export let disabledBorderColor: string = borderColor;
    export let hoverColor: string = backgroundColor;
    export let disabledHoverColor: string = hoverColor;
    export let fontColor: string;
    export let disabledFontColor: string = fontColor;
    export let fontSize: string = "1rem";
    export let fontWeight: string = "400";
    export let imageURL: string = "";
    export let imageWidth: string = "";
    export let imageHeight: string = "";
    export let imageRightPos: string = "auto";
    export let imageLeftPos: string = "auto";

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
        --width: {width};
        --min-width: {minWidth};
        --max-width: {maxWidth};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --disabled-background-color: {disabledBackgroundColor};
        --border-color: {borderColor};
        --disabled-border-color: {disabledBorderColor};
        --hover-color: {hoverColor};
        --disabled-hover-color: {disabledHoverColor};
        --font-color: {fontColor};
        --disabled-font-color: {disabledFontColor};
        --font-size: {fontSize};
        --font-weight: {fontWeight};
        --image-width: {imageWidth};
        --image-height: {imageHeight};
        --image-right-position: {imageRightPos};
        --image-left-position: {imageLeftPos};
    "
    class:align-left={imageRightPos != "auto" && !processing}
    class:align-right={imageLeftPos != "auto" && !processing}
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
        <svg class="loader" width={imageWidth} height={imageHeight} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
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
