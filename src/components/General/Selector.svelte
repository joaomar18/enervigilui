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

    // Variables
    let isOpen: boolean = false;
    let selDivEl: Node;
    $: selectedKey = Object.entries(options).find(([_, value]) => value === selectedOption)?.[0];

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
    .selector-div {
        display: block;
        width: var(--width);
        height: var(--height);
        background-color: var(--background-color);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
    }

    .content-div {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .arrow {
        height: 16px;
        width: 16px;
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
    }

    .selected-option {
        color: #eeeeee;
        font-weight: 400;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: var(--font-size);
        letter-spacing: var(--leter-spacing);
        word-spacing: var(--word-spacing);
    }

    .open-selector {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    .options {
        position: absolute;
        width: 100%;
        height: fit-content;
        background-color: var(--options-backgound-color);
        border-radius: var(--border-radius);
        border: 1px solid var(--options-border-color);
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }

    .options.normal {
        top: calc(100% + 2px);
    }

    .options.inverted {
        bottom: calc(100% + 2px);
    }

    .options.disabled {
        display: none;
    }

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
    }

    .option button {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
    }

    .option.selected-option {
        background-color: var(--selected-color);
        color: #ffffff;
    }
</style>
