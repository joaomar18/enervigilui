<script lang="ts">
    // Props
    export let checked: boolean;
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
    export let disabledCheckmarkColor: string = "rgb(170,170,170)"; // checkmark color when unchecked
    export let enabledCheckmarkColor: string = "rgb(255,255,255)"; // checkmark color when checked
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
        --enabled-checkmark-color: {enabledCheckmarkColor};
        --disabled-checkmark-color: {disabledCheckmarkColor};
    "
>
    <input type="checkbox" name={inputName} bind:checked />
    <span>
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
</style>
