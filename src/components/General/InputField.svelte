<script lang="ts">
    //Props
    export let inputValue: string;
    let selected = false;

    // Layout / styling props
    export let infoText: string = "";
    export let width: string;
    export let minWidth: string = width;
    export let maxWidth: string = width;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = "transparent";
    export let selectedBackgroundColor: string = backgroundColor;
    export let selectedBorderColor: string = borderColor;
    export let fontSize: string = "1rem";
    export let fontColor: string;
    export let fontWeight: string = "400";
    export let infoTextColor: string = fontColor;
    export let infoTextSize: string = fontSize;
    export let infoTextWeight: string = fontWeight;
</script>

<!--
  InputField component

  A flexible input field with customizable size, colors, and info text.
  Applies special styling when focused.
-->
<div
    style="
        --width: {width};
        --min-width: {minWidth};
        --max-width: {maxWidth};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --selected-background-color: {selectedBackgroundColor};
        --selected-border-color: {selectedBorderColor};
        --font-size: {fontSize};
        --font-color: {fontColor};
        --font-weight: {fontWeight};
        --info-text-color: {infoTextColor};
        --info-text-size: {infoTextSize};
        --info-text-weight: {infoTextWeight};    
    "
    class="container"
>
    <div class="content">
        <span class="info-text">
            {infoText}
        </span>
        <div class="input-field-div">
            <input
                class:selected
                type="text"
                name="Input Field"
                on:focus={() => (selected = true)}
                on:blur={() => (selected = false)}
                bind:value={inputValue}
            />
        </div>
    </div>
</div>

<style>
    /* Container: main input wrapper */
    .container {
        margin: 0;
        padding: 0;
        width: var(--width);
        min-width: var(--min-width);
        max-width: var(--max-width);
        height: fit-content;
        display: flex;
        align-items: center;
    }

    /* Content: vertical layout for input and info text */
    .content {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    /* Input field wrapper */
    .input-field-div {
        width: 100%;
        display: flex;
        align-items: center;
    }

    /* Input element styles */
    input[type="text"] {
        box-sizing: border-box;
        width: 100%;
        height: var(--height);
        margin: 0;
        padding: 0.5rem;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: var(--font-size);
        color: var(--font-color);
        font-weight: var(--font-weight);
        outline: none;
        border-radius: var(--border-radius);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        transition:
            background-color 0.2s,
            border 0.2s;
    }

    /* Input element when focused */
    input[type="text"].selected {
        background-color: var(--selected-background-color);
        border: 1px solid var(--selected-border-color);
    }

    /* Info text above the input */
    .info-text {
        color: var(--info-text-color);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: var(--info-text-size);
        font-weight: var(--info-text-weight);
        padding-bottom: 10px;
        line-height: 1.5;
    }
</style>
