<script lang="ts">
    // Props
    export let notificationsOpen: boolean = false;
    export let notificationsNumber: string;

    // Layout / styling props
    export let backgroundColor: string;
    export let hoverColor: string = backgroundColor;
    export let borderColor: string = backgroundColor;

    // Functions
    function handleClick(): void {
        notificationsOpen = !notificationsOpen;
    }
</script>

<div
    class="notifications-button-div"
    style="
        --background-color: {backgroundColor};
        --hover-color: {hoverColor};
        --border-color: {borderColor};
    "
>
    {#if notificationsOpen}
        <img src="./img/bell-on.png" alt="Bell Off" />
    {:else}
        <img src="./img/bell-off.png" alt="Bell On" />
    {/if}
    {#if notificationsNumber}
        <div class="notifications-number-text-div">
            <span>{notificationsNumber}</span>
        </div>
    {/if}
    <button on:click={handleClick} aria-label="Toggle Notifications"></button>
</div>

<style>
    .notifications-button-div {
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        width: 40px;
        height: 40px;
        position:relative;
    }

    /* Hover background color */
    .notifications-button-div:hover {
        background-color: var(--hover-color);
    }

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

    .notifications-number-text-div span {
        display: inline-block;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: #eee;
        font-weight: 500;
        font-size: 1rem;
        line-height: 24px;
    }

    /* Full-size invisible button to capture clicks */
    button {
        background: transparent;
        cursor: pointer;
        border: none;
        position: absolute;
        width: 100%;
        height: 100%;
    }

    button:hover {
        background: transparent;
    }

    img {
        width: 25px;
        height: 25px;
    }
</style>
