<script lang="ts">
    import { browser } from "$app/environment";
    import { replaceState } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/state";

    //Props
    export let invertOptions: boolean = false; //Invert Options div position

    // Stores for multi-language support
    import type { Language } from "$lib/stores/lang";
    import { selectedLang, texts } from "$lib/stores/lang";

    // Layout / styling props
    export let backgroundColor: string = "#252b33";
    export let borderColor: string = "#323a45";
    export let selectedColor: string = "#00796b";

    // Variables
    let isOpen: boolean = false;
    let langDivEl: Node;

    // Functions
    function toggleSelector(): void {
        isOpen = !isOpen;
    }

    function changeLanguage(language: Language): void {
        selectedLang.set(language);
        isOpen = false;

        if (!browser) return;

        const params = new URLSearchParams(window.location.search);
        params.set("lang", language);
        const newUrl = `${window.location.pathname}?${params.toString()}`;

        replaceState(newUrl, {});
    }

    function handleClickOutside(event: MouseEvent): void {
        if (langDivEl && !langDivEl.contains(event.target as Node)) {
            isOpen = false;
        }
    }

    onMount(() => {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            let lang = (params.get("lang") || "PT") as Language;
            if (lang !== "PT" && lang !== "EN") {
                lang = "PT";
            }
            changeLanguage(lang);

            window.addEventListener("click", handleClickOutside);
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

<!-- 
  LangSelDropdown: Dropdown component for selecting the application language.
-->
<div
    bind:this={langDivEl}
    class="language-div"
    style="
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --selected-color: {selectedColor};
    "
>
    <div class="content-div">
        <img class="globe" src="/img/globe.png" alt="globe" />
        <span class="selected-lang">{$selectedLang}</span>
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
            <div class="option {$selectedLang == 'PT' ? 'selected-option' : ''}">
                <span class="lang-option">PT</span>
                <button on:click={() => changeLanguage("PT")} aria-label="PT"></button>
            </div>
            <div class="option {$selectedLang == 'EN' ? 'selected-option' : ''}">
                <span class="lang-option">EN</span>
                <button on:click={() => changeLanguage("EN")} aria-label="EN"></button>
            </div>
        </div>
    </div>
</div>

<style>
    /* Wrapper for the language selector */
    .language-div {
        display: block;
        background-color: var(--background-color);
        border-radius: 5px;
        border: 1px solid var(--border-color);
        height: 40px;
        width: 150px;
        top: 50%;
    }

    /* Inner content container */
    .content-div {
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* Globe icon */
    .globe {
        height: 32px;
        width: 32px;
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
    }

    /* Arrow icon (down or up) */
    .arrow {
        height: 16px;
        width: 16px;
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
    }

    /* Current selected language text */
    .selected-lang {
        color: #eeeeee;
        font-weight: 400;
        position: absolute;
        font-size: 1.5rem;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    /* Transparent button that triggers the dropdown */
    .open-selector {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    /* Dropdown options container */
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
        z-index: 1;
    }

    /* Dropdown options position when normal (opens to the bottom) */
    .options.normal {
        top: calc(100% + 2px);
    }

    /* Dropdown options position when normal (opens to the top) */
    .options.inverted {
        bottom: calc(100% + 2px);
    }

    /* Hide dropdown when closed */
    .options.disabled {
        display: none;
    }

    /* Individual option item */
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

    /* Clickable transparent overlay for option */
    .option button {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
    }

    /* Styling for the currently selected option */
    .option.selected-option {
        background-color: var(--selected-color);
        color: #ffffff;
    }
</style>
