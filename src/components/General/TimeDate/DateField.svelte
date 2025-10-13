<script lang="ts">
    import { interpretYY, getShortYear } from "./DateTimeValidation";
    import InputField from "../InputField.svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { InputDateTimeFieldStyle, TimeDateFieldStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $TimeDateFieldStyle;

    // Props
    export let yearValue: string = "";
    export let monthValue: string = "";
    export let dayValue: string = "";
    export let useYear: boolean = true;
    export let useMonth: boolean = true;
    export let useDay: boolean = true;
    export let inputInvalid: boolean = false;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let selectedBackgroundColor: string | undefined = undefined;
    export let badFormatBackgroundColor: string | undefined = undefined;
    export let border: string | undefined = undefined;
    export let selectedBorder: string | undefined = undefined;
    export let badFormatBorder: string | undefined = undefined;
    export let textSize: string | undefined = undefined;
    export let textColor: string | undefined = undefined;
    export let textWeight: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        borderRadius,
        backgroundColor,
        selectedBackgroundColor,
        badFormatBackgroundColor,
        border,
        selectedBorder,
        badFormatBorder,
        textSize,
        textColor,
        textWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let yearsId: string = "YY";
    let monthsId: string = "MM";
    let daysId: string = "DD";
    let formatterSep: string = "-";
    let selected: boolean = false;
    let shortYear: string = "";

    // Reactive Statements
    $: shortYear = getShortYear(yearValue);

    $: console.log(yearValue);
</script>

<div
    style="
        --width: {mergedStyle.width};
        --height: {mergedStyle.height};
        --border-radius: {mergedStyle.borderRadius};
        --background-color: {mergedStyle.backgroundColor};
        --selected-background-color: {mergedStyle.selectedBackgroundColor};
        --bad-format-background-color: {mergedStyle.badFormatBackgroundColor};
        --border: {mergedStyle.border};
        --selected-border: {mergedStyle.selectedBorder};
        --bad-format-border: {mergedStyle.badFormatBorder};
        --text-size: {mergedStyle.textSize};
        --text-color: {mergedStyle.textColor};
        --text-weight: {mergedStyle.textWeight};
    "
    class="input-time-div"
    class:bad-format={inputInvalid}
    class:selected
>
    <div class="content">
        {#if useYear}
            <InputField
                style={$InputDateTimeFieldStyle}
                bind:inputValue={shortYear}
                inputType="POSITIVE_INT"
                placeHolderText={yearsId}
                zeroPaddingDigits={2}
                disableHints={true}
                minValue={0}
                maxValue={99}
                validateOnInput={true}
                onSelected={() => {
                    selected = true;
                }}
                onBlur={() => {
                    selected = false;
                }}
                onChange={() => {
                    yearValue = interpretYY(shortYear);
                }}
            />
            {#if useMonth}
                <span class="separator">{formatterSep}</span>
            {/if}
        {/if}
        {#if useMonth}
            <InputField
                style={$InputDateTimeFieldStyle}
                bind:inputValue={monthValue}
                inputType="POSITIVE_INT"
                placeHolderText={monthsId}
                zeroPaddingDigits={2}
                disableHints={true}
                minValue={0}
                maxValue={12}
                validateOnInput={true}
                onSelected={() => {
                    selected = true;
                }}
                onBlur={() => {
                    selected = false;
                }}
            />
            {#if useDay}
                <span class="separator">{formatterSep}</span>
            {/if}
        {/if}
        {#if useDay}
            <InputField
                style={$InputDateTimeFieldStyle}
                bind:inputValue={dayValue}
                inputType="POSITIVE_INT"
                placeHolderText={daysId}
                zeroPaddingDigits={2}
                disableHints={true}
                minValue={0}
                maxValue={31}
                validateOnInput={true}
                onSelected={() => {
                    selected = true;
                }}
                onBlur={() => {
                    selected = false;
                }}
            />
        {/if}
    </div>
</div>

<style>
    .input-time-div {
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        background-color: var(--background-color);
        border: var(--border);
    }

    .input-time-div.bad-format {
        background-color: var(--bad-format-background-color);
        border: var(--bad-format-border);
    }

    .input-time-div.selected {
        background-color: var(--selected-background-color);
        border: var(--selected-border);
    }

    .content {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .separator {
        font-size: var(--text-size);
        color: var(--text-color);
        font-weight: var(--text-weight);
    }
</style>
