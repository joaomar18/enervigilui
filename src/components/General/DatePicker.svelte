<script lang="ts">
    import { DateInput } from "date-picker-svelte";

    // Props
    export let value: Date | null = null;
    export let placeholder: string = "Select date...";
    export let disabled: boolean = false;
    export let min: Date | undefined = undefined;
    export let max: Date | undefined = undefined;
    export let closeOnSelection: boolean = true;

    // Layout / styling props
    export let width: string | undefined = "150px";
    export let height: string | undefined = "40px";
    export let borderRadius: string | undefined = "10px";
    export let backgroundColor: string | undefined = "#1a2027";
    export let borderColor: string | undefined = "1px solid #1a2027";
    export let fontColor: string | undefined = "white";
    export let fontSize: string | undefined = "1rem";
    export let fontWeight: string | undefined = "400";

    // Reactive Statements

    // Functions
    function handleDateChange(event: CustomEvent) {
        value = event.detail;
    }
</script>

<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --font-color: {fontColor};
        --font-size: {fontSize};
        --font-weight: {fontWeight};
    "
    class="date-picker-wrapper"
>
    <DateInput bind:value {placeholder} {disabled} {min} {max} {closeOnSelection} on:change={handleDateChange} />
</div>

<style>
    .date-picker-wrapper {
        margin: 0;
        padding: 0;
        position: relative;
        width: fit-content;
        height: fit-content;
    }

    /* Global styles for the DateInput component */
    .date-picker-wrapper :global(.date-time-field input) {
        width: var(--width);
        height: var(--height);
        border-radius: 5px;
        background-color: #1a2027;
        border: var(--border-color);
        color: var(--font-color);
        font-size: var(--font-size);
        font-weight: var(--font-weight);
        padding: 0;
        text-align: center;
        outline: none;
        transition: border-color 0.2s ease;
    }

    .date-picker-wrapper :global(.date-time-field input:focus) {
        border-color: #2f80ed;
        box-shadow: 0 0 0 2px rgba(47, 128, 237, 0.2);
    }

    .date-picker-wrapper :global(.date-time-field input:disabled) {
        background-color: #42505f;
        border-color: #42505f;
        color: #888;
        cursor: not-allowed;
    }

    .date-picker-wrapper :global(.date-time-field input:disabled) {
        background-color: #42505f;
        border-color: #42505f;
        color: #888;
        cursor: not-allowed;
    }

    .date-picker-wrapper :global(.date-time-field .picker) {
        background-color: #42505f;
        border-color: #42505f;
        color: #888;
        cursor: not-allowed;
    }
</style>
