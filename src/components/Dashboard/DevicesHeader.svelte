<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { logoutUser } from "$lib/logic/api/auth";
    import { getDeviceInfoWithImage } from "$lib/logic/api/device";
    import { MethodRetrier } from "$lib/logic/api/retrier";
    import type { DeviceInfo } from "$lib/types/device/base";
    import Notification from "../General/Notification.svelte";
    import Logout from "./Logout.svelte";
    import DeviceInfoHeader from "../Devices/DeviceInfoHeader.svelte";
    import MobileDeviceInfoHeader from "../Devices/MobileDeviceInfoHeader.svelte";

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

<!--
    Devices header: sticky top bar for the dashboard device view.
    Shows device info (desktop and mobile layouts), notifications, and logout button.
    Uses DeviceInfoHeader and MobileDeviceInfoHeader for responsive device display.
    Notification and logout actions are always visible on the right.
-->
<div class="header-div" in:fade={{ duration: 300 }}>
    <div class="main-header-div">
        <div class="center-div">
            <div class="desktop-device-info-div">
                <DeviceInfoHeader {deviceInfo} {deviceImageUrl} />
            </div>
            <div class="mobile-device-info-div">
                <MobileDeviceInfoHeader {deviceInfo} />
            </div>
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
    /* Sticky header bar for devices dashboard */
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

    /* Main header content container */
    .header-div .main-header-div {
        margin: 0;
        padding: 0;
        margin-left: 46px;
        width: 100%;
        min-width: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        z-index: 99;
    }

    /* Centered device info section */
    .center-div {
        flex: 1;
        min-width: 0;
        margin: 0;
        padding: 0;
        padding-left: 20px;
        padding-right: 20px;
    }

    /* Right section: notifications and logout */
    .right-div {
        padding-right: 20px;
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 20px;
    }

    /* Device info for desktop layout */
    .desktop-device-info-div {
        display: none;
        justify-content: center;
        align-items: center;
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        min-width: 0;
        height: 100%;
    }

    /* Device info for mobile layout */
    .mobile-device-info-div {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        min-width: 0;
        height: 100%;
    }

    /* Responsive layout adjustments */
    @media (min-width: 880px) {
        .header-div .main-header-div {
            justify-content: space-between;
        }
    }

    @media (min-width: 520px) {
        .desktop-device-info-div {
            display: flex;
        }
        .mobile-device-info-div {
            display: none;
        }
    }

    @media (min-width: 880px) {
        .header-div .main-header-div {
            margin-left: 250px;
        }
    }
</style>
