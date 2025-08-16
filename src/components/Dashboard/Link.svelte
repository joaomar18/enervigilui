<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { LinkStyle } from "$lib/style/dashboard";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $LinkStyle;

    //Props
    export let selected: boolean = false;
    export let buttonText: string = "";
    export let imageURL: string = "";

    // Layout / styling props
    export let paddingLeft: string | undefined = undefined;
    export let paddingRight: string | undefined = undefined;
    export let paddingLeftText: string | undefined = undefined;
    export let imageWidth: string | undefined = undefined;
    export let imageHeight: string | undefined = undefined;
    export let fontSize: string | undefined = undefined;
    export let textColor: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let hoverColor: string | undefined = undefined;
    export let selectedColor: string | undefined = undefined;
    export let borderBottomColor: string | undefined = undefined;

    $: localOverrides = {
        paddingLeft,
        paddingRight,
        paddingLeftText,
        imageWidth,
        imageHeight,
        fontSize,
        textColor,
        backgroundColor,
        hoverColor,
        selectedColor,
        borderBottomColor,
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
  Link: Reusable button with optional image. Used for Dashboard Left Panel
-->
<div
    class="link-div"
    class:selected
    style="
        --background-color: {mergedStyle.backgroundColor};
        --hover-color: {mergedStyle.hoverColor};
        --selected-color: {mergedStyle.selectedColor};
        --padding-left: {mergedStyle.paddingLeft};
        --padding-right: {mergedStyle.paddingRight};
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
        <span
            style="
            --padding-left-text: {mergedStyle.paddingLeftText};
            --border-bottom-color: {mergedStyle.borderBottomColor};
            --font-size: {mergedStyle.fontSize};
            --text-color: {mergedStyle.textColor};
        ">{buttonText}</span
        >
        <button on:click={handleClick} aria-label="Link Button"></button>
    </div>
</div>

<style>
    /* Outer wrapper with configurable width and height */
    .link-div {
        position: relative;
        width: calc(100% - 40px);
        display: flex;
        align-items: center;
        margin: 0;
        padding: 10px;
        background-color: var(--background-color);
        padding-left: var(--padding-left);
        padding-right: var(--pading-right);
        border: none;
        background: none;
        text-align: left;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Hover effect for the outter div */
    .link-div:hover {
        background-color: var(--hover-color);
    }

    /* Background color when link is selected */
    .link-div.selected {
        background-color: var(--selected-color);
    }

    /* Internal content container */
    .content {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    /* Styled span acting as the main button body */
    span {
        box-sizing: border-box;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        width: max-content;
        margin: 0;
        padding-left: var(--padding-left-text);
        border-bottom: 1px solid var(--border-bottom-color);
        color: var(--text-color);
        font-size: var(--font-size);
        font-weight: 400;
        outline: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    /* Transparent overlay button for capturing clicks */
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

    /*  Optional positioned icon on the right side of the component */
    img {
        width: var(--image-width, 0px);
        height: var(--image-height, 0px);
    }
</style>
