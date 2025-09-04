<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { LinkStyle } from "$lib/style/dashboard";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $LinkStyle;

    //Props
    export let selected: boolean = false;
    export let showExpandArrow: boolean = false;
    export let triggerExpand: boolean = false;
    export let buttonText: string = "";
    export let imageURL: string = "";

    // Layout / styling props
    export let height: string | undefined = undefined;
    export let paddingLeft: string | undefined = undefined;
    export let paddingRight: string | undefined = undefined;
    export let paddingLeftText: string | undefined = undefined;
    export let imageWidth: string | undefined = undefined;
    export let imageHeight: string | undefined = undefined;
    export let arrowImageWidth: string | undefined = undefined;
    export let arrowImageHeight: string | undefined = undefined;
    export let fontSize: string | undefined = undefined;
    export let textColor: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let hoverColor: string | undefined = undefined;
    export let selectedColor: string | undefined = undefined;
    export let selectedHoverColor: string | undefined = undefined;
    export let borderBottomColor: string | undefined = undefined;
    export let arrowBackgroundColor: string | undefined = undefined;
    export let arrowHoverColor: string | undefined = undefined;
    export let arrowSelectedColor: string | undefined = undefined;
    export let arrowSelectedHoverColor: string | undefined = undefined;
    export let arrowLeftBorderColor: string | undefined = undefined;
    export let subContentBorderColor: string | undefined = undefined;

    $: localOverrides = {
        height,
        paddingLeft,
        paddingRight,
        paddingLeftText,
        imageWidth,
        imageHeight,
        arrowImageWidth,
        arrowImageHeight,
        fontSize,
        textColor,
        backgroundColor,
        hoverColor,
        selectedColor,
        selectedHoverColor,
        borderBottomColor,
        arrowBackgroundColor,
        arrowHoverColor,
        arrowSelectedColor,
        arrowSelectedHoverColor,
        arrowLeftBorderColor,
        subContentBorderColor,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let isOpen: boolean = false;
    let triggerExpandSet: boolean = false;

    // Reactive Statements

    $: if (!showExpandArrow) isOpen = false;

    $: if (triggerExpand && !triggerExpandSet) {
        isOpen = true;
        triggerExpandSet = true;
    }

    $: if (!triggerExpand) triggerExpandSet = false;

    // Click Export Funcion
    export let onClick: () => void;

    // Functions
    function handleClick(): void {
        if (onClick) {
            onClick();
        }
    }

    function toogleIsOpen(): void {
        isOpen = !isOpen;
    }
</script>

<!-- 
  Link: Reusable button with optional image. Used for Dashboard Left Panel
-->
<div
    class="link-div"
    style="
        --height: {mergedStyle.height};
        --background-color: {mergedStyle.backgroundColor};
        --hover-color: {mergedStyle.hoverColor};
        --selected-color: {mergedStyle.selectedColor};
        --selected-hover-color: {mergedStyle.selectedHoverColor};
        --padding-left: {mergedStyle.paddingLeft};
        --padding-right: {mergedStyle.paddingRight};
        --image-width: {mergedStyle.imageWidth};
        --image-height: {mergedStyle.imageHeight};
        --arrow-image-width: {mergedStyle.arrowImageWidth};
        --arrow-image-height: {mergedStyle.arrowImageHeight};
        --padding-left-text: {mergedStyle.paddingLeftText};
        --border-bottom-color: {mergedStyle.borderBottomColor};
        --arrow-background-color: {mergedStyle.arrowBackgroundColor};
        --arrow-hover-color: {mergedStyle.arrowHoverColor};
        --arrow-selected-color: {mergedStyle.arrowSelectedColor};
        --arrow-selected-hover-color: {mergedStyle.arrowSelectedHoverColor};
        --arrow-left-border-color: {mergedStyle.arrowLeftBorderColor};
        --sub-content-border-color: {mergedStyle.subContentBorderColor};
        --font-size: {mergedStyle.fontSize};
        --text-color: {mergedStyle.textColor};
    "
>
    <div class="content">
        <div class="main-content">
            <div class="main-link-div" class:selected class:no-right-side-border={showExpandArrow}>
                {#if imageURL}
                    <img src={imageURL} alt={imageURL} />
                {/if}
                <span>{buttonText}</span>
                <button on:click={handleClick} aria-label="Link button"></button>
            </div>
            {#if showExpandArrow}
                <div class="arrow-div" class:selected>
                    <div class="line"></div>
                    <img class="arrow" src={isOpen ? "/img/up-arrow.svg" : "/img/down-arrow.svg"} alt={isOpen ? "up-arrow" : "down-arrow"} />
                    <button on:click={toogleIsOpen} aria-label="Toogle sub content button"></button>
                </div>
            {/if}
        </div>
        <div class="sub-content" class:closed={!isOpen}>
            <slot />
        </div>
    </div>
</div>

<style>
    /* Outer wrapper with configurable width and height */
    .link-div {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: fit-content;
        display: flex;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Internal content container */
    .content {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }

    /* Main content for main link */
    .main-content {
        margin: 0;
        padding: 0;
        width: 100%;
        height: var(--height);
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    /* Main link container (Link, Image and Main Button) */
    .main-link-div {
        position: relative;
        margin: 0;
        padding: 0;
        border-radius: 4px;
        padding-left: var(--padding-left);
        padding-right: var(--pading-right);
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        flex-grow: 1;
        height: 100%;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        background-color: var(--background-color);
        transition: background 0.2s;
    }

    /* Main link container has arrow on the right (remove right side border) */
    .main-link-div.no-right-side-border {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
    }

    /* Hover effect for the main link div */
    .main-link-div:hover {
        background-color: var(--hover-color);
    }

    /* Main link div color when link is selected */
    .main-link-div.selected {
        background-color: var(--selected-color);
    }

    /* Main link div color when link is selected and hovered */
    .main-link-div.selected:hover {
        background-color: var(--selected-hover-color);
    }

    /* Div for arrow button to acess sub-sections of the Link */
    .arrow-div {
        position: relative;
        margin: 0;
        padding: 0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        width: 32px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--arrow-background-color);
        transition: background 0.2s;
    }

    /* Arrow div background color on hover */
    .arrow-div:hover {
        background-color: var(--arrow-hover-color);
    }

    /* Arrow div background color when link is selected */
    .arrow-div.selected {
        background-color: var(--arrow-selected-color);
    }

    /* Arrow div background color on hover when link is selected */
    .arrow-div.selected:hover {
        background-color: var(--arrow-selected-hover-color);
    }

    /* Line to separate main link from arrow */
    .arrow-div .line {
        position: absolute;
        left: 0;
        border-left: 1px solid var(--arrow-left-border-color);
        height: 36px;
    }

    /* Sub content for sub-section links */
    .sub-content {
        position: relative;
        padding: 0;
        margin: 0;
        width: 100%;
        height: fit-content;
        overflow: hidden;
        border: 1px solid var(--sub-content-border-color);
        border-top-color: transparent;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    /* Close sub-content */
    .sub-content.closed {
        display: none;
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

    /* Optional arrow if link has sub-sections */
    img.arrow {
        width: var(--arrow-image-width, 0px);
        height: var(--arrow-image-height, 0px);
    }
</style>
