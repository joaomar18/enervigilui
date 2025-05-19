<script lang="ts">
    //Props
    export let checked: boolean;

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let knobWidth: string;
    export let knobHeight: string;
    export let borderRadius: string = "0px";
    export let backgroundColor: string;
    export let selectedBackgroundColor: string = backgroundColor;
    export let knobBackgroundColor: string;
    export let knobSelectedBackgroundColor: string = knobBackgroundColor;

    //Functions
    function getNumber(value: string): number {
        return parseFloat(value);
    }

    function toggle() {
        checked = !checked;
    }

    $: widthNumber = getNumber(width);
    $: knobWidthNumber = getNumber(knobWidth);
    $: heightNumber = getNumber(height);
    $: knobHeightNumber = getNumber(knobHeight);
</script>

<!-- 
  Custom toggle (selector) button component.
  Uses a <button> element styled with CSS variables for flexibility.
  Switches between two states (checked/unchecked) on click.
  The knob slides horizontally, and styles change based on the 'checked' state.
-->
<button
    class={checked ? "checked" : ""}
    on:click={toggle}
    aria-label="Selector Button"
    style="
        --width: {width};
        --height: {height};
        --knob-width: {knobWidth};
        --knob-height: {knobHeight};
        --knob-top-push: {`${(heightNumber - knobHeightNumber) / 2}px`};
        --knob-right-push: {`${widthNumber - knobWidthNumber}px`};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --selected-background-color: {selectedBackgroundColor};
        --knob-background-color: {knobBackgroundColor};
        --knob-selected-background-color: {knobSelectedBackgroundColor};
    "
>
    <div class="knob {checked ? 'checked' : ''}"></div>
</button>

<style>
    /* Toggle button container */
    button {
        margin:0;
        padding:0;
        width: var(--width);
        height: var(--height);
        background-color: var(--background-color);
        border-radius: var(--border-radius);
        position: relative;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s ease;
    }

    /* Optional hover state (Removes button effects when hovered) */
    button:hover {
        background-color: var(--background-color);
    }

    /* Active state for the toggle button */
    button.checked {
        background-color: var(--selected-background-color);
    }

    /* Knob element inside the toggle */
    .knob {
        position: absolute;
        width: var(--knob-width);
        height: var(--knob-height);
        border-radius: 50%;
        top: var(--knob-top-push);
        left: 0px;
        background-color: var(--knob-background-color);
        transition: transform 0.2s ease;
    }

    /* Knob appearance and position when toggle is checked */
    .knob.checked {
        background-color: var(--knob-selected-background-color);
        transform: translateX(var(--knob-right-push));
    }
</style>
