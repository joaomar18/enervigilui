<script lang="ts">
    // Props
    export let notificationsOpen: boolean = false;
    export let notificationsNumber: string;

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let hoverColor: string = backgroundColor;
    export let borderColor: string = backgroundColor;
    export let imageWidth: string;
    export let imageHeight: string;

    // Functions
    function handleClick(): void {
        notificationsOpen = !notificationsOpen;
    }
</script>

<!-- 
  Notifications Button: Clickable bell icon with unread count badge, and toogle notifications window
-->
<div
    class="notifications-button-div"
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --hover-color: {hoverColor};
        --border-color: {borderColor};
        --image-width: {imageWidth};
        --image-height: {imageHeight};
    "
>
    {#if notificationsOpen}
        <img src="/img/bell-on.png" alt="Bell Off" />
    {:else}
        <img src="/img/bell-off.png" alt="Bell On" />
    {/if}
    {#if notificationsNumber}
        <div class="notifications-number-text-div">
            <span>{notificationsNumber}</span>
        </div>
    {/if}
    <button on:click={handleClick} aria-label="Toggle Notifications"></button>
</div>

<style>
    /* Container: circular notification button */
    .notifications-button-div {
        box-sizing: border-box;
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        position: relative;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Hover state: provide visual feedback */
    .notifications-button-div:hover {
        background-color: var(--hover-color);
    }

    /* Badge: red circle showing unread count */
    .notifications-number-text-div {
        position: absolute;
        width: 26px;
        height: 26px;
        border-radius: 13px;
        background-color: #e53935;
        text-align: center;
        left: -12px;
        bottom: -12px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Badge text: styled number inside badge */
    .notifications-number-text-div span {
        display: inline-block;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: #eee;
        font-weight: 500;
        font-size: 1rem;
        line-height: 24px;
    }

    /* Invisible overlay button: captures clicks across entire area */
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

    /* Button hover: keep transparent to avoid color shift */
    button:hover {
        background: transparent;
    }

    /* Icon sizing: fixed dimensions for the bell icon */
    img {
        width: var(--image-width, 25px);
        height: var(--image-height, 25px);
    }
</style>
