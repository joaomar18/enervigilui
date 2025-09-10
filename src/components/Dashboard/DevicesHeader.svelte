<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { logoutUser } from "$lib/logic/api/auth";
    import { getDeviceInfo, getDeviceInfoWithImage } from "$lib/logic/api/device";
    import { MethodRetrier } from "$lib/logic/api/retrier";
    import type { DeviceInfo } from "$lib/types/device/base";
    import Notification from "../General/Notification.svelte";
    import SlottedAction from "../General/SlottedAction.svelte";
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
        <div class="center-div">
            <div class="desktop-device-info-div">
                <DeviceInfoCard {deviceInfo} {deviceImageUrl} />
            </div>
            <div class="mobile-device-info-div">
                <SlottedAction width="100%" onClick={() => {}}>
                    <div class="device-context-div">
                        <div class="device-label">
                            <img src="/img/current-device.svg" alt="Current device" />
                            <span>{$texts.device}</span>
                        </div>
                        <span class="sub-text">ID: {String(deviceInfo?.id).padStart(3, "0")}</span>
                    </div>
                    <img class="arrow" src="/img/down-arrow.svg" alt="down-arrow" />
                </SlottedAction>
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

    .center-div {
        flex: 1;
        min-width: 0;
        margin: 0;
        padding: 0;
        padding-left: 20px;
        padding-right: 20px;
    }

    .right-div {
        padding-right: 20px;
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 20px;
    }

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

    .mobile-device-info-div .device-context-div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        min-width: 0;
        height: 100%;
        padding-left: 15px;
        padding-right: 5px;
    }

    .mobile-device-info-div .device-context-div .device-label {
        min-width: 0;
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    .mobile-device-info-div .device-context-div .device-label img {
        width: 32px;
        height: 32px;
    }

    .mobile-device-info-div .device-context-div .device-label span {
        display: none;
        padding-left: 5px;
        padding-right: 10px;
        font-size: 16px;
        min-width: 0;
        color: #c9c9c9;
        font-weight: 300;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mobile-device-info-div .sub-text {
        font-size: 14px;
        color: #9a9a9a;
        font-weight: 300;
        white-space: nowrap;
        flex-shrink: 0;
        transform: translateY(1px);
    }

    .mobile-device-info-div .arrow {
        padding-right: 10px;
        width: 24px;
        height: 24px;
    }

    @media (min-width: 880px) {
        .header-div .main-header-div {
            justify-content: space-between;
        }
    }

    @media (min-width: 420px) {
        .mobile-device-info-div .device-context-div .device-label span {
            display: block
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
