<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";

    // Stores for multi-language support
    import { selectedLang } from "$lib/stores/lang";

    //Props
    export let disabled: boolean = false;
    export let useLang: boolean = false; //use language texts in options and selected option
    export let inputBadFormat: boolean = false;
    export let firstSubmission: boolean = false;
    export let options: Record<string, any>; //Record with options for the selector
    export let selectedOption: any; //Selected option
    export let setSelectedOption: ((value: string) => void) | undefined = undefined; //Function to set the selected option, if not provided, the selectedOption will be updated directly
    export let invertOptions: boolean = false; //Invert Options div position
    export let scrollable: boolean = false; //makes the content scrollable
    export let maxOptions: number = 0; //if the content is scrollable assigns the maximum number of visible options

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "0px";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
    export let disabledBackgroundColor: string = backgroundColor;
    export let disabledBorderColor: string = disabledBackgroundColor;
    export let selectedColor: string = backgroundColor;
    export let badFormatBackgroundColor: string = backgroundColor;
    export let badFormatBorderColor: string = badFormatBackgroundColor;
    export let optionsBackgroundColor: string = backgroundColor;
    export let optionsBorderColor: string = backgroundColor;
    export let optionsInnerBorderColor: string = "transparent";
    export let optionHeight: string = height;
    export let fontSize: string = "1rem";
    export let letterSpacing: string = "normal";
    export let wordSpacing: string = "normal";
    export let arrowWidth: string;
    export let arrowHeight: string;
    export let arrowRightPos: string = "0px";

    // Variables
    let isOpen: boolean = false;
    let validOptions: [string, any][];
    let optionsHeight: string = "fit-content";
    let selDivEl: Node;

    $: {
        if (disabled) {
            validOptions = Object.entries({});
        } else {
            validOptions = Object.entries(options || {}).filter(([_, value]) => value !== "");
        }
    }
    $: optionsLength = validOptions.length;
    $: selectedKey = useLang
        ? Object.keys(options).find((key) => key === selectedOption)
        : Object.entries(options).find(([_, value]) => value === selectedOption)?.[0];
    $: shiftTextLeft = String(parseFloat(arrowRightPos) + parseFloat(arrowWidth)) + "px";
    $: {
        if (scrollable && optionsLength > maxOptions) {
            optionsHeight = String(parseFloat(height) * maxOptions) + "px";
        }
    }
    $: {
        if (optionsLength == 0 || disabled) {
            isOpen = false;
        }
    }

    // Functions
    function getDisplayText(key: string): string {
        if (useLang && options[key] && typeof options[key] === "object") {
            return options[key][$selectedLang] || key;
        } else {
            return key;
        }
    }

    function toggleSelector(): void {
        isOpen = !isOpen;
    }

    //Change Option Function
    function changeOption(optionKey: string): void {
        if (setSelectedOption) {
            setSelectedOption(useLang ? optionKey : options[optionKey]);
        } else {
            selectedOption = useLang ? optionKey : options[optionKey];
        }
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
        --disabled-background-color: {disabledBackgroundColor};
        --disabled-border-color: {disabledBorderColor};
        --selected-color: {selectedColor};
        --bad-format-background-color: {badFormatBackgroundColor};
        --bad-format-border-color: {badFormatBorderColor};
        --options-background-color: {optionsBackgroundColor};
        --options-border-color: {optionsBorderColor};
        --options-inner-border-color: {optionsInnerBorderColor};
        --option-height: {optionHeight};
        --font-size: {fontSize};
        --letter-spacing: {letterSpacing};
        --word-spacing: {wordSpacing};
        --arrow-width: {arrowWidth};
        --arrow-height: {arrowHeight};
        --arrow-right-position: {arrowRightPos};
        --selected-option-shift-left: {shiftTextLeft};
        --options-height: {optionsHeight};
    "
    class:disabled={optionsLength == 0 || disabled}
    class:bad-format={inputBadFormat && firstSubmission && !disabled}
>
    <div class="content-div">
        <span class="selected-option">{getDisplayText(selectedKey || "")}</span>
        <img
            class="arrow"
            src={invertOptions ? (isOpen ? "/img/down-arrow.png" : "/img/up-arrow.png") : isOpen ? "/img/up-arrow.png" : "/img/down-arrow.png"}
            alt={isOpen ? "up-arrow" : "down-arrow"}
        />
        <button
            class="open-selector"
            on:click={toggleSelector}
            aria-label="View options"
            disabled={optionsLength == 0 || disabled}
            class:disabled={optionsLength == 0 || disabled}
        ></button>
        <div class="options {isOpen ? '' : 'disabled'} {invertOptions ? 'inverted' : 'normal'} {scrollable ? 'scrollable' : ''}">
            {#each Object.entries(options) as [key, value] (key)}
                {#if useLang}
                    <div class="option {selectedOption == key ? 'selected-option' : ''}">
                        <span class="option-name">{getDisplayText(key)}</span>
                        <button on:click={() => changeOption(key)} aria-label={key}></button>
                    </div>
                {:else}
                    <div class="option {selectedOption == value ? 'selected-option' : ''}">
                        <span class="option-name">{getDisplayText(key)}</span>
                        <button on:click={() => changeOption(key)} aria-label={key}></button>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    /* Wrapper for the custom selector */
    .selector-div {
        box-sizing: border-box;
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

    /* Selector is disabled */
    .selector-div.disabled {
        background-color: var(--disabled-background-color);
        border: 1px solid var(--disabled-border-color);
    }

    /* Selector has bad format */
    .selector-div.bad-format {
        background-color: var(--bad-format-background-color);
        border: 1px solid var(--bad-format-border-color);
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
        font-size: var(--font-size);
        letter-spacing: var(--letter-spacing);
        word-spacing: var(--word-spacing);
        padding-right: var(--selected-option-shift-left);
        line-height: normal;
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

    /* Buton to trigger dropdown is disabled */
    .open-selector.disabled {
        cursor: auto;
    }

    /* Dropdown container for options */
    .options {
        position: absolute;
        width: 100%;
        height: var(--options-height);
        background-color: var(--options-background-color);
        border-radius: var(--border-radius);
        border: 1px solid var(--options-border-color);
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        z-index: 1;
        overflow-y: hidden;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
        scrollbar-width: thin;
        scrollbar-color: #323a45 #1e242b;
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

    /* options are scrollable */
    .options.scrollable {
        overflow-y: auto;
    }

    /* Individual option style */
    .option {
        position: relative;
        width: 100%;
        min-height: var(--option-height);
        max-height: var(--option-height);
        padding: 0 5px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: 400;
        font-size: var(--font-size);
        letter-spacing: var(--letter-spacing);
        word-spacing: var(--word-spacing);
        border-bottom: 1px solid var(--options-inner-border-color);
        color: #b0bec5;
        -webkit-tap-highlight-color: transparent;
        line-height: normal;
    }

    /* Individual option style border color */

    .option:last-child {
        border: 1px solid transparent;
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
