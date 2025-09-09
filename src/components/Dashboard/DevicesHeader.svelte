<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { logoutUser } from "$lib/logic/api/auth";
    import { getDeviceInfo, getDeviceInfoWithImage } from "$lib/logic/api/device";
    import { MethodRetrier } from "$lib/logic/api/retrier";
    import type { DeviceInfo } from "$lib/types/device/base";
    import Notification from "../General/Notification.svelte";
    import ActionWithText from "../General/ActionWithText.svelte";
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
            <DeviceInfoCard {deviceInfo} {deviceImageUrl} />
        </div>
        <div class="right-div">
            <div class="mobile-device-info-div">
                <ActionWithText
                    width="100%"
                    textPaddingLeft="15px"
                    imagePaddingRight="5px"
                    textColor="#c9c9c9"
                    textWeight="300"
                    text={`${$texts.device}`}
                    imageURL={"/img/expand-down.svg"}
                    onClick={() => {}}
                />
            </div>
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

    .center-div {
        flex: 1;
        display: none;
        justify-content: center;
        align-items: center;
        padding: 0px;
        padding-left: 20px;
        padding-right: 20px;
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

    .mobile-device-info-div {
        width: 140px;
    }

    /* Desktop layout: show search bar and slide panel margin */
    @media (min-width: 880px) {
        .header-div .main-header-div {
            justify-content: space-between;
        }
    }

    @media (min-width: 400px) {
        .center-div {
            display: flex;
        }
        .mobile-device-info-div {
            display: none;
        }
    }

    /* Show fixed header margin when logo is showing */
    @media (min-width: 880px) {
        .header-div .main-header-div {
            margin-left: 250px;
        }
    }
</style>
