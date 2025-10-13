<script lang="ts">
    import InputField from "../InputField.svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { InputDateTimeFieldStyle, TimeDateFieldStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $TimeDateFieldStyle;

    // Props
    export let hourValue: string = "";
    export let minuteValue: string = "";
    export let secondValue: string = "";
    export let useHour: boolean = true;
    export let useMinute: boolean = true;
    export let useSecond: boolean = true;
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
    let hoursId: string = "HH";
    let minutesId: string = "mm";
    let secondsId: string = "ss";
    let formatterSep: string = ":";
    let selected: boolean = false;
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
        {#if useHour}
            <InputField
                style={$InputDateTimeFieldStyle}
                bind:inputValue={hourValue}
                inputType="POSITIVE_INT"
                placeHolderText={hoursId}
                zeroPaddingDigits={2}
                disableHints={true}
                minValue={0}
                maxValue={23}
                validateOnInput={true}
                onSelected={() => {
                    selected = true;
                }}
                onBlur={() => {
                    selected = false;
                }}
            />
            {#if useMinute}
                <span class="separator">{formatterSep}</span>
            {/if}
        {/if}
        {#if useMinute}
            <InputField
                style={$InputDateTimeFieldStyle}
                bind:inputValue={minuteValue}
                inputType="POSITIVE_INT"
                placeHolderText={minutesId}
                zeroPaddingDigits={2}
                disableHints={true}
                minValue={0}
                maxValue={59}
                validateOnInput={true}
                onSelected={() => {
                    selected = true;
                }}
                onBlur={() => {
                    selected = false;
                }}
            />
            {#if useSecond}
                <span class="separator">{formatterSep}</span>
            {/if}
        {/if}
        {#if useSecond}
            <InputField
                style={$InputDateTimeFieldStyle}
                bind:inputValue={secondValue}
                inputType="POSITIVE_INT"
                placeHolderText={secondsId}
                zeroPaddingDigits={2}
                disableHints={true}
                minValue={0}
                maxValue={59}
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
