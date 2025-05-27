<script lang="ts">
    // Props
    export let menuOpen: boolean = false;

    // Layout / styling props
    export let backgroundColor: string = "#252b33";
    export let hoverColor: string = "#323a45";

    // Functions
    function handleClick(): void {
        menuOpen = !menuOpen;
    }
</script>

<!-- 
  MenuButton: Displays a hamburger icon that toggles into an "X" when clicked.
  Used to control the visibility of a mobile navigation menu.
-->
<div
    class="menu-button-div"
    style="
        --background-color: {backgroundColor};
        --hover-color: {hoverColor};
    "
>
    <div class="menu-button">
        <span class:open={menuOpen}></span>
        <span class:open={menuOpen}></span>
        <span class:open={menuOpen}></span>
    </div>
    <button on:click={handleClick} aria-label="Toggle menu"></button>
</div>

<style>
    /* Menu button container */
    .menu-button-div {
        background-color: var(--background-color);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 23px;
        width: 46px;
        height: 46px;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Hover background color */
    .menu-button-div:hover {
        background-color: var(--hover-color);
    }

    /* Full-size invisible button to capture clicks */
    button {
        background: transparent;
        cursor: pointer;
        border: none;
        position: absolute;
        width: 100%;
        height: 100%;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    button:hover {
        background: transparent;
    }

    /* Hamburger icon wrapper */
    .menu-button {
        padding: 0;
        margin: 0;
        position: relative;
        width: 30px;
        height: 25px;
    }

    /* Hamburger bars */
    .menu-button span {
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
        display: block;
        width: 26px;
        margin: 0;
        padding: 0;
        height: 3px;
        background-color: white;
        transition: 0.1s ease;
    }

    .menu-button span:nth-child(1) {
        top: 4px;
    }
    .menu-button span:nth-child(2) {
        top: 11px;
    }
    .menu-button span:nth-child(3) {
        top: 18px;
    }

    /* Open state - transforms bars into 'X' */
    .menu-button span.open:nth-child(1) {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
    }

    .menu-button span.open:nth-child(2) {
        opacity: 0;
    }

    .menu-button span.open:nth-child(3) {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
    }
</style>
