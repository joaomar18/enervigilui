<script lang="ts">
    // Props
    export let checked: boolean;
    export let inputName: string = ""; //Name of the input

    // Layout / styling props
    export let marginRight: string = "";
    export let disabledbgColor: string; // background color when unchecked
    export let disabledBorderColor: string; // border color when unchecked
    export let enabledbgColor: string; // background color when checked
    export let enabledBorderColor: string; // border color when checked
</script>

<!-- 
  Checkbox label using CSS variables for styling.
  This allows full control of spacing, colors, and theming.
-->
<label
    class="label-checkbox"
    style="
        --margin-right: {marginRight};
        --disabled-bg-color: {disabledbgColor};
        --disabled-border-color: {disabledBorderColor};
        --enabled-bg-color: {enabledbgColor};
        --enabled-border-color: {enabledBorderColor};
    "
>
    <input type="checkbox" name={inputName} bind:checked />
    <span></span>
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
        width: 1.5em;
        height: 1.5em;
        border: 1px solid var(--disabled-border-color, #5a646e);
        border-radius: 4px;
        background-color: var(--disabled-bg-color, #42505f);
        position: relative;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 1.2em;
    }

    /* Checkbox appearance when checked */
    .label-checkbox input[type="checkbox"]:checked + span {
        border: 1px solid var(--enabled-border-color, #5a646e);
        background-color: var(--enabled-bg-color, #4caf7f);
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.00004 11.172L3.22104 8.393L1.80704 9.807L6.00004 14L15 5.00001L13.586 3.58601L6.00004 11.172Z'/%3E%3C/svg%3E");
    }
</style>
