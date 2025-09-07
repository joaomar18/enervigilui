<script lang="ts">
    import { logoutUser } from "$lib/logic/api/auth";
    import MenuButton from "../General/MenuButton.svelte";
    import Logo from "../General/Logo.svelte";
    import Notification from "../General/Notification.svelte";
    import Logout from "./Logout.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Stores
    import { leftPanelOpen } from "$lib/stores/view/navigation";
</script>

<div class="left-header-div">
    <div class="menu-button-div">
        <MenuButton bind:menuOpen={$leftPanelOpen} />
    </div>
    <div class="logo-div">
        <Logo />
    </div>
</div>
<div class="header-div">
    <div class="main-header-div">
        <div class="right-header-div">
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

    /* Left side header (menu/logo/actions) */
    .left-header-div {
        position: fixed;
        left: 0px;
        top: 0px;
        width: fit-content;
        height: 74px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 103;
    }

    /* Hidden logo slot until enabled */
    .left-header-div .logo-div {
        box-sizing: border-box;
        position: absolute;
        left: 56px;
        width: calc(250px - 56px);
        display: none;
        justify-content: start;
        align-items: center;
        padding-left: 25px;
    }

    /* Menu button position */
    .left-header-div .menu-button-div {
        position: absolute;
        left: 10px;
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

    /* Right header action icons */
    .right-header-div {
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

    /* Show logo slot and fixed header margin on wider screens */
    @media (min-width: 470px) {
        .left-header-div .logo-div {
            display: flex;
        }
        .header-div .main-header-div {
            margin-left: 250px;
        }
    }
</style>
