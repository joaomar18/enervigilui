<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    // Props
    export let closeModal: boolean = false;
    export let openInverted: boolean = false;
    export let notValid: boolean = false;

    // Layout / styling props
    export let modalWidth: string;
    export let modalHeight: string;
    export let modalBackgroundColor: string;
    export let modalBorderColor: string = "transparent";
    export let modalBorderRadius: string = "0px";

    export let openBackgroundColor: string;
    export let openHoverBackgroundColor: string = openBackgroundColor;
    export let openStrokeColor: string;
    export let openHoverStrokeColor: string = openStrokeColor;

    export let closeBackgroundColor: string;
    export let closeHoverBackgroundColor: string = closeBackgroundColor;
    export let closeStrokeColor: string;
    export let closeHoverStrokeColor: string = closeStrokeColor;

    export let badFormatBackgroundColor: string = openBackgroundColor;
    export let badFormatHoverBackgroundColor: string = badFormatBackgroundColor;
    export let badFormatStrokeColor: string = openStrokeColor;
    export let badFormatHoverStrokeColor: string = badFormatStrokeColor;

    // Variables
    let modalOpened: boolean;
    let modalDiv: Node;
    let buttonEl: Node;

    // Functions
    $: if (closeModal) {
        modalOpened = false;
        closeModal = false;
    }

    function handleClickOutside(event: MouseEvent): void {
        if (modalOpened && modalDiv && buttonEl && !modalDiv.contains(event.target as Node) && !buttonEl.contains(event.target as Node)) {
            modalOpened = false;
        }
    }

    function toogleHint(): void {
        modalOpened = !modalOpened;
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
  ExpandableButton: Interactive expandable button component with toggleable modal.
  - Displays a three-dot icon that toggles to a close (X) icon when clicked.
  - On click, reveals/hides an expandable modal with slotted content.
  - Supports validation states with different color schemes.
  - Fully customizable via props for size, colors, border styles, and positioning.
  - Includes click-outside-to-close functionality.
-->
<div class="button-div">
    <div
        bind:this={modalDiv}
        class="modal-div"
        style="
            --modal-width: {modalWidth};
            --modal-height: {modalHeight};
            --modal-background-color: {modalBackgroundColor};
            --modal-border-color: {modalBorderColor};
            --modal-border-radius: {modalBorderRadius};
        "
        class:open={modalOpened}
        class:inverted={openInverted}
    >
        <slot />
    </div>
    <button on:click={toogleHint} bind:this={buttonEl} aria-label="Show Modal" class:modal-opened={modalOpened}>
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

                --bad-format-background-color:{badFormatBackgroundColor};
                --bad-format-hover-background-color: {badFormatHoverBackgroundColor};
                --bad-format-stroke-color: {badFormatStrokeColor};
                --bad-format-hover-stroke-color: {badFormatHoverStrokeColor};
            "
        >
            <div class="open-button-div" class:hide={modalOpened} class:not-valid={notValid}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle class="open-circle" class:not-valid={notValid} cx="12" cy="12" r="10" stroke-width="1.5" />
                    <circle class="dot" class:not-valid={notValid} cx="7" cy="12" r="1.5" />
                    <circle class="dot" class:not-valid={notValid} cx="12" cy="12" r="1.5" />
                    <circle class="dot" class:not-valid={notValid} cx="17" cy="12" r="1.5" />
                </svg>
            </div>
            <div class="close-button-div" class:hide={!modalOpened}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle class="close-circle" class:not-valid={notValid} cx="12" cy="12" r="10" stroke-width="1.5" />
                    <line class="close-line" class:not-valid={notValid} x1="9" y1="9" x2="15" y2="15" stroke-width="1.5" stroke-linecap="round" />
                    <line class="close-line" class:not-valid={notValid} x1="15" y1="9" x2="9" y2="15" stroke-width="1.5" stroke-linecap="round" />
                </svg>
            </div>
        </div>
    </button>
</div>

<style>
    /* Container for expandable button and modal - flexbox layout with relative positioning for modal placement */
    .button-div {
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: end;
        position: relative;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
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

    /* Places button on front when modal is opened */
    button.modal-opened {
        z-index: 1;
    }

    button:hover {
        background-color: transparent;
    }

    /* Circle background for the open icon */
    .open-circle {
        fill: var(--open-background-color);
        stroke: var(--open-stroke-color);
    }

    /* Color adjustments for the open icon when not valid */
    .open-circle.not-valid {
        fill: var(--bad-format-background-color);
        stroke: var(--bad-format-stroke-color);
    }

    /* Hover color adjustments for the open icon */
    button:hover .open-circle {
        fill: var(--open-hover-background-color, --open-background-color);
        stroke: var(--open-hover-stroke-color, --open-stroke-color);
    }

    /* Hover color adjustments for the open icon when not valid */
    button:hover .open-circle.not-valid {
        fill: var(--bad-format-hover-background-color);
        stroke: var(--bad-format-hover-stroke-color);
    }

    /* Dot inside the icon */
    .dot {
        fill: var(--open-stroke-color);
    }

    /* Dot inside the icon not valid */
    .dot.not-valid {
        fill: var(--bad-format-stroke-color);
    }

    /* Dot color on hover */
    button:hover .dot {
        fill: var(--open-hover-stroke-color, --open-stroke-color);
    }

    /* Dot cover on hover not valid */
    button:hover .dot.not-valid {
        fill: var(--bad-format-hover-stroke-color);
    }

    /* Circle background for the "close" icon */
    .close-circle {
        fill: var(--close-background-color);
        stroke: var(--close-stroke-color);
    }

    /* Circle background fdor the "close" icon not valid */
    .close-circle.not-valid {
        fill: var(--bad-format-background-color);
        stroke: var(--bad-format-stroke-color);
    }

    /* Hover colors for the "close" icon circle */
    button:hover .close-circle {
        fill: var(--close-hover-background-color, --close-background-color);
        stroke: var(--close-hover-stroke-color, --close-stroke-color);
    }

    /* Hover colors for the "close" icon circle not valid */
    button:hover .close-circle.not-valid {
        fill: var(--bad-format-hover-background-color);
        stroke: var(--bad-format-hover-stroke-color);
    }

    /* X lines for the "close" icon */
    .close-line {
        stroke: var(--close-stroke-color, #ffffff);
    }

    /* X line color on not valid */
    .close-line.not-valid {
        stroke: var(--bad-format-stroke-color);
    }

    /* X line color on hover */
    button:hover .close-line {
        stroke: var(--close-hover-stroke-color, --close-stroke-color);
    }

    /* X line color on hover not valid */
    button:hover .close-line.not-valid {
        stroke: var(--bad-format-hover-stroke-color);
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
    .open-button-div {
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
    .modal-div {
        width: var(--modal-width);
        height: var(--modal-height);
        background-color: var(--modal-background-color);
        border: 1px solid var(--modal-border-color);
        border-radius: var(--modal-border-radius);
        position: absolute;
        top: 0px;
        max-width: 280px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        display: none;
        z-index: 1;
    }

    /* Open hint message from bottom to top (inverted) */
    .modal-div.inverted {
        top: auto;
        bottom: 0px;
    }

    /* Display hint box when open */
    .modal-div.open {
        display: flex;
    }

    /* Hide info icon when box is open */
    .open-button-div.hide {
        display: none;
    }

    /* Hide close icon when box is closed */
    .close-button-div.hide {
        display: none;
    }
</style>
