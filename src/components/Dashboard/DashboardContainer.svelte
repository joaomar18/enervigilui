<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { closeToast } from "$lib/logic/view/toast";
    import { isDeviceSubPage } from "$lib/logic/view/navigation";
    import LeftPanel from "./LeftPanel.svelte";
    import Header from "./Header.svelte";
    import DevicesHeader from "./DevicesHeader.svelte";
    import Toast from "../General/Toast.svelte";
    import MenuButton from "../General/MenuButton.svelte";
    import Logo from "../General/Logo.svelte";
    import Action from "../General/Action.svelte";

    // Stores
    import { currentPage, leftPanelOpen, loadedDone, showSubLoader } from "$lib/stores/view/navigation";
    import { displayToast, toastKey, toastType, toastVariables } from "$lib/stores/view/toast";

    // Texts
    import { toastTexts } from "$lib/stores/lang/toastTexts";

    // Variables
    let headerEl: HTMLDivElement;
    let leftHeaderEl: HTMLDivElement;
    let mobileSearchOpen: boolean;
    let clickEventListenerDefined: boolean = false;

    // Reactive Statements
    $: if (mobileSearchOpen && !clickEventListenerDefined) {
        window.addEventListener("click", handleClickOutside);
        clickEventListenerDefined = true;
    }

    $: if (!mobileSearchOpen && clickEventListenerDefined) {
        window.removeEventListener("click", handleClickOutside);
        clickEventListenerDefined = false;
    }

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

        //Clean-up logic
        return () => {
            desktopMatch.onchange = null;
            if (clickEventListenerDefined) {
                window.removeEventListener("click", handleClickOutside);
            }
        };
    });
</script>

<!-- 
  Dashboard Container:
    • Main dashboard layout with left sidebar panel and header navigation.
    • Content area includes toast notifications, loading spinner, and page content slot.
    • Responsive design with sidebar that auto-opens on desktop and collapses on mobile.
    • Handles loading states with spinner overlay until content is ready.
-->
<div class="dashboard-container" in:fade={{ duration: 300 }}>
    <LeftPanel bind:leftPanelOpen={$leftPanelOpen} activeSection={$currentPage} />
    <div class="left-header-div" bind:this={leftHeaderEl}>
        <div class="menu-button-div" class:close={mobileSearchOpen}>
            <MenuButton bind:menuOpen={$leftPanelOpen} />
        </div>
        <div class="close-mobile-search-div" class:open={mobileSearchOpen}>
            <Action
                imageURL="/img/previous.svg"
                onClick={() => {
                    mobileSearchOpen = false;
                }}
            />
        </div>
        <div class="logo-div" class:close={mobileSearchOpen}>
            <Logo />
        </div>
    </div>
    {#if isDeviceSubPage($currentPage)}
        <DevicesHeader />
    {:else}
        <Header bind:headerEl bind:mobileSearchOpen />
    {/if}
    <main class="content" class:open={$leftPanelOpen}>
        <div class="alerts-div" class:prioritize={$displayToast} class:sidebar-open={$leftPanelOpen}>
            {#if $displayToast}
                <Toast bottomPos="0px" toastText={$toastTexts[$toastKey]} toastType={$toastType} toastVariables={$toastVariables} onClick={closeToast} />
            {/if}
        </div>
        <div class="container-div">
            <div class="content-div">
                <div class="loader-div">
                    <div class="loader-div-wrapper" class:close={$loadedDone}>
                        <div class="spinner" class:show={$showSubLoader}></div>
                    </div>
                </div>
                <div class="section-content-div" class:hide={!$loadedDone}>
                    <slot class="section-content-div" />
                </div>
            </div>
        </div>
    </main>
</div>

<style>
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

    /* Main dashboard flex container */
    .dashboard-container {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        min-width: 350px;
        min-height: 600px;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }

    /* Dashboard content area with slide-in margin */
    .dashboard-container .content {
        box-sizing: border-box;
        position: relative;
        padding-left: 0px;
        height: fit-content;
        min-height: 600px;
        width: 100%;
        transition: padding-left 0.2s ease-in-out;
    }

    /* Fixed div for alerts display */
    .dashboard-container .content .alerts-div {
        position: fixed;
        bottom: 50px;
        width: 100%;
        left: 0;
        z-index: 99;
        transition: margin-left 0.2s ease-in-out;
    }

    /* Send alerts div to front */
    .dashboard-container .content .alerts-div.prioritize {
        z-index: 102;
    }

    /* Container: outer wrapper with padding and full height */
    .dashboard-container .container-div {
        box-sizing: border-box;
        margin: 0;
        padding: 30px;
        height: 100%;
    }

    /* Content div */
    .dashboard-container .container-div .content-div {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        position: relative;
    }

    /* Loader overlay: full-screen dark backdrop with centered spinner */
    .dashboard-container .container-div .content-div .loader-div {
        position: absolute;
        inset: 0;
        margin: 0;
        padding: 0;
        padding-bottom: 60px;
        box-sizing: border-box;
        width: 100%;
        height: calc(100vh - 74px - 60px);
    }

    /* Loader wrapper for spinner */
    .dashboard-container .container-div .content-div .loader-div .loader-div-wrapper {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #181d23;
        z-index: 1;
    }

    /* Loader hidden state: fade out and drop behind content */
    .dashboard-container .container-div .content-div .loader-div .loader-div-wrapper.close {
        opacity: 0;
        z-index: 0;
        pointer-events: none;
    }

    /* Spinner: circular border animation */
    .dashboard-container .container-div .content-div .loader-div .loader-div-wrapper .spinner {
        width: 128px;
        height: 128px;
        border: 4px solid rgba(255, 255, 255, 0.2);
        border-top-color: #fff;
        border-radius: 50%;
        animation: content-spin 1s linear infinite;
        opacity: 0;
    }

    /* Spinner: show loader when page takes too long to load */
    .dashboard-container .container-div .content-div .loader-div .loader-div-wrapper .spinner.show {
        opacity: 1;
    }

    /* Hide Section Content div */
    .dashboard-container .container-div .content-div .section-content-div.hide {
        display: none;
    }

    /* Spin animation: full rotation */
    @keyframes content-spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Desktop layout: sidebar padding and alert positioning when sidebar is open */
    @media (min-width: 880px) {
        .dashboard-container .content.open {
            padding-left: 250px;
        }
        .dashboard-container .content .alerts-div.sidebar-open {
            margin-left: 250px;
            width: calc(100% - 250px);
        }
    }

    /* Ensure content fills taller viewports */
    @media (min-height: 600px) {
        .dashboard-container .content {
            min-height: calc(100vh - 74px);
        }
    }

    /* Show logo slot and fixed header margin on wider screens */
    @media (min-width: 470px) {
        .left-header-div .logo-div {
            display: flex;
        }
    }
</style>
