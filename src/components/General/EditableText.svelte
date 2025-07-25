<script lang="ts">
    import { tick } from "svelte";
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";
    import Action from "./Action.svelte";

    //Props
    export let text: string;
    export let placeHolder: string | null = null;
    export let allwaysEnabled: boolean = false;
    export let textInvalid: boolean = false;
    export let enableTextInvalid: boolean = false;

    // Layout / styling props
    export let width: string = "auto";
    export let minWidth: string | null = null;
    export let maxWidth: string | null = null;
    export let fontSize: string = "1rem";
    export let fontColor: string;
    export let borderColorBottom: string;
    export let invalidBorderColorBottom: string = borderColorBottom;
    export let buttonImageWidth: string;
    export let buttonImageHeight: string;

    //Variables
    let enableInput: boolean = false;
    let previousText: string;
    let containerEl: HTMLDivElement;
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
        --width: {width};
        --min-width: {minWidth};
        --max-width: {maxWidth};
        --font-size: {fontSize};
        --font-color: {fontColor};
        --border-color-bottom: {borderColorBottom};
        --invalid-border-color-bottom: {invalidBorderColorBottom};
        --button-image-width: {buttonImageWidth};
        --button-image-height: {buttonImageHeight};
    "
    class="container"
    bind:this={containerEl}
>
    <div class="input-div" class:maximize={enableInput || allwaysEnabled}>
        {#if !allwaysEnabled}
            <span class="non-editable-text" class:hide={enableInput} class:invalid={enableTextInvalid && textInvalid}>{text}</span>
        {/if}
        <input
            class="editable-text"
            class:enable={enableInput || allwaysEnabled}
            class:invalid={enableTextInvalid && textInvalid}
            type="text"
            name="Editable Text"
            bind:this={inputEl}
            bind:value={text}
            on:keydown={(e) => {
                if (e.key === "Enter") confirmInput();
                else if (e.key === "Escape") cancelInput();
            }}
            placeholder={placeHolder}
            class:maximize={enableInput || allwaysEnabled}
            disabled={!enableInput && !allwaysEnabled}
        />
        {#if !allwaysEnabled}
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
        {/if}
    </div>
    {#if !allwaysEnabled}
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
    {/if}
</div>

<style>
    /* Flex container to center input and buttons */
    .container {
        position: relative;
        width: var(--width);
        min-width: var(--min-width, min-content);
        max-width: var(--max-width, max-content);
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container .input-div {
        position: relative;
        width: fit-content;
        min-width: var(--min-width, min-content);
        max-width: var(--max-width, max-content);
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Maximize text field div (so that text field can expand) width on editing */
    .container .input-div.maximize {
        width: 100%;
    }

    /* Base styling for the non editable text field */
    .non-editable-text {
        padding: 0;
        margin: 0;
        background: none;
        text-align: center;
        font-size: var(--font-size);
        color: var(--font-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
        width: 100%;
    }

    /* Adds a border for the non editable text when the input is invalid */
    .non-editable-text.invalid {
        border-bottom: 1px solid var(--invalid-border-color-bottom);
    }

    /* Hide non editable text on edit mode */
    .non-editable-text.hide {
        display: none;
    }

    /* Base styling for the editable input field */
    .editable-text {
        padding: 0;
        margin: 0;
        background: none;
        border: none;
        width: 100%;
        text-align: center;
        font-size: var(--font-size);
        color: var(--font-color);
        display: none;
    }

    /* Display input field on editing */
    .editable-text.maximize {
        display: block;
    }

    /* When editing is active: add underline and remove default outline */
    .editable-text.enable {
        outline: none;
        padding-top: 5px;
        padding-bottom: 5px;
        border-bottom: 1px solid var(--border-color-bottom);
    }

    /* When text is invalid changes the border color */
    .editable-text.invalid {
        border-bottom: 1px solid var(--invalid-border-color-bottom);
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
        right: -10px;
        transform: translate(100%, -50%);
    }

    /* Confirm (save) button: also on the right, shows in edit mode */
    .confirm-button-div {
        right: -10px;
        transform: translate(100%, -50%);
    }

    /* Cancel button: aligned to the left of the container */
    .cancel-button-div {
        left: -10px;
        transform: translate(-100%, -50%);
    }
</style>
