<script lang="ts">
    import { tick } from "svelte";
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";
    import Action from "./Action.svelte";

    //Props
    export let text: string;

    // Layout / styling props
    export let fontSize: string = "1rem";
    export let fontColor: string;
    export let borderColorBottom: string;
    export let buttonImageWidth: string;
    export let buttonImageHeight: string;

    //Variables
    let enableInput: boolean = false;
    let previousText: string;
    let containerEl: Node;
    let inputEl: HTMLInputElement;

    //Functions
    function activeInput(): void {
        enableInput = true;
        previousText = text;
        tick().then(() => {
            inputEl.focus();
        });
    }

    function cancelInput(): void {
        text = previousText;
        enableInput = false;
    }

    function confirmInput(): void {
        enableInput = false;
    }

    function handleClickOutside(event: MouseEvent): void {
        if (containerEl && !containerEl.contains(event.target as Node)) {
            enableInput = false;
        }
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

<!-- Inline-edit field: click pencil to enter edit mode, press Enter or check to save, Esc or arrow to cancel -->
<div
    style="
        --font-size: {fontSize};
        --font-color: {fontColor};
        --border-color-bottom: {borderColorBottom};
        --button-image-width: {buttonImageWidth};
        --button-image-height: {buttonImageHeight};
    "
    class="container"
    bind:this={containerEl}
>
    <input
        class="editable-text"
        class:enable={enableInput}
        type="text"
        bind:this={inputEl}
        bind:value={text}
        on:keydown={(e) => {
            if (e.key === "Enter") confirmInput();
            else if (e.key === "Escape") cancelInput();
        }}
        disabled={!enableInput}
    />
    <div class="button-div edit-button-div" class:hide={enableInput}>
        <Action
            width="40px"
            height="40px"
            borderRadius="20px"
            backgroundColor="transparent"
            borderColor="transparent"
            hoverColor="#2A2E3A"
            imageURL="/img/edit_pencil.png"
            imageWidth={buttonImageWidth}
            imageHeight={buttonImageHeight}
            onClick={activeInput}
        />
    </div>
    <div class="button-div confirm-button-div" class:hide={!enableInput}>
        <Action
            width="40px"
            height="40px"
            borderRadius="20px"
            backgroundColor="transparent"
            borderColor="transparent"
            hoverColor="#2A2E3A"
            imageURL="/img/accept.png"
            imageWidth={buttonImageWidth}
            imageHeight={buttonImageHeight}
            onClick={confirmInput}
        />
    </div>
    <div class="button-div cancel-button-div" class:hide={!enableInput}>
        <Action
            width="40px"
            height="40px"
            borderRadius="20px"
            backgroundColor="transparent"
            borderColor="transparent"
            hoverColor="#2A2E3A"
            imageURL="/img/previous.png"
            imageWidth={buttonImageWidth}
            imageHeight={buttonImageHeight}
            onClick={cancelInput}
        />
    </div>
</div>

<style>
    /* Flex container to center input and buttons */
    .container {
        position: relative;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Base styling for the text field */
    .editable-text {
        padding: 0;
        margin: 0;
        background: none;
        border: none;
        text-align: center;
        font-size: var(--font-size);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: var(--font-color);
    }

    /* When editing is active: add underline and remove default outline */
    .editable-text.enable {
        outline: none;
        padding-top: 5px;
        padding-bottom: 5px;
        border-bottom: 1px solid var(--border-color-bottom);
    }

    /* Shared positioning for all action buttons */
    .button-div {
        margin: 0;
        padding: 0;
        position: absolute;
        top: 50%;
        width: fit-content;
        height: fit-content;
    }

    /* Utility class to hide inactive buttons */
    .button-div.hide {
        display: none;
    }

    /* Edit button: aligned to the right of the container */
    .edit-button-div {
        right: 0px;
        transform: translate(100%, -50%);
    }

    /* Confirm (save) button: also on the right, shows in edit mode */
    .confirm-button-div {
        right: 0px;
        transform: translate(100%, -50%);
    }

    /* Cancel button: aligned to the left of the container */
    .cancel-button-div {
        left: 0px;
        transform: translate(-100%, -50%);
    }
</style>
