<script lang="ts">
    // Layout / styling props
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

<div
    class="search-button-div"
    style="
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
        <button on:click={handleClick} aria-label="Open Search Button"></button>
    </div>
</div>

<style>
    /* Outer wrapper with configurable width and height */
    .search-button-div {
        position: relative;
        width: 40px;
        height: 40px;
        margin: 0;
        padding: 0;
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        cursor: pointer;
    }

    /* Hover effect for the outter div */
    .search-button-div:hover {
        background-color: var(--hover-color);
    }

    /* Internal content container */
    .content {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
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
        width: var(--image-width, 0px);
        height: var(--image-height, 0px);
    }
</style>
