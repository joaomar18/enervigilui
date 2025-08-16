<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { LogoutStyle } from "$lib/style/dashboard";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $LogoutStyle;

    // Props
    export let buttonText: string;
    export let imageUrl: string | undefined = undefined;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let hoverColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let fontSize: string | undefined = undefined;
    export let paddingLeft: string | undefined = undefined;
    export let paddingRight: string | undefined = undefined;
    export let paddingLeftText: string | undefined = undefined;
    export let imageWidth: string | undefined = undefined;
    export let imageHeight: string | undefined = undefined;
    export let textColor: string | undefined = undefined;
    export let textWeight: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        borderRadius,
        backgroundColor,
        hoverColor,
        borderColor,
        fontSize,
        paddingLeft,
        paddingRight,
        paddingLeftText,
        imageWidth,
        imageHeight,
        textColor,
        textWeight,
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
  Logout Button: Pill-shaped button with optional icon and label.  
-->
<div
    style="
        --width: {mergedStyle.width};
        --height: {mergedStyle.height};
        --border-radius: {mergedStyle.borderRadius};
        --background-color: {mergedStyle.backgroundColor};
        --hover-color: {mergedStyle.hoverColor};
        --border-color: {mergedStyle.borderColor};
    "
    class="container"
>
    <div
        style="
        --padding-left: {mergedStyle.paddingLeft}; 
        --padding-right: {mergedStyle.paddingRight};
    "
        class="content"
    >
        {#if imageUrl}
            <img
                style="
            --image-width: {mergedStyle.imageWidth};
            --image-height: {mergedStyle.imageHeight};
        "
                src={imageUrl}
                alt={imageUrl}
            />
        {/if}
        <div class="text-div">
            <span
                style="
                --font-size: {mergedStyle.fontSize};
                --padding-left-text: {mergedStyle.paddingLeftText};
                --text-color: {mergedStyle.textColor};
                --text-weight: {mergedStyle.textWeight};
            ">{buttonText}</span
            >
        </div>
        <button on:click={handleClick} aria-label="Action Button"></button>
    </div>
</div>

<style>
    /* Container: size, shape, colors, and click cursor */
    .container {
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius, 0px);
        right: 20px;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Hover state: visual feedback on pointer-over */
    .container:hover {
        background-color: var(--hover-color);
    }

    /* Content wrapper: horizontal layout and padding */
    .content {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: var(--padding-left, 0px);
        padding-right: var(--padding-right, 0px);
        justify-content: flex-start;
        -webkit-tap-highlight-color: transparent;
    }

    /* Text container: centers the label */
    .text-div {
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Label: font sizing and padding */
    span {
        box-sizing: border-box;
        display: inline-block;
        line-height: 100%;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        width: max-content;
        margin: 0;
        padding-left: var(--padding-left-text, 0px);
        color: var(--text-color);
        font-size: var(--font-size, 1rem);
        font-weight: var(--text-weight);
        outline: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    /* Icon sizing: controlled by CSS variables */
    img {
        width: var(--image-width);
        height: var(--image-height);
    }

    /* Invisible overlay button: captures clicks over entire area */
    button {
        position: absolute;
        width: 100%;
        height: 100%;
        border: none;
        left: 0;
        top: 0;
        padding: 0;
        margin: 0;
        opacity: 0;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Tablet breakpoint: collapse text, same width and height container */
    @media (max-width: 559px) {
        .container {
            width: var(--height);
        }

        .content {
            justify-content: center;
            padding: 0;
        }

        .text-div {
            display: none;
        }
    }
</style>
