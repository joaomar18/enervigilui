<script lang="ts">
    import { tick } from "svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { InputFieldStyle } from "$lib/style/general";

    // Props
    export let disabled: boolean = false;
    export let inputInvalid: boolean = false;
    export let enableInputInvalid: boolean = false;
    export let disableHints: boolean = false;
    export let inputValue: string;
    export let inputType: "STRING" | "INT" | "POSITIVE_INT" | "FLOAT" | "POSITIVE_FLOAT" | "USERNAME" | "PASSWORD" = "STRING";
    export let inputUnit: string | null = null;
    export let minValue: number = inputType !== "POSITIVE_INT" ? Number.MIN_SAFE_INTEGER : 0;
    export let maxValue: number = Number.MAX_SAFE_INTEGER;
    export let infoText: string = "";
    export let placeHolderText: string = "";
    export let zeroPaddingDigits: number = 0;
    export let validateOnInput = false; // Validates Input on value change

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $InputFieldStyle;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let minWidth: string | undefined = undefined;
    export let maxWidth: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let disabledBackgroundColor: string | undefined = undefined;
    export let disabledBorderColor: string | undefined = undefined;
    export let selectedBackgroundColor: string | undefined = undefined;
    export let selectedBorderColor: string | undefined = undefined;
    export let badFormatBackgroundColor: string | undefined = undefined;
    export let badFormatBorderColor: string | undefined = undefined;
    export let paddingLeft: string | undefined = undefined;
    export let fontSize: string | undefined = undefined;
    export let fontColor: string | undefined = undefined;
    export let fontWeight: string | undefined = undefined;
    export let textAlign: string | undefined = undefined;
    export let infoTextColor: string | undefined = undefined;
    export let infoTextSize: string | undefined = undefined;
    export let infoTextWeight: string | undefined = undefined;
    export let unitTextColor: string | undefined = undefined;
    export let placeHolderTextColor: string | undefined = undefined;
    export let placeHolderTextWeight: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        borderRadius,
        backgroundColor,
        borderColor,
        disabledBackgroundColor,
        disabledBorderColor,
        selectedBackgroundColor,
        selectedBorderColor,
        badFormatBackgroundColor,
        badFormatBorderColor,
        paddingLeft,
        fontSize,
        fontColor,
        fontWeight,
        textAlign,
        infoTextColor,
        infoTextSize,
        infoTextWeight,
        unitTextColor,
        placeHolderTextColor,
        placeHolderTextWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let selected = false;
    let unitElement: HTMLElement | null = null;
    let unitWidth = 0;

    // Reactive Statements
    $: {
        updateUnitWidth();
        inputUnit; // Dependency tracker
    }

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
            input = String(Number(input));
            input = input.padStart(zeroPaddingDigits, "0");
        } else if (inputType === "POSITIVE_INT") {
            // Allow only positive integers
            input = input.replace(/[^0-9]/g, "");
            input = String(Number(input));
            input = input.padStart(zeroPaddingDigits, "0");
        } else if (inputType === "FLOAT") {
            // Allow only floating-point numbers
            input = input.replace(/[^0-9.-]/g, ""); // Allow negative floats
            // Prevent multiple dots or dashes
            if ((input.match(/\./g) || []).length > 1 || (input.match(/-/g) || []).length > 1) {
                input = input.slice(0, -1);
            }
            input = String(Number(input));
            input = input.padStart(zeroPaddingDigits, "0");
        } else if (inputType === "POSITIVE_FLOAT") {
            // Allow only positive floating-point numbers
            input = input.replace(/[^0-9.]/g, "").padStart(zeroPaddingDigits, "0");
            // Prevent multiple dots
            if ((input.match(/\./g) || []).length > 1) {
                input = input.slice(0, -1);
            }
            input = String(Number(input));
            input = input.padStart(zeroPaddingDigits, "0");
        }

        inputValue = input;

        if (onChange) {
            onChange();
        }

        if (validateOnInput) {
            validateBounds();
        }
    }

    function validateBounds(): void {
        // For numeric input types, do not allow empty string
        if (["INT", "POSITIVE_INT", "FLOAT", "POSITIVE_FLOAT"].includes(inputType)) {
            if (inputValue === "") {
                inputValue = minValue.toString();
                if (limitsPassed) {
                    limitsPassed();
                }
                if (onChange) {
                    onChange();
                }
            } else {
                const numericValue = parseFloat(inputValue.toString());
                if (numericValue < minValue) {
                    inputValue = minValue.toString();
                    if (limitsPassed) {
                        limitsPassed();
                    }
                    if (onChange) {
                        onChange();
                    }
                } else if (numericValue > maxValue) {
                    inputValue = maxValue.toString();
                    if (limitsPassed) {
                        limitsPassed();
                    }
                    if (onChange) {
                        onChange();
                    }
                }
            }
        }
    }

    async function updateUnitWidth() {
        await tick();
        if (unitElement) {
            unitWidth = unitElement.offsetWidth;
        } else {
            unitWidth = 0;
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
        --width: {mergedStyle.width};
        --min-width: {minWidth};
        --max-width: {maxWidth};
        --height: {mergedStyle.height};
        --border-radius: {mergedStyle.borderRadius};
        --background-color: {mergedStyle.backgroundColor};
        --border-color: {mergedStyle.borderColor};
        --disabled-background-color: {mergedStyle.disabledBackgroundColor};
        --disabled-border-color: {mergedStyle.disabledBorderColor};
        --selected-background-color: {mergedStyle.selectedBackgroundColor};
        --selected-border-color: {mergedStyle.selectedBorderColor};
        --bad-format-background-color: {mergedStyle.badFormatBackgroundColor};
        --bad-format-border-color: {mergedStyle.badFormatBorderColor};
        --input-padding-right: {unitWidth > 0 ? unitWidth + 10 + 'px' : '10px'};
        --padding-left: {mergedStyle.paddingLeft};
        --font-size: {mergedStyle.fontSize};
        --font-color: {mergedStyle.fontColor};
        --font-weight: {mergedStyle.fontWeight};
        --text-align: {mergedStyle.textAlign};
        --info-text-color: {mergedStyle.infoTextColor};
        --info-text-size: {mergedStyle.infoTextSize};
        --info-text-weight: {mergedStyle.infoTextWeight};    
        --unit-text-color: {mergedStyle.unitTextColor};
        --placeholder-text-color: {mergedStyle.placeHolderTextColor};
        --placeholder-text-weight: {mergedStyle.placeHolderTextWeight};
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
                    autocomplete={disableHints ? "off" : "new-password"}
                    autocorrect={disableHints ? "off" : "on"}
                    autocapitalize={disableHints ? "off" : "on"}
                    spellcheck={disableHints ? "false" : "true"}
                    name="Password"
                    on:focus={() => (selected = true)}
                    on:blur={() => {
                        selected = false;
                        if (!validateOnInput) {
                            validateBounds();
                        }
                    }}
                    bind:value={inputValue}
                    on:input={handleInput}
                    placeholder={placeHolderText}
                    {disabled}
                    class:disabled
                    class:bad-format={inputInvalid && enableInputInvalid && !disabled}
                />
            {:else if inputType === "USERNAME"}
                <input
                    class:selected
                    type="text"
                    autocomplete={disableHints ? "off" : "username"}
                    autocorrect={disableHints ? "off" : "on"}
                    autocapitalize={disableHints ? "off" : "on"}
                    spellcheck={disableHints ? "false" : "true"}
                    name="Username"
                    on:focus={() => (selected = true)}
                    on:blur={() => {
                        selected = false;
                        if (!validateOnInput) {
                            validateBounds();
                        }
                    }}
                    bind:value={inputValue}
                    on:input={handleInput}
                    placeholder={placeHolderText}
                    {disabled}
                    class:disabled
                    class:bad-format={inputInvalid && enableInputInvalid && !disabled}
                />
            {:else}
                <input
                    class:selected
                    type="text"
                    autocomplete={disableHints ? "off" : "on"}
                    autocorrect={disableHints ? "off" : "on"}
                    autocapitalize={disableHints ? "off" : "on"}
                    spellcheck={disableHints ? "false" : "true"}
                    name="Input Field"
                    on:focus={() => {
                        selected = true;
                    }}
                    on:blur={() => {
                        selected = false;
                        if (!validateOnInput) {
                            validateBounds();
                        }
                    }}
                    bind:value={inputValue}
                    on:input={handleInput}
                    placeholder={placeHolderText}
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
        min-width: var(--min-width, min-content);
        max-width: var(--max-width, max-content);
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
        position: relative;
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

    /* Input Placeholder styles */
    input::placeholder {
        color: var(--placeholder-text-color);
        font-weight: var(--placeholder-text-weight);
        font-size: var(--font-size);
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
        pointer-events: none;
    }
</style>
