<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";

    // Props
    export let disabled: boolean = false;
    export let inputInvalid: boolean = false;
    export let enableInputInvalid: boolean = false;
    export let inputValue: string;
    export let inputType: string = "STRING";
    export let inputUnit: string | null = null;
    export let minValue: number = Number.MIN_SAFE_INTEGER;
    export let maxValue: number = Number.MAX_SAFE_INTEGER;

    // Layout / styling props
    export let infoText: string = "";
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
    export let disabledBackgroundColor: string = backgroundColor;
    export let disabledBorderColor: string = disabledBackgroundColor;
    export let selectedBackgroundColor: string = backgroundColor;
    export let selectedBorderColor: string = selectedBackgroundColor;
    export let badFormatBackgroundColor: string = backgroundColor;
    export let badFormatBorderColor: string = badFormatBackgroundColor;
    export let paddingLeft: string = "10px";
    export let fontSize: string = "1rem";
    export let fontColor: string;
    export let fontWeight: string = "400";
    export let textAlign: string = "left";
    export let infoTextColor: string = fontColor;
    export let infoTextSize: string = fontSize;
    export let infoTextWeight: string = fontWeight;
    export let unitTextColor: string = fontColor;

    // Variables
    let selected = false;
    let unitElement: HTMLElement | null = null;
    let unitWidth = 0;

    // Detected Limits Violation Export Funcion
    export let limitsPassed: (() => void) | null = null;

    // Change Export Function
    export let onChange: (() => void) | undefined = undefined;

    // Functions
    function handleInput(event: Event): void {
        let input = (event.target as HTMLInputElement).value;

        if (inputType === "INT") {
            // Allow only integers
            input = input.replace(/[^0-9-]/g, ""); // Allow negative integers
        } else if (inputType === "POSITIVE_INT") {
            // Allow only positive integers
            input = input.replace(/[^0-9]/g, "");
        } else if (inputType === "FLOAT") {
            // Allow only floating-point numbers
            input = input.replace(/[^0-9.-]/g, ""); // Allow negative floats
            // Prevent multiple dots or dashes
            if ((input.match(/\./g) || []).length > 1 || (input.match(/-/g) || []).length > 1) {
                input = input.slice(0, -1);
            }
        } else if (inputType === "POSITIVE_FLOAT") {
            // Allow only positive floating-point numbers
            input = input.replace(/[^0-9.]/g, "");
            // Prevent multiple dots
            if ((input.match(/\./g) || []).length > 1) {
                input = input.slice(0, -1);
            }
        }

        inputValue = input;
    }

    function validateBounds(): void {
        // Convert to number for validation if input is numeric
        if (["INT", "POSITIVE_INT", "FLOAT", "POSITIVE_FLOAT"].includes(inputType) && inputValue !== "") {
            const numericValue = parseFloat(inputValue.toString());
            if (numericValue < minValue) {
                inputValue = minValue.toString();
                if (limitsPassed) {
                    limitsPassed();
                }
            } else if (numericValue > maxValue) {
                inputValue = maxValue.toString();
                if (limitsPassed) {
                    limitsPassed();
                }
            }
        }
    }

    async function updateUnitWidth() {
        if (!disabled) {
            await tick();
            if (unitElement) {
                unitWidth = unitElement.offsetWidth;
            }
        }
    }

    onMount(() => {
        updateUnitWidth();
        window.addEventListener("resize", updateUnitWidth);
    });

    onDestroy(() => {
        window.removeEventListener("resize", updateUnitWidth);
    });

    // Reactive statement to update unit width when inputUnit changes
    $: {
        if (inputUnit) {
            updateUnitWidth();
        }
    }

    // Reactive statement to handle changes
    $: if (!disabled && (inputValue !== undefined || inputUnit !== null)) {
        if (onChange) {
            onChange();
        }
    }
</script>

<!--
  InputField component

  A flexible input field with customizable size, colors, and info text.
  Applies special styling when focused.
-->
<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --disabled-background-color: {disabledBackgroundColor};
        --disabled-border-color: {disabledBorderColor};
        --selected-background-color: {selectedBackgroundColor};
        --selected-border-color: {selectedBorderColor};
        --bad-format-background-color: {badFormatBackgroundColor};
        --bad-format-border-color: {badFormatBorderColor};
        --input-padding-right: {unitWidth > 0 ? unitWidth + 10 + 'px' : '10px'};
        --padding-left: {paddingLeft};
        --font-size: {fontSize};
        --font-color: {fontColor};
        --font-weight: {fontWeight};
        --text-align: {textAlign};
        --info-text-color: {infoTextColor};
        --info-text-size: {infoTextSize};
        --info-text-weight: {infoTextWeight};    
        --unit-text-color: {unitTextColor};
    "
    class="container"
>
    <div class="content">
        {#if infoText}
            <span class="info-text">
                {infoText}
            </span>
        {/if}
        <div class="input-field-div">
            {#if inputType === "PASSWORD"}
                <input
                    class:selected
                    type="password"
                    name="Input Field"
                    on:focus={() => (selected = true)}
                    on:blur={() => {
                        selected = false;
                        validateBounds();
                    }}
                    bind:value={inputValue}
                    on:input={handleInput}
                />
            {:else}
                <input
                    class:selected
                    type="text"
                    name="Input Field"
                    on:focus={() => {
                        selected = true;
                    }}
                    on:blur={() => {
                        selected = false;
                        validateBounds();
                    }}
                    bind:value={inputValue}
                    on:input={handleInput}
                    {disabled}
                    class:disabled
                    class:bad-format={inputInvalid && enableInputInvalid && !disabled}
                />
            {/if}
            {#if inputUnit}
                <span bind:this={unitElement} class="input-unit">{inputUnit}</span>
            {/if}
        </div>
    </div>
</div>

<style>
    /* Container: main input wrapper */
    .container {
        display: block;
        margin: 0;
        padding: 0;
        width: var(--width);
        height: var(--height);
        display: flex;
        align-items: center;
    }

    /* Content: vertical layout for input and info text */
    .content {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    /* Input field wrapper */
    .input-field-div {
        width: 100%;
        display: flex;
        align-items: center;
    }

    /* Input element styles */
    input {
        box-sizing: border-box;
        width: 100%;
        height: var(--height);
        margin: 0;
        padding-left: var(--padding-left);
        padding-right: var(--input-padding-right);
        font-size: var(--font-size);
        color: var(--font-color);
        font-weight: var(--font-weight);
        text-align: var(--text-align);
        outline: none;
        border-radius: var(--border-radius);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        transition:
            background-color 0.2s,
            border 0.2s;
    }

    /* Input element disabled */
    input.disabled {
        background-color: var(--disabled-background-color);
        border: 1px solid var(--disabled-border-color);
    }

    /* Input element when focused */
    input.selected {
        background-color: var(--selected-background-color);
        border: 1px solid var(--selected-border-color);
    }

    /* Input element with bad format */
    input.bad-format {
        background-color: var(--bad-format-background-color);
        border: 1px solid var(--bad-format-border-color);
    }

    /* Info text above the input */
    .info-text {
        color: var(--info-text-color);
        font-size: var(--info-text-size);
        font-weight: var(--info-text-weight);
        padding-bottom: 10px;
        line-height: 1.5;
    }

    /* Optinal input unit text on the right of the input */
    .input-unit {
        position: absolute;
        right: 10px;
        color: var(--unit-text-color);
        font-size: var(--font-size);
        white-space: nowrap;
        font-weight: var(--font-weight);
    }
</style>
