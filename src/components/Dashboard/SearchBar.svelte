<script lang="ts">
    // Layout / styling props
    export let width: string;
    export let minWidth: string;
    export let maxWidth: string;
    export let height: string;
    export let borderRadius: string = "";
    export let searchButtonWidth: string;
    export let placeholderText: string;
    export let backgroundColor: string;
    export let buttonBgColor: string;
    export let buttonHoverColor: string = buttonBgColor;
    export let borderColor: string = backgroundColor;
    export let buttonBorderColor: string = buttonBgColor;
    export let selectedBorderColor: string = backgroundColor;
    export let imageWidth: string;
    export let imageHeight: string;
</script>

<!-- 
  Search Bar: Container with styled input field and search button.  
-->
<div
    style="
        --width: {width};
        --min-width: {minWidth};
        --max-width: {maxWidth};
        --height: {height};
    "
    class="container"
>
    <div class="content">
        <div
            style="
                --border-radius: {borderRadius};
                --background-color: {backgroundColor};
                --border-color: {borderColor};
                --selected-border-color: {selectedBorderColor};
            "
            class="search-bar-div"
        >
            <input type="text" placeholder={placeholderText} name="Search Bar" />
        </div>
        <div
            style="
                --button-width: {searchButtonWidth};
                --button-border-radius: {borderRadius};
                --button-background-color: {buttonBgColor};
                --button-hover-color: {buttonHoverColor};
                --button-border-color: {buttonBorderColor};
                --image-width: {imageWidth};
                --image-height: {imageHeight};
            "
            class="search-button-div"
        >
            <img src="/img/search.png" alt="Search Loop" />
            <button aria-label="Search Button"></button>
        </div>
    </div>
</div>

<style>
    /* Container: overall fixed or flexible width & height */
    .container {
        width: var(--width);
        min-width: var(--min-width);
        max-width: var(--max-width);
        height: var(--height);
    }

    /* Content: horizontal flex layout for search and button */
    .content {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    /* Search field wrapper: styled input background & border */
    .search-bar-div {
        padding: 0;
        margin: 0;
        flex: 1;
        height: 100%;
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius, 0px);
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
    }

    /* Search focus: highlight border when typing */
    .search-bar-div:focus-within {
        border-color: var(--selected-border-color);
    }

    /* Input: full-size, transparent background, padded text */
    input {
        display: inline-block;
        line-height: 100%;
        background: transparent;
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        font-size: 1.1rem;
        padding-left: 20px;
        padding-right: 20px;
        outline: none;
        box-shadow: none;
        border: none;
        color: #eee;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Search button wrapper: fixed width, no left border */
    .search-button-div {
        width: var(--button-width);
        position: relative;
        background-color: var(--button-background-color);
        margin: 0;
        padding: 0;
        margin-left: 0px;
        height: 100%;
        border-radius: var(--button-border-radius, 0px);
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border: 1px solid var(--button-border-color);
        border-left: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Button hover: background change on hover */
    .search-button-div:hover {
        background-color: var(--button-hover-color);
    }

    /* Icon inside button: scaled by CSS variables */
    .search-button-div img {
        width: var(--image-width);
        height: var(--image-height);
    }

    /* Invisible overlay button: captures clicks */
    .search-button-div button {
        position: absolute;
        border: none;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        cursor: pointer;
        background: transparent;
    }
</style>
