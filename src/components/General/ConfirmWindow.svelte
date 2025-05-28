<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, onDestroy, tick } from "svelte";

    // Layout / styling props
    export let title: string = "";
    export let width: string;
    export let minWidth: string = width;
    export let maxWidth: string = width;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = "transparent";
    export let titleSize: string = "1rem";
    export let titleColor: string = "#f5f5f5";
    export let titleWeight: string = "400";

    //Variables
    let containerEl: HTMLElement;

    // Close Window Export Funcion
    export let closeWindow: () => void;

    // Functions
    function handleClickOutside(event: MouseEvent): void {
        if (containerEl && !containerEl.contains(event.target as HTMLElement)) {
            if (closeWindow) {
                closeWindow();
            }
        }
    }

    onMount(() => {
        if (browser) {
            requestAnimationFrame(() => {
                window.addEventListener("click", handleClickOutside);
            });
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

<!--
  ConfirmWindow component

  A customizable modal window with a title, close button, and slot for content.
-->
<div
    style="
        --width: {width};
        --min-width: {minWidth};
        --max-width: {maxWidth};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --title-size: {titleSize};
        --title-color: {titleColor};
        --title-weight: {titleWeight};
    "
    class="container"
    bind:this={containerEl}
>
    <div class="content">
        <div class="header-div">
            <h3>{title}</h3>
            <button class="close-button" on:click={closeWindow} aria-label="Close Window">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke=""
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                </svg></button
            >
        </div>
        <div class="content-div">
            <slot />
        </div>
    </div>
</div>

<style>
    /* Container: modal window box */
    .container {
        width: var(--width);
        min-width: var(--min-width);
        max-width: var(--max-width);
        height: var(--height);
        border-radius: var(--border-radius);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Content: flex column layout for header and content */
    .content {
        padding: 0;
        margin: 0;
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
    }

    /* Header: title and close button row */
    .header-div {
        margin: 0;
        padding: 0;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--border-color);
    }

    /* Title styles */
    .header-div h3 {
        margin: 0;
        padding: 15px;
        padding-right: 50px;
        line-height: 1.5;
        text-wrap: wrap;
        font-size: var(--title-size);
        color: var(--title-color);
        font-weight: var(--title-weight);
    }

    /* Close button styles */
    .header-div .close-button {
        margin: 0;
        padding: 0;
        padding-right: 15px;
        width: 40px;
        height: 40px;
        background-color: transparent;
        border: none;
        color: var(--title-color);
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* SVG icon for close button */
    .header-div .close-button svg {
        stroke: #888;
        transition: stroke 0.2s ease;
    }

    /* Close button hover effect */
    .header-div .close-button:hover svg {
        stroke: var(--title-color);
    }

    /* Content area: fills remaining space */
    .content-div {
        width: 100%;
        box-sizing: border-box;
        flex: 1 1 auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
</style>
