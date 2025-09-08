<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { logoutUser } from "$lib/logic/api/auth";
    import { getDeviceInfo, getDeviceInfoWithImage } from "$lib/logic/api/device";
    import { MethodRetrier } from "$lib/logic/api/retrier";
    import type { DeviceInfo } from "$lib/types/device/base";
    import Notification from "../General/Notification.svelte";
    import Logout from "./Logout.svelte";
    import DeviceInfoCard from "../Devices/DeviceInfoCard.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    //  Stores
    import { currentDeviceID } from "$lib/stores/device/current";

    // Variables
    let deviceInfo: DeviceInfo;
    let deviceImageUrl: string;

    onMount(() => {
        let deviceDataRetrier: MethodRetrier | null = null;
        if ($currentDeviceID) {
            deviceDataRetrier = new MethodRetrier(async (signal) => {
                ({ deviceInfo, deviceImageUrl } = await getDeviceInfoWithImage($currentDeviceID));
            }, 3000);
        }

        //Clean-up logic
        return () => {
            deviceDataRetrier?.stop();
            deviceDataRetrier = null;
        };
    });
</script>

<div class="header-div" in:fade={{ duration: 300 }}>
    <div class="main-header-div">
        <div class="left-div">
            <DeviceInfoCard {deviceInfo} {deviceImageUrl} />
        </div>
        <div class="right-div">
            <Notification notificationsNumber={"1"} />
            <Logout
                buttonText={$texts.logout}
                imageUrl="/img/logout.svg"
                onClick={async () => {
                    await logoutUser();
                }}
            />
        </div>
    </div>
</div>

<style>
    /* Top fixed header */
    .header-div {
        position: sticky;
        top: 0;
        background-color: #181d23;
        flex-shrink: 0;
        width: 100%;
        height: 74px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    /* Main header area for search & actions */
    .header-div .main-header-div {
        margin: 0;
        padding: 0;
        margin-left: calc(250px - (250px - 56px));
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        z-index: 99;
    }

    .left-div {
        padding-left: 20px;
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    /* Right header action icons */
    .right-div {
        padding-right: 20px;
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 20px;
    }

    /* Desktop layout: show search bar and slide panel margin */
    @media (min-width: 880px) {
        .header-div .main-header-div {
            justify-content: space-between;
        }
    }

    /* Show fixed header margin on wider screens */
    @media (min-width: 470px) {
        .header-div .main-header-div {
            margin-left: 250px;
        }
    }
</style>
