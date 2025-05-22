<script lang="ts">
    // Layout / styling props
    export let buttonText: string;
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = "transparent";
    export let hoverColor: string = backgroundColor;
    export let fontSize: string = "1rem";
    export let fontColor: string;
    export let fontWeight: string = "300";
    export let imageURL: string = "";
    export let imageWidth: string = "";
    export let imageHeight: string = "";
    export let imageRightPos: string = "auto";
    export let imageLeftPos: string = "auto";

    // Click Export Funcion
    export let onClick: () => void;

    // Functions
    function handleClick(): void {
        if (onClick) {
            onClick();
        }
    }
</script>

<!--
  Action button component:
  - Styled via CSS variables for size, colors, typography, and icon positioning.
  - Supports optional icon on left or right.
  - Fires `handleClick` on click, with accessible `aria-label`.
-->
<button
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --hover-color: {hoverColor};
        --font-size: {fontSize};
        --font-color: {fontColor};
        --font-weight: {fontWeight};
        --image-width: {imageWidth};
        --image-height: {imageHeight};
        --image-right-position: {imageRightPos};
        --image-left-position: {imageLeftPos};
    "
    class:align-left={imageRightPos != "auto"}
    class:align-right={imageLeftPos != "auto"}
    aria-label={buttonText}
    on:click={handleClick}
>
    {buttonText}
    {#if imageURL}
        <img src={imageURL} alt={imageURL} />
    {/if}
</button>

<style>
    /* Base styling for the action button */
    button {
        margin: 0;
        padding: 0;
        position: relative;
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius, 0px);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: var(--font-size);
        color: var(--font-color);
        font-weight: var(--font-weight);
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    /* When icon is on the left: text aligns left and padding makes room */
    button.align-left {
        text-align: left;
        padding-left: var(--image-right-position);
    }

    /* When icon is on the right: text aligns right and padding makes room */
    button.align-right {
        text-align: right;
        padding-right: var(--image-left-position);
    }

    /* Hover state: lighten or change background */
    button:hover {
        background-color: var(--hover-color);
    }

    /* Icon inside button: size and center vertically */
    button img {
        width: var(--image-width);
        height: var(--image-height);
        position: absolute;
        top: 50%;
        left: var(--image-left-position);
        right: var(--image-right-position);
        transform: translateY(-50%);
    }
</style>
