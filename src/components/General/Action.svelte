<script lang="ts">
    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
    export let hoverColor: string = backgroundColor;
    export let imageURL: string = "";
    export let imageWidth: string = "";
    export let imageHeight: string = "";

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
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --hover-color: {hoverColor};
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
        border-radius: var(--border-radius, 0px);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
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
