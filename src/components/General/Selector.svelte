<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";

    //Props
    export let options: Record<string, any>; //Record with options for the selector
    export let selectedOption: any; //Selected option
    export let invertOptions: boolean = false; //Invert Options div position

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "0px";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
    export let selectedColor: string = backgroundColor;
    export let optionsBackgroundColor: string = backgroundColor;
    export let optionsBorderColor: string = backgroundColor;
    export let fontSize: string = "1rem";
    export let letterSpacing: string = "normal";
    export let wordSpacing: string = "normal";
    export let arrowWidth: string;
    export let arrowHeight: string;
    export let arrowRightPos: string = "0px";

    // Variables
    let isOpen: boolean = false;
    let selDivEl: Node;
    $: selectedKey = Object.entries(options).find(([_, value]) => value == selectedOption)?.[0];

    // Functions
    function toggleSelector(): void {
        isOpen = !isOpen;
    }

    //Change Option Function
    function changeOption(optionKey: string): void {
        selectedOption = options[optionKey];
        isOpen = false;
    }

    //Handle Click Outside Function
    function handleClickOutside(event: MouseEvent): void {
        if (selDivEl && !selDivEl.contains(event.target as Node)) {
            isOpen = false;
        }
    }

    //On Mount Function
    onMount(() => {
        if (browser) {
            window.addEventListener("click", handleClickOutside);
        }
    });

    //Cleanup Function
    onDestroy(() => {
        if (browser) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

<!-- 
  Custom dropdown selector component.
  Dynamically styled using CSS variables.
  Displays a list of options, highlights the selected one, 
  and toggles visibility on button click.
-->
<div
    bind:this={selDivEl}
    class="selector-div"
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --selected-color: {selectedColor};
        --options-background-color: {optionsBackgroundColor};
        --options-border-color: {optionsBorderColor};
        --font-size: {fontSize};
        --leter-spacing: {letterSpacing};
        --word-spacing: {wordSpacing};
        --arrow-width: {arrowWidth};
        --arrow-height: {arrowHeight};
        --arrow-right-position: {arrowRightPos};
        --selected-option-shift-left: {arrowRightPos};
    "
>
    <div class="content-div">
        <span class="selected-option">{selectedKey}</span>
        <img
            class="arrow"
            src={invertOptions
                ? isOpen
                    ? "/img/down-arrow.png"
                    : "/img/up-arrow.png"
                : isOpen
                  ? "/img/up-arrow.png"
                  : "/img/down-arrow.png"}
            alt={isOpen ? "up-arrow" : "down-arrow"}
        />
        <button class="open-selector" on:click={toggleSelector} aria-label="View options"></button>
        <div class="options {isOpen ? '' : 'disabled'} {invertOptions ? 'inverted' : 'normal'}">
            {#each Object.entries(options) as [key, value]}
                <div class="option {selectedOption == value ? 'selected-option' : ''}">
                    <span class="option-name">{key}</span>
                    <button on:click={() => changeOption(key)} aria-label={key}></button>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    /* Wrapper for the custom selector */
    .selector-div {
        display: block;
        width: var(--width);
        height: var(--height);
        background-color: var(--background-color);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Inner content container with centered layout */
    .content-div {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-tap-highlight-color: transparent;
    }

    /* Arrow icon (dropdown indicator) */
    .arrow {
        position: absolute;
        width: var(--arrow-width);
        height: var(--arrow-height);
        right: var(--arrow-right-position);
        top: 50%;
        transform: translateY(-50%);
    }

    /* Currently selected option text */
    .selected-option {
        width: 100%;
        height: 100%;
        display: flex;
        margin: 0;
        padding: 0;
        align-items: center;
        justify-content: center;
        color: #eeeeee;
        font-weight: 400;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: var(--font-size);
        letter-spacing: var(--leter-spacing);
        word-spacing: var(--word-spacing);
        padding-right: var(--selected-option-shift-left);
    }

    /* Invisible button to trigger dropdown */
    .open-selector {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Dropdown container for options */
    .options {
        position: absolute;
        width: 100%;
        height: fit-content;
        background-color: var(--options-background-color);
        border-radius: var(--border-radius);
        border: 1px solid var(--options-border-color);
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        z-index: 1;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Dropdown opens below selector */
    .options.normal {
        top: calc(100% + 2px);
    }

    /* Dropdown opens above selector */
    .options.inverted {
        bottom: calc(100% + 2px);
    }

    /* Hides the dropdown when closed */
    .options.disabled {
        display: none;
    }

    /* Individual option style */
    .option {
        position: relative;
        width: 100%;
        height: var(--height);
        padding: 5px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: 400;
        font-size: var(--font-size);
        letter-spacing: var(--leter-spacing);
        word-spacing: var(--word-spacing);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: #b0bec5;
        -webkit-tap-highlight-color: transparent;
    }

    /* Transparent overlay to make the option fully clickable */
    .option button {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Styling for the currently selected option */
    .option.selected-option {
        background-color: var(--selected-color);
        color: #ffffff;
    }
</style>
