<script lang="ts">
    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let hoverColor: string = backgroundColor;
    export let borderColor: string = backgroundColor;
    export let buttonText: string;
    export let fontSize: string = "";
    export let paddingLeft: string = "";
    export let paddingRight: string = "";
    export let paddingLeftText: string = "";
    export let imageUrl: string | undefined = undefined;
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
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --hover-color: {hoverColor};
        --border-color: {borderColor};
    "
    class="container"
>
    <div
        style="
        --padding-left: {paddingLeft}; 
        --padding-right: {paddingRight};
    "
        class="content"
    >
        {#if imageUrl}
            <img
                style="
            --image-width: {imageWidth};
            --image-height: {imageHeight};
        "
                src={imageUrl}
                alt={imageUrl}
            />
        {/if}
        <div class="text-div">
            <span
                style="
                --font-size: {fontSize};
                --padding-left-text: {paddingLeftText};
            ">{buttonText}</span
            >
        </div>
        <button on:click={handleClick} aria-label="Action Button"></button>
    </div>
</div>

<style>
    .container {
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius, 0px);
        right: 20px;
        border-radius: 25px;
        cursor: pointer;
    }

    .container:hover {
        background-color: var(--hover-color);
    }

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
    }

    .text-div {
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    span {
        box-sizing: border-box;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        width: max-content;
        margin: 0;
        padding-left: var(--padding-left-text, 0px);
        color: #eeeeee;
        font-size: var(--font-size, 1rem);
        font-weight: 400;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        outline: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    img {
        width: var(--image-width);
        height: var(--image-height);
    }

    button {
        position: absolute;
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        left: 0;
        top: 0;
        padding: 0;
        margin: 0;
        cursor: pointer;
    }

    button:hover {
        background: transparent;
    }
</style>
