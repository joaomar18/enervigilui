<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { SlottedActionStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $SlottedActionStyle;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let hoverColor: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        borderRadius,
        backgroundColor,
        borderColor,
        hoverColor,
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
  Action Button: Reusable clickable component with text and optional image.  
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
        <div class="slot-div">
            <slot />
        </div>
        <button on:click={handleClick} aria-label="Action Button"></button>
    </div>
</div>

<style>
    /* Wrapper: size, shape, and base look */
    .action-button-div {
        box-sizing: border-box;
        width: var(--width);
        height: var(--height);
        margin: 0;
        padding: 0;
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        transform-origin: center;
        -webkit-font-smoothing: antialiased;
        shape-rendering: geometricPrecision;
    }

    /* Hover state: visual feedback on pointer-over */
    .action-button-div:hover {
        background-color: var(--hover-color);
    }

    /* Content container: centers icon or label */
    .content {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
    }

    /* Slotted content container */
    .content .slot-div{
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
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
</style>
