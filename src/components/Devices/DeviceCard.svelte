<script lang="ts">
    import Action from "../Dashboard/Buttons/Action.svelte";
    import Notification from "../Dashboard/Buttons/Notification.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "../../stores/lang";

    //Props
    export let deviceID: number;
    export let deviceName: string;
    export let connected: boolean;

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
    export let imageURL: string;
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
        <h3>{deviceName}</h3>
        <div style="background-image: url('{imageURL}');" class="device-image-div"></div>
        <div class="actions-div">
            <Notification
                notificationsOpen={false}
                notificationsNumber={"1"}
                width="50px"
                height="50px"
                borderRadius="50%"
                backgroundColor="rgba(255, 255, 255, 0.1)"
                hoverColor="rgba(255, 255, 255, 0.2)"
                borderColor="transparent"
                imageWidth="25px"
                imageHeight="25px"
            />
            <Action
                width="50px"
                height="50px"
                borderRadius="50%"
                backgroundColor="rgba(255, 255, 255, 0.1)"
                hoverColor="rgba(255, 255, 255, 0.2)"
                borderColor="transparent"
                imageURL="./img/edit.png"
                imageWidth="25px"
                imageHeight="25px"
                onClick={() => {}}
            />
            <Action
                width="50px"
                height="50px"
                borderRadius="50%"
                backgroundColor="rgba(255, 255, 255, 0.1)"
                hoverColor="rgba(255, 255, 255, 0.2)"
                borderColor="transparent"
                imageURL="./img/enter.png"
                imageWidth="32px"
                imageHeight="32px"
                onClick={() => {}}
            />
        </div>
        <span class="id-text">ID: {String(deviceID).padStart(3, "0")}</span>
        <div class="connection-state-div">
            <div class:connected class="connection-status"></div>
            {#if connected}
                <span class="connection-text">{$texts.connected[$selectedLang]}</span>
            {:else}
                <span class="connection-text">{$texts.disconnected[$selectedLang]}</span>
            {/if}
        </div>
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

    .device-image-div {
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

    .actions-div {
        margin: 0;
        padding: 0;
        padding-top: 25px;
        width: fit-content;
        gap: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .id-text {
        position: absolute;
        left: 20px;
        bottom: 10px;
        color: #e0e0e0;
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
        font-size: 0.9rem;
    }

    .connection-state-div {
        position: absolute;
        right: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        bottom: 10px;
    }

    .connection-state-div .connection-status {
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background-color: #f44336;
    }

    .connection-state-div .connection-status.connected {
        background-color: #4caf50;
    }

    .connection-state-div .connection-text {
        color: #e0e0e0;
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
        font-size: 0.9rem;
    }
</style>
