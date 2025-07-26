<script lang="ts">
    // Props
    export let disabled: boolean = false;
    export let checked: boolean;
    export let inputInvalid: boolean = false;
    export let enableInputInvalid: boolean = false;
    export let inputName: string = ""; //Name of the input

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let checkMarkWidth: number;
    export let checkMarkHeight: number;
    export let checkmarkStroke: number = 2.5;
    export let marginRight: string = "";
    export let disabledbgColor: string; // background color when unchecked
    export let disabledBorderColor: string; // border color when unchecked
    export let enabledbgColor: string; // background color when checked
    export let enabledBorderColor: string; // border color when checked
    export let badFormatBackgroundColor: string = disabledbgColor;
    export let badFormatBorderColor: string = badFormatBackgroundColor;
    export let disabledCheckmarkColor: string = "rgb(170,170,170)"; // checkmark color when unchecked
    export let enabledCheckmarkColor: string = "rgb(255,255,255)"; // checkmark color when checked

    // Change Export Function
    export let onChange: (() => void) | undefined = undefined;

    function handleChange() {
        if (onChange) {
            onChange();
        }
    }
</script>

<!-- 
  Checkbox label using CSS variables for styling.
  This allows full control of spacing, colors, and theming.
-->
<label
    class="label-checkbox"
    style="
        --width: {width};
        --height: {height};
        --margin-right: {marginRight};
        --disabled-bg-color: {disabledbgColor};
        --disabled-border-color: {disabledBorderColor};
        --enabled-bg-color: {enabledbgColor};
        --enabled-border-color: {enabledBorderColor};
        --bad-format-background-color: {badFormatBackgroundColor};
        --bad-format-border-color: {badFormatBorderColor};
        --enabled-checkmark-color: {enabledCheckmarkColor};
        --disabled-checkmark-color: {disabledCheckmarkColor};
    "
    class:disabled
>
    <input
        type="checkbox"
        name={inputName}
        bind:checked
        on:change={handleChange}
        class:bad-format={inputInvalid && enableInputInvalid && checked}
        {disabled}
    />
    <span class:bad-format={inputInvalid && enableInputInvalid && checked}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={checkMarkWidth}
            height={checkMarkHeight}
            fill="none"
            stroke-width={checkmarkStroke}
            stroke-linecap="round"
            stroke-linejoin="round"
            class:checked
        >
            <path d="M5 13l4 4L19 7" />
        </svg>
    </span>
</label>

<style>
    /* Main container */
    .label-checkbox {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-right: var(--margin-right, 0px);
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Disable cursor pointer when input is disabled */
    .label-checkbox.disabled {
        cursor: auto;
    }

    /* Hide native checkbox */
    .label-checkbox input[type="checkbox"] {
        display: none;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Custom checkbox visual (unchecked by default) */
    .label-checkbox span {
        display: inline-block;
        /* width: 1.5em;
        height: 1.5em; */
        width: var(--width);
        height: var(--height);
        border: 1px solid var(--disabled-border-color, #5a646e);
        border-radius: 4px;
        background-color: var(--disabled-bg-color, #42505f);
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Checkmark SVG Icon Customization */
    .label-checkbox span svg {
        stroke: var(--disabled-checkmark-color);
    }

    /* Enabled Checkmark Icon Stroke Color */
    .label-checkbox span svg.checked {
        stroke: var(--enabled-checkmark-color);
    }

    /* Checkbox appearance when checked */
    .label-checkbox input[type="checkbox"]:checked + span {
        border: 1px solid var(--enabled-border-color, #5a646e);
        background-color: var(--enabled-bg-color, #4caf7f);
    }

    /* Checkbox appeareance when input is invalid */
    .label-checkbox input[type="checkbox"]:checked.bad-format + span.bad-format {
        border: 1px solid var(--bad-format-border-color);
        background-color: var(--bad-format-background-color);
    }
</style>
