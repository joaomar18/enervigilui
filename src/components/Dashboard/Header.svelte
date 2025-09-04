<script lang="ts">
    import { onMount } from "svelte";
    import MenuButton from "../General/MenuButton.svelte";
    import Action from "../General/Action.svelte";
    import Logo from "../General/Logo.svelte";
    import SearchBar from "./SearchBar.svelte";
    import Notification from "../General/Notification.svelte";
    import Logout from "./Logout.svelte";
    import { navigateTo } from "$lib/logic/view/navigation";
    import { logoutUser } from "$lib/logic/api/auth";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Stores
    import { searchQuery } from "$lib/stores/view/navigation";
    import { leftPanelOpen } from "$lib/stores/view/navigation";

    // Variables
    let headerEl: HTMLDivElement;
    let leftHeaderEl: HTMLDivElement;
    let mobileSearchOpen: boolean = false;

    // Functions
    function handleClickOutside(event: MouseEvent): void {
        if (leftHeaderEl && headerEl && !leftHeaderEl.contains(event.target as HTMLElement) && !headerEl.contains(event.target as HTMLElement)) {
            mobileSearchOpen = false;
        }
    }

    onMount(() => {
        const desktopMatch = window.matchMedia("(min-width: 880px)");
        const closeMobileSearchOnDesktop = (e: MediaQueryListEvent) => {
            if (e.matches) {
                mobileSearchOpen = false;
            }
        };
        desktopMatch.onchange = closeMobileSearchOnDesktop;
        window.addEventListener("click", handleClickOutside);

        //Clean-up logic
        return () => {
            desktopMatch.onchange = null;
            window.removeEventListener("click", handleClickOutside);
        };
    });
</script>

<!-- 
  Dashboard Header:
    • Fixed top navigation bar with menu toggle, logo, search functionality, and user actions.
    • Left section: Menu button (desktop) and logo, with mobile search close button when active.
    • Right section: Search bar, notifications, and logout button.
    • Mobile responsive: Search bar expands to full width on mobile when activated.
    • Handles click-outside events to close mobile search automatically.
-->
<div class="left-header-div" bind:this={leftHeaderEl}>
    <div class="menu-button-div" class:close={mobileSearchOpen}>
        <MenuButton bind:menuOpen={$leftPanelOpen} />
    </div>
    <div class="close-mobile-search-div" class:open={mobileSearchOpen}>
        <Action
            imageURL="/img/previous.png"
            onClick={() => {
                mobileSearchOpen = false;
            }}
        />
    </div>
    <div class="logo-div" class:close={mobileSearchOpen}>
        <Logo />
    </div>
</div>
<div class="header-div" bind:this={headerEl}>
    <div class="main-header-div" class:collapse={mobileSearchOpen}>
        <div class="search-bar-div" class:open={mobileSearchOpen}>
            <SearchBar
                onClick={async () => {
                    await navigateTo("/devices", { searchQuery: $searchQuery });
                }}
                bind:searchString={$searchQuery}
                placeholderText={$texts.searchDevice}
                minWidth="250px"
                maxWidth="650px"
            />
        </div>
        <div class="right-header-div" class:close={mobileSearchOpen}>
            <div class="open-search-bar-div" class:close={mobileSearchOpen}>
                <Action
                    imageURL="/img/search.png"
                    onClick={() => {
                        leftPanelOpen.set(false);
                        mobileSearchOpen = true;
                    }}
                />
            </div>
            <Notification notificationsNumber={"1"} />
            <Logout
                buttonText={$texts.logout}
                imageUrl="/img/logout.png"
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

    .left-header-div .logo-div.close {
        display: none;
    }

    /* Menu button position */
    .left-header-div .menu-button-div {
        position: absolute;
        left: 10px;
    }

    .left-header-div .menu-button-div.close {
        display: none;
    }

    /* Close-search button slot (mobile only) */
    .left-header-div .close-mobile-search-div {
        position: absolute;
        left: 10px;
        display: none;
    }

    .left-header-div .close-mobile-search-div.open {
        display: block;
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

    .header-div .main-header-div.collapse {
        margin-left: 0;
    }

    /* Hidden search bar on mobile, flex on desktop */
    .search-bar-div {
        flex: 1;
        display: none;
        justify-content: center;
        align-items: center;
    }

    .search-bar-div.open {
        padding-left: 56px;
        padding-right: 10px;
        display: flex;
    }

    /* Mobile search open icon wrapper */
    .open-search-bar-div {
        flex: 1;
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 20px;
    }

    .open-search-bar-div.close {
        display: none;
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

    .right-header-div.close {
        display: none;
    }

    /* Desktop layout: show search bar and slide panel margin */
    @media (min-width: 880px) {
        .search-bar-div {
            display: flex;
        }
        .open-search-bar-div {
            display: none;
        }
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
