<script lang="ts">
    // Stores for multi-language support
    import { selectedLang, texts } from "../../stores/lang";

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
</script>

<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
    "
    class="container"
>
    <div class="content">
        <h3>{$texts.addDevice[$selectedLang]}</h3>
        <div class="add-device-image-div">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="100" fill="transparent" />

                <!-- Vertical bar of the plus -->
                <line
                    x1="100"
                    y1="50"
                    x2="100"
                    y2="150"
                    stroke="#9E9E9E"
                    stroke-width="10"
                    stroke-linecap="round"
                />

                <!-- Horizontal bar of the plus -->
                <line
                    x1="50"
                    y1="100"
                    x2="150"
                    y2="100"
                    stroke="#9E9E9E"
                    stroke-width="10"
                    stroke-linecap="round"
                />
            </svg>
        </div>
        <button aria-label="Add Device Button"></button>
    </div>
</div>

<style>
    .container {
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius, 0px);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        transition:
            transform 0.2s ease-in-out,
            box-shadow 0.2s ease-in-out;
    }

    .container:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .content {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    h3 {
        color: #f5f5f5;
        width: 100%;
        text-align: center;
        font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            "Open Sans",
            "Helvetica Neue",
            sans-serif;
    }

    .add-device-image-div{
        padding: 0;
        margin: 0;
        margin-top: 10px;
        width: 200px;
        height: 200px;
        background-color: rgba(255, 255, 255, 0.1);
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 175px;
        border-radius: 100px;
    }

    .content button {
        position: absolute;
        margin: 0;
        padding: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
    }
</style>
