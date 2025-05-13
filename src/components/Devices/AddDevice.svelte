<script lang="ts">
    // Stores for multi-language support
    import { selectedLang, texts } from "../../stores/lang";

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
    export let imageBackgroundColor: string;
    export let imageWidth: string;
    export let imageHeight: string;
    export let strokeColor: string;
    export let strokeSelectedColor: string;

    // Click Export Funcion
    export let onClick: () => void;

    // Functions
    function handleClick(): void {
        if (onClick) {
            onClick();
        }
    }
</script>

<!-- Add Device Card: clickable card with a plus icon to add a new device -->
<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --image-background-color: {imageBackgroundColor};
        --image-width: {imageWidth};
        --image-height: {imageHeight};
        --stroke-color: {strokeColor};
        --stroke-selected-color: {strokeSelectedColor};
    "
    class="container"
>
    <div class="content">
        <h3>{$texts.addDevice[$selectedLang]}</h3>
        <div class="add-device-image-div">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="100" fill="transparent" />

                <!-- Vertical bar of the plus -->
                <line x1="100" y1="50" x2="100" y2="150" stroke-width="10" stroke-linecap="round" />

                <!-- Horizontal bar of the plus -->
                <line x1="50" y1="100" x2="150" y2="100" stroke-width="10" stroke-linecap="round" />
            </svg>
        </div>
        <button on:click={handleClick} aria-label="Add Device Button"></button>
    </div>
</div>

<style>
    /* Container: card wrapper with size, background, border and transitions */
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

    /* Hover: scale up and apply subtle shadow */
    .container:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    /* Content: vertical flex layout, centered items */
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

    /* Title: centered, light-weight heading */
    h3 {
        color: #f5f5f5;
        width: 100%;
        text-align: center;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 300;
    }

    /* Image div: circular placeholder with background and sizing */
    .add-device-image-div {
        padding: 0;
        margin: 0;
        margin-top: 10px;
        width: var(--image-width);
        height: var(--image-height);
        background-color: var(--image-background-color);
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 87.5%;
        border-radius: 50%;
    }

    /* Plus icon lines: base stroke color with transition */
    svg line {
        stroke: var(--stroke-color);
        transition: stroke 0.2s ease-in-out;
    }

    /* Hover icon: stroke changes when container is hovered */
    .container:hover svg line {
        stroke: var(--stroke-selected-color);
    }

    /* Button overlay: invisible full-card click surface */
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
