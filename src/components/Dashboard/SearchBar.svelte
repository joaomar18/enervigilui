<script lang="ts">
    // Layout / styling props
    export let placeholderText: string;
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
    export let selectedBorderColor: string = backgroundColor;
</script>

<div
    style="
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --selected-border-color: {selectedBorderColor};
    "
    class="container"
>
    <div class="content">
        <img src="./img/search.png" alt="Search Icon" />
        <input type="text" placeholder={placeholderText} />
    </div>
</div>

<style>
    .container {
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        width: 50%;
        max-width: 650px;
        height: 40px;
        border-radius: 20px;
    }

    .container:focus-within {
        border-color: var(--selected-border-color);
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

    img {
        position: absolute;
        width: 25px;
        height: 25px;
        left: 10px;
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
        padding-left: 50px;
        outline: none;
        box-shadow: none;
        border: none;
        color: #eee;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }
</style>
