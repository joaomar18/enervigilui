<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";

    //Props
    export let options: Record<string, any>; //Record with options for the selector
    export let selectedOption: any; //Selected option
    export let invertOptions: boolean = false; //Invert Options div position

    // Layout / styling props
    export let backgroundColor: string = "#252b33";
    export let borderColor: string = "#323a45";
    export let selectedColor: string = "#00796b";

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
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --selected-color: {selectedColor};
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
                    <span class="option-name"></span>
                    <button on:click={() => changeOption(key)} aria-label={key}></button>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .selector-div {
        display: block;
        background-color: var(--background-color);
        border-radius: 5px;
        border: 1px solid var(--border-color);
        height: 40px;
        width: 150px;
        top: 50%;
    }

    .content-div {
        position: relative;
        width: 100%;
        height: 100%;
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
        position: absolute;
        font-size: 1.5rem;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
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
        background-color: #1e242b;
        border-radius: 5px;
        border: 1px solid #323a45;
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
        padding: 5px;
        box-sizing: border-box;
        text-align: center;
        font-weight: 400;
        font-size: 1.5rem;
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
