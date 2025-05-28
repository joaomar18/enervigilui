<script lang="ts">
    //Props
    export let selected: boolean = false;

    // Layout / styling props
    export let paddingLeft: string = "0px";
    export let paddingRight: string = "0px";
    export let paddingLeftText: string = "0px";
    export let buttonText: string = "";
    export let imageURL: string = "";
    export let imageWidth: string = "";
    export let imageHeight: string = "";
    export let fontSize: string = "1rem";
    export let backgroundColor: string = "#252b33";
    export let hoverColor: string = "#323a45";
    export let selectedColor: string = backgroundColor;
    export let borderBottomColor: string = "transparent";

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
        --background-color: {backgroundColor};
        --hover-color: {hoverColor};
        --selected-color: {selectedColor};
        --padding-left: {paddingLeft};
        --padding-right: {paddingRight};
    "
>
    <div class="content">
        {#if imageWidth && imageHeight}
            <img
                style="
            --image-width: {imageWidth};
            --image-height: {imageHeight};
        "
                src={imageURL}
                alt={imageURL}
            />
        {/if}
        <span
            style="
            --padding-left-text: {paddingLeftText};
            --border-bottom-color: {borderBottomColor};
            --font-size: {fontSize};
            
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
        color: #ddd;
        font-size: 16px;
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
        color: #eeeeee;
        font-size: var(--font-size, 1rem);
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
