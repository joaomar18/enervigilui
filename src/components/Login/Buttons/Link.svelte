<script lang="ts">
    // Layout / styling props
    export let width: string = "";
    export let height: string = "";
    export let paddingLeft: string = "0px";
    export let paddingRight: string = "0px";
    export let buttonText: string = "";
    export let imageURL: string = "";
    export let imageWidth: string = "";
    export let imageHeight: string = "";
    export let imageRightPosition: string = "20px";
    export let fontSize: string = "1rem";
    export let backgroundColor: string = "#252b33";
    export let hoverColor: string = "#323a45";
    export let borderBottomColor: string = "transparent";

    export let onClick: () => void;

    // Functions
    const isPercent = (val: string) => typeof val === "string" && val.trim().endsWith("%");

    function handleClick(): void {
        if (onClick) {
            onClick();
        }
    }
</script>

<!-- 
  Link: Reusable button with optional image. Adapts layout based on width/height units.
-->
<div
    class="link-div"
    style="
        --div-width: {isPercent(width) ? width : 'fit-content'};
        --div-height: {isPercent(height) ? height : 'fit-content'};
        --background-color: {backgroundColor};
        --hover-color: {hoverColor};
    "
>
    <div class="content">
        <span
            style="
            --span-width: {!isPercent(width) ? width : '100%'};
            --span-height: {!isPercent(height) ? height : '100%'};
            --padding-left: {paddingLeft};
            --padding-right: {paddingRight};
            --border-bottom-color: {borderBottomColor};
            --font-size: {fontSize};
            
        ">{buttonText}</span
        >
        {#if imageWidth && imageHeight}
            <img
                style="
                --image-width: {imageWidth};
                --image-height: {imageHeight};
                --image-right: {imageRightPosition};
            "
                src={imageURL}
                alt={imageURL}
            />
        {/if}
        <button on:click={handleClick} aria-label="Link Button"></button>
    </div>
</div>

<style>
    /* Outer wrapper with configurable width and height */
    .link-div {
        position: relative;
        width: var(--div-width);
        height: var(--div-height);
    }

    /* Internal content container */
    .content {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    /* Hover effect for the span background */
    .content:hover span {
        background-color: var(--hover-color);
    }

    /* Styled span acting as the main button body */
    span {
        box-sizing: border-box;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        margin: 0;
        padding: 0;
        padding-left: var(--padding-left);
        padding-right: var(--padding-right);
        width: var(--span-width);
        height: var(--span-height);
        background-color: var(--background-color);
        border-bottom: 1px solid var(--border-bottom-color);
        color: #eeeeee;
        font-size: var(--font-size, 1rem);
        font-weight: 400;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
    }

    /*  Optional positioned icon on the right side of the component */
    img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: var(--image-width, 0px);
        height: var(--image-height, 0px);
        right: var(--image-right, 0px);
    }
</style>
