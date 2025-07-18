<script lang="ts">
    import { fade } from "svelte/transition";

    // Layout / styling props
    export let topPos: string = "";
    export let bottomPos: string = "";
    export let pushTop: boolean = false; //push alert to top
    export let pushBottom: boolean = false; //push alert to bottom
    export let alertText: string;
    export let backgroundColor: string;
    export let borderColor: string = "transparent";
    export let textColor: string;

    // Variables
    $: transformY = pushTop ? "-100%" : pushBottom ? "100%" : "0%";

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
    Alert wrapper with customizable top/bottom positioning, colors and slide direction.
    Triggered via pushTop / pushBottom or directly with style bindings.
-->
<div
    class="alert-div"
    style="
        --top-position: {topPos};
        --bottom-position: {bottomPos};
        --background-color:{backgroundColor};
        --border-color:{borderColor};
        --transform-y: {transformY};
    "
    out:fade={{ duration: 300 }}
>
    <div class="content">
        <span class="alert-text" style="--text-color:{textColor};">{alertText}</span>
        <button class="close-button" on:click={handleClick} aria-label="Close Button">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
            >
                <line
                    class="close-button-line"
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke-width="1"
                    stroke-linecap="round"
                />
                <line
                    class="close-button-line"
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke-width="1"
                    stroke-linecap="round"
                />
            </svg>
        </button>
    </div>
</div>

<style>
    /* Root alert container */
    .alert-div {
        position: absolute;
        top: var(--top-position, auto);
        left: 50%;
        bottom: var(--bottom-position, auto);
        transform: translate(-50%, var(--transform-y));
        width: 90%;
        max-width: 500px;
        border-radius: 5px;
        height: fit-content;
        min-height: 50px;
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        z-index: 102;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Flex container for alert text and close button */
    .content {
        width: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
        -webkit-tap-highlight-color: transparent;
    }

    /* Main alert message */
    .alert-text {
        font-size: 1.1rem;
        color: var(--text-color);
        font-weight: 400;
        line-height: 1.5;
        padding: 10px;
        flex: 1;
        text-align: left;
        word-break: break-word;
    }

    /* Close button styling */
    .close-button {
        background-color: transparent;
        cursor: pointer;
        border: none;
        margin: 0;
        margin-top: 10px;
        margin-right: 10px;
        padding: 0;
        position: static;
        transform: none;
        display: flex;
        justify-content: center;
        align-items: center;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    .close-button:hover {
        background-color: transparent;
    }

    /* Cross ("X") line styling */
    .close-button-line {
        stroke: #f5f5f5;
    }

    /* Hover effect for the close icon */
    .close-button:hover .close-button-line {
        stroke: #bfbfbf;
    }
</style>
