<script lang="ts">
    // Layout / styling props
    export let placeholderText: string;
    export let backgroundColor: string;
    export let buttonBgColor: string;
    export let buttonHoverColor: string = buttonBgColor;
    export let borderColor: string = backgroundColor;
    export let buttonBorderColor: string = buttonBgColor;
    export let selectedBorderColor: string = backgroundColor;
</script>

<div class="container">
    <div class="content">
        <div
            style="
                --background-color: {backgroundColor};
                --border-color: {borderColor};
                --selected-border-color: {selectedBorderColor};
            "
            class="search-bar-div"
        >
            <input type="text" placeholder={placeholderText} />
        </div>
        <div
            style="
                --button-background-color: {buttonBgColor};
                --button-hover-color: {buttonHoverColor};
                --button-border-color: {buttonBorderColor};
            "
            class="search-button-div"
        >
            <img src="./img/search.png" alt="Search Loop" />
            <button aria-label="Search Button"></button>
        </div>
    </div>
</div>

<style>
    .container {
        width: calc(80%);
        max-width: 650px;
        min-width: 250px;
        height: 40px;
    }

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

    .search-bar-div {
        padding: 0;
        margin: 0;
        flex: 1;
        height: 100%;
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
    }

    .search-bar-div:focus-within {
        border-color: var(--selected-border-color);
    }

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

    .search-button-div {
        width: 75px;
        position: relative;
        background-color: var(--button-background-color);
        margin: 0;
        padding: 0;
        margin-left: 0px;
        height: 100%;
        border-radius: 20px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border: 1px solid var(--button-border-color);
        border-left: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .search-button-div:hover {
        background-color: var(--button-hover-color);
    }

    .search-button-div img {
        height: 25px;
        width: 25px;
    }

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
