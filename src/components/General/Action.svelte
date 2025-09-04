<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { ActionStyle } from "$lib/style/general";

    // Props
    export let imageURL: string = "";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $ActionStyle;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let hoverColor: string | undefined = undefined;
    export let imageWidth: string | undefined = undefined;
    export let imageHeight: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        borderRadius,
        backgroundColor,
        borderColor,
        hoverColor,
        imageWidth,
        imageHeight,
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

<!-- 
  Action Button: Reusable clickable component with optional image.  
-->
<div
    class="action-button-div"
    style="
        --width: {mergedStyle.width};
        --height: {mergedStyle.height};
        --border-radius: {mergedStyle.borderRadius};
        --background-color: {mergedStyle.backgroundColor};
        --border-color: {mergedStyle.borderColor};
        --hover-color: {mergedStyle.hoverColor};
    "
>
    <div class="content">
        {#if mergedStyle.imageWidth && mergedStyle.imageHeight}
            <img
                style="
            --image-width: {mergedStyle.imageWidth};
            --image-height: {mergedStyle.imageHeight};
        "
                src={imageURL}
                alt={imageURL}
            />
        {/if}
        <button on:click={handleClick} aria-label="Action Button"></button>
    </div>
</div>

<style>
    /* Wrapper: size, shape, and base look */
    .action-button-div {
        box-sizing: border-box;
        position: relative;
        width: var(--width);
        height: var(--height);
        margin: 0;
        padding: 0;
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
        transform-origin: center;
        -webkit-font-smoothing: antialiased;
    }

    /* Hover state: visual feedback on pointer-over */
    .action-button-div:hover {
        background-color: var(--hover-color);
    }

    /* Content container: centers icon or label */
    .content {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
    }

    /* Invisible overlay button: captures clicks */
    button {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        padding: 0;
        margin: 0;
        opacity: 0;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Icon sizing: driven by CSS variables */
    img {
        width: var(--image-width, 0px);
        height: var(--image-height, 0px);
    }
</style>
