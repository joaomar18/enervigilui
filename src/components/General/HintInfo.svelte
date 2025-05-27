<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    // Layout / styling props
    export let labelText: string = "";
    export let hintWidth: string;
    export let hintHeight: string;
    export let textColor: string;
    export let hintBackgroundColor: string;
    export let hintBorderColor: string = "transparent";
    export let hintBorderRadius: string = "0px";
    export let openBackgroundColor: string;
    export let openHoverBackgroundColor: string = openBackgroundColor;
    export let openStrokeColor: string;
    export let openHoverStrokeColor: string = openStrokeColor;

    export let closeBackgroundColor: string;
    export let closeHoverBackgroundColor: string = closeBackgroundColor;
    export let closeStrokeColor: string;
    export let closeHoverStrokeColor: string = closeStrokeColor;

    // Variables
    let hintOpened: boolean;
    let hintDiv: Node;
    let buttonEl: Node;

    // Functions
    function handleClickOutside(event: MouseEvent): void {
        if (
            hintOpened &&
            hintDiv &&
            buttonEl &&
            !hintDiv.contains(event.target as Node) &&
            !buttonEl.contains(event.target as Node)
        ) {
            hintOpened = false;
        }
    }

    function toogleHint(): void {
        hintOpened = !hintOpened;
    }

    onMount(() => {
        if (browser) {
            window.addEventListener("click", handleClickOutside);
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

<!-- 
  InfoHint: Interactive info component with toggleable hint box.
  - Displays a message with an icon.
  - On click, toggles between "info" and "close" icons.
  - Reveals a hint box with slotted content.
  - Fully customizable via props for size, colors, and border styles.
-->
<div class="info-div">
    <span style="--info-text-color:{textColor}" class="info-text">{labelText}</span>
    <div
        bind:this={hintDiv}
        class="hint-div"
        style="
            --hint-width: {hintWidth};
            --hint-height: {hintHeight};
            --hint-background-color: {hintBackgroundColor};
            --hint-border-color: {hintBorderColor};
            --hint-border-radius: {hintBorderRadius};
        "
        class:open={hintOpened}
    >
        <slot />
    </div>
    <button
        on:click={toogleHint}
        bind:this={buttonEl}
        aria-label="Show Hint"
        class:hint-opened={hintOpened}
    >
        <div
            class="hint-button"
            style="
                --open-background-color:{openBackgroundColor};
                --open-hover-background-color:{openHoverBackgroundColor};
                --open-stroke-color:{openStrokeColor};
                --open-hover-stroke-color: {openHoverStrokeColor};

                --close-background-color:{closeBackgroundColor};
                --close-hover-background-color:{closeHoverBackgroundColor};
                --close-stroke-color:{closeStrokeColor};
                --close-hover-stroke-color:{closeHoverStrokeColor};
            "
        >
            <div class="info-button-div" class:hide={hintOpened}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle class="info-circle" cx="12" cy="12" r="10" stroke-width="1.5" />

                    <circle class="i-dot" cx="12" cy="8" r="0.9" />

                    <line
                        class="i-line"
                        x1="12"
                        y1="11"
                        x2="12"
                        y2="16.5"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>
            </div>
            <div class="close-button-div" class:hide={!hintOpened}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle class="close-circle" cx="12" cy="12" r="10" stroke-width="1.5" />

                    <line
                        class="close-line"
                        x1="9"
                        y1="9"
                        x2="15"
                        y2="15"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                    <line
                        class="close-line"
                        x1="15"
                        y1="9"
                        x2="9"
                        y2="15"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>
            </div>
        </div>
    </button>
</div>

<style>
    /* Container holding warning text, icon button, and hint box */
    .info-div {
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: end;
        position: relative;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Info message */
    .info-text {
        width: max-content;
        color: var(--info-text-color);
        font-size: 1rem;
        padding-right: 5px;
    }

    /* Reset and style for the icon button */
    button {
        padding: 0;
        margin: 0;
        cursor: pointer;
        background-color: transparent;
        border: none;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Places button on front when hint is opened */
    button.hint-opened {
        z-index: 1;
    }

    button:hover {
        background-color: transparent;
    }

    /* Circle background for the "info" icon */
    .info-circle {
        fill: var(--open-background-color);
        stroke: var(--open-stroke-color);
    }

    /* Hover color adjustments for the "info" icon */
    button:hover .info-circle {
        fill: var(--open-hover-background-color, --open-background-color);
        stroke: var(--open-hover-stroke-color, --open-stroke-color);
    }

    /* Dot above the "i" inside the icon */
    .i-dot {
        fill: var(--open-stroke-color);
    }

    /* Dot color on hover */
    button:hover .i-dot {
        fill: var(--open-hover-stroke-color, --open-stroke-color);
    }

    /* Line of the "i" inside the icon */
    .i-line {
        stroke: var(--open-stroke-color);
    }

    /* Line hover color */
    button:hover .i-line {
        stroke: var(--open-hover-stroke-color, --open-stroke-color);
    }

    /* Circle background for the "close" icon */
    .close-circle {
        fill: var(--close-background-color);
        stroke: var(--close-stroke-color);
    }

    /* Hover colors for the "close" icon circle */
    button:hover .close-circle {
        fill: var(--close-hover-background-color, --close-background-color);
        stroke: var(--close-hover-stroke-color, --close-stroke-color);
    }

    /* X lines for the "close" icon */
    .close-line {
        stroke: var(--close-stroke-color, #ffffff);
    }

    /* X line color on hover */
    button:hover .close-line {
        stroke: var(--close-hover-stroke-color, --close-stroke-color);
    }

    /* Wrapper for the toggleable icons */
    .hint-button {
        height: fit-content;
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    /* Styles for the info icon */
    .info-button-div {
        height: 32px;
        width: 32px;
        margin: 0;
        padding: 0;
    }

    /* Styles for the close icon */
    .close-button-div {
        height: 32px;
        width: 32px;
        margin: 0;
        padding: 0;
    }

    /* Hidden hint message box */
    .hint-div {
        width: var(--hint-width);
        height: var(--hint-height);
        background-color: var(--hint-background-color);
        border: 1px solid var(--hint-border-color);
        border-radius: var(--hint-border-radius);
        position: absolute;
        top: 0px;
        max-width: 280px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        display: none;
        z-index: 1;
    }

    /* Display hint box when open */
    .hint-div.open {
        display: flex;
    }

    /* Hide info icon when box is open */
    .info-button-div.hide {
        display: none;
    }

    /* Hide close icon when box is closed */
    .close-button-div.hide {
        display: none;
    }
</style>
