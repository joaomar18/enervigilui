<script lang="ts">
    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Props
    export let processing: boolean; //Login is being processed

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let paddingTop: string = "0px";
    export let paddingBottom: string = "0px";
    export let backgroundColor: string;
    export let processingBackgroundColor: string = backgroundColor;
    export let hoverColor: string = backgroundColor;

    // Click Export Funcion
    export let onClick: () => void;

    // Functions
    function handleClick(): void {
        if (!processing && onClick) {
            onClick();
        }
    }
</script>

<!-- 
  LoginButton: Displays a customizable login button with dynamic size and colors.
  Emits a "click" event when clicked.
-->
<div
    style="
        --padding-top:{paddingTop};
        --padding-bottom:{paddingBottom};
    "
>
    <button
        style="
            --width:{width}; 
            --height:{height};
            --background-color:{backgroundColor};
            --processing-background-color:{processingBackgroundColor};
            --hover-color:{hoverColor};
        "
        on:click={handleClick}
        class:processing
    >
        {#if !processing}
            {$texts.login[$selectedLang]}
        {:else}
            <svg
                class="loader"
                width="24"
                height="24"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4" />
            </svg>
        {/if}
    </button>
</div>

<style>
    /* Wrapper with configurable vertical spacing */
    div {
        padding-top: var(--padding-top, 0px);
        padding-bottom: var(--padding-bottom, 0px);
    }

    /* Button appearance and color (default) */
    button {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        box-sizing: content-box;
        color: rgb(255, 255, 255);
        background-color: var(--background-color);
        width: var(--width, "fit-content");
        height: var(--height, "fit-content");
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        font-size: 1.25rem;
        cursor: pointer;
    }

    /* Button color when login is processing */
    button.processing {
        background-color: var(--processing-background-color);
        cursor: auto;
    }

    /* Button background color on hover */
    button:hover {
        background-color: var(--hover-color);
    }

    /* Disable hover background color when processing */
    button.processing:hover {
        background-color: var(--processing-background-color);
    }

    .loader {
        animation: rotate 1s linear infinite;
        transform-origin: center;
    }

    .path {
        stroke: white;
        stroke-linecap: butt;
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
    }

    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }
</style>
