<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { autoLogin } from "../ts/login";
    import { page } from "$app/state";
    import { logoutUser } from "../ts/login";
    import { navigateTo } from "../ts/navigation";
    import { fade } from "svelte/transition";

    // Stores for multi-language support
    import { selectedLang, texts } from "../stores/lang";

    // Splash screen store
    import { splashDone } from "../stores/auth";

    import LeftPanel from "../components/Dashboard/LeftPanel.svelte";
    import Logo from "../components/General/Logo.svelte";
    import MenuButton from "../components/General/MenuButton.svelte";
    import Logout from "../components/Dashboard/Buttons/Logout.svelte";
    import Notification from "../components/Dashboard/Buttons/Notification.svelte";
    import SearchBar from "../components/Dashboard/SearchBar.svelte";
    import Action from "../components/Dashboard/Buttons/Action.svelte";

    let shouldRedirect: boolean = false;
    let redirectTarget: string | undefined = undefined;

    let leftPanelOpen: boolean;
    let mobileSearchOpen: boolean = false;

    let leftHeaderEl: Node;
    let headerEl: Node;

    async function checkAuthentication() {
        const path = window.location.pathname;
        const { status } = await autoLogin("/api/auto_login", "POST");

        if (status === 200) {
            // Authenticated
            if (path === "/" || path === "/login") {
                shouldRedirect = true;
                redirectTarget = "/devices";
            }
        } else {
            // Unauthenticated or failed
            if (path !== "/login") {
                shouldRedirect = true;
                redirectTarget = "/login";
            }
        }
    }

    async function waitInitialSplash(minSplashDuration: number): Promise<void> {
        await checkAuthentication();

        if (shouldRedirect && redirectTarget) {
            await navigateTo(redirectTarget, $selectedLang);
        }

        await new Promise((res) => setTimeout(res, minSplashDuration));

        splashDone.set(true);
    }

    function handleClickOutside(event: MouseEvent): void {
        if (
            leftHeaderEl &&
            headerEl &&
            !leftHeaderEl.contains(event.target as Node) &&
            !headerEl.contains(event.target as Node)
        ) {
            mobileSearchOpen = false;
        }
    }

    onMount(() => {
        leftPanelOpen = window.matchMedia("(min-width: 880px)").matches;

        (async () => {
            await waitInitialSplash(300);
        })();

        const mql = window.matchMedia("(min-width: 880px)");
        const handleMqChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                mobileSearchOpen = false;
            }
        };

        mql.onchange = handleMqChange;
        window.addEventListener("click", handleClickOutside);

        return () => {
            mql.onchange = null;
            window.removeEventListener("click", handleClickOutside);
        };
    });

    async function logout(): Promise<void> {
        const { status } = await logoutUser("/api/logout", "POST");
        await navigateTo("/login", $selectedLang, true);
    }
</script>

{#if !$splashDone}
    <!-- Splash screen -->
    <div class="splash-container">
        <div class="loader-wrapper">
            <div class="spinner"></div>
            <div class="image-div"></div>
        </div>
        <footer class="footer">
            <span class="brand fade-in">ENERVIGIL</span>
            <span class="product fade-in">EDGE</span>
        </footer>
    </div>
{:else if !page.url.pathname.startsWith("/login")}
    <div class="dashboard-container" in:fade={{ duration: 300 }}>
        <LeftPanel bind:leftPanelOpen activeSection={page.url.pathname} />
        <div class="left-header-div" bind:this={leftHeaderEl}>
            <div class="menu-button-div" class:close={mobileSearchOpen}>
                <MenuButton
                    backgroundColor="transparent"
                    hoverColor="#323a45"
                    bind:menuOpen={leftPanelOpen}
                />
            </div>
            <div class="close-mobile-search-div" class:open={mobileSearchOpen}>
                <Action
                    backgroundColor="#14161c"
                    borderColor="#2a2e3a"
                    hoverColor="#2A2E3A"
                    imageURL="./img/previous.png"
                    imageWidth="25px"
                    imageHeight="25px"
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
                        placeholderText={$texts.searchDevice[$selectedLang]}
                        backgroundColor="#14161c"
                        buttonBgColor="#1C2126"
                        buttonHoverColor="#232731"
                        borderColor="#2a2e3a"
                        buttonBorderColor="#2A2E3A"
                        selectedBorderColor="#3B7DFF"
                    />
                </div>
                <div class="right-header-div" class:close={mobileSearchOpen}>
                    <div class="open-search-bar-div" class:close={mobileSearchOpen}>
                        <Action
                            backgroundColor="#14161c"
                            borderColor="#2a2e3a"
                            hoverColor="#2A2E3A"
                            imageURL="./img/search.png"
                            imageWidth="25px"
                            imageHeight="25px"
                            onClick={() => {
                                leftPanelOpen = false;
                                mobileSearchOpen = true;
                            }}
                        />
                    </div>
                    <Notification
                        notificationsNumber={"1"}
                        backgroundColor="#14161c"
                        hoverColor="#2A2E3A"
                        borderColor="#2a2e3a"
                    />
                    <Logout
                        width="125px"
                        height="40px"
                        borderRadius="20px"
                        backgroundColor="#14161c"
                        hoverColor="#2A2E3A"
                        borderColor="#2a2e3a"
                        buttonText={$texts.logout[$selectedLang]}
                        fontSize="1rem"
                        paddingLeft="10px"
                        paddingRight="20px"
                        imageUrl="./img/logout.png"
                        imageWidth="32px"
                        imageHeight="32px"
                        onClick={logout}
                    />
                </div>
            </div>
        </div>
        <main class="content" class:open={leftPanelOpen}>
            <slot />
        </main>
    </div>
{:else}
    <slot />
{/if}

<style>
    /* Fullscreen container for the splash screen */
    .splash-container {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100vh;
        min-width: 320px;
        min-height: 760px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #181d23;
    }

    /* Wrapper to center spinner + logo */
    .splash-container .loader-wrapper {
        position: relative;
        width: 280px;
        height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Circular loading animation ring */
    .loader-wrapper .spinner {
        position: absolute;
        width: 280px;
        height: 280px;
        border: 6px solid transparent;
        border-top: 6px solid #00c78b;
        border-radius: 50%;
        animation: spin 1.2s linear infinite;
        z-index: 0;
        box-shadow: 0px 0px 15px rgba(0, 199, 139, 0.2);
    }

    /* Circular logo background in center */
    .loader-wrapper .image-div {
        padding: 0;
        margin: 0;
        width: 256px;
        height: 256px;
        background-color: #202731;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url("./img/logo.png");
        box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.2);
        background-size: auto;
    }

    /* Footer container for brand name */
    .splash-container .footer {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
    }

    /* Base style for both ENERVIGIL and EDGE text */
    .splash-container .footer span {
        font-family: "Montserrat", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 32px;
        text-align: center;
        font-weight: 500;
    }

    /* Fade-in animation for brand and product text */
    .splash-container .footer span.fade-in {
        opacity: 0;
        transform: translateY(10px);
        animation: fadeIn 1s ease-out forwards;
        animation-delay: 0.5s;
    }

    /* Gradient brand styling for "ENERVIGIL" */
    .splash-container .footer span.brand {
        background: linear-gradient(90deg, #4caf50, #2196f3);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Lighter color for "EDGE" product label */
    .splash-container .footer span.product {
        padding-left: 10px;
        color: #aaa;
    }

    /* Main Dashboard container uses grid layout */
    .dashboard-container {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100vh;
        min-width: 320px;
        min-height: 760px;
        display: flex;
        justify-content: start;
        align-items: center;
    }

    .dashboard-container .header-div {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 74px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .dashboard-container .left-header-div {
        position: fixed;
        left: 0px;
        top: 0px;
        width: fit-content;
        height: 74px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }

    .dashboard-container .left-header-div .logo-div {
        box-sizing: border-box;
        position: absolute;
        left: 56px;
        width: calc(250px - 56px);
        display: none;
        justify-content: start;
        align-items: center;
        padding-left: 25px;
    }

    .dashboard-container .left-header-div .logo-div.close {
        display: none;
    }

    .dashboard-container .left-header-div .menu-button-div {
        position: absolute;
        left: 10px;
    }

    .dashboard-container .left-header-div .menu-button-div.close {
        display: none;
    }

    .dashboard-container .left-header-div .close-mobile-search-div {
        position: absolute;
        left: 10px;
        display: none;
    }

    .dashboard-container .left-header-div .close-mobile-search-div.open {
        display: block;
    }

    .dashboard-container .header-div .main-header-div {
        margin: 0;
        padding: 0;
        margin-left: calc(250px - (250px - 56px));
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        z-index: 0;
    }

    .dashboard-container .header-div .main-header-div.collapse {
        margin-left: 0;
    }

    .dashboard-container .content {
        position: relative;
        margin-left: 0px;
        height: fit-content;
        min-height: 760px;
        width: 100%;
        transition: margin-left 0.2s ease-in-out;
    }

    .dashboard-container .content.open {
        margin-left: 250px;
    }

    .dashboard-container .search-bar-div {
        flex: 1;
        display: none;
        justify-content: center;
        align-items: center;
    }

    .dashboard-container .search-bar-div.open {
        padding-left: 56px;
        padding-right: 10px;
        display: flex;
    }

    .dashboard-container .open-search-bar-div {
        flex: 1;
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 20px;
    }

    .dashboard-container .open-search-bar-div.close {
        display: none;
    }

    .dashboard-container .right-header-div {
        padding-right: 20px;
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 20px;
    }

    .dashboard-container .right-header-div.close {
        display: none;
    }

    /* Spinner keyframe animation (continuous rotation) */
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Text entrance animation (fade + slide up) */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Desktop-specific overrides */
    @media (max-width: 415px) {
        .splash-container .loader-wrapper {
            width: 200px;
            height: 200px;
        }

        .loader-wrapper .spinner {
            width: 200px;
            height: 200px;
            border-width: 5px;
        }

        .loader-wrapper .image-div {
            width: 180px;
            height: 180px;
            background-size: 50%;
        }

        .splash-container .footer span {
            font-size: 24px; /* reduce brand text size too */
        }
    }

    @media (min-height: 760px) {
        .dashboard-container .content {
            min-height: 100vh;
        }
    }

    /* Responsive layout for desktops */
    @media (min-width: 880px) {
        .dashboard-container .search-bar-div {
            display: flex;
        }
        .dashboard-container .open-search-bar-div {
            display: none;
        }
        .dashboard-container .header-div .main-header-div {
            justify-content: space-between;
        }
    }

    @media (min-width: 440px) {
        .dashboard-container .left-header-div .logo-div {
            display: flex;
        }
        .dashboard-container .header-div .main-header-div {
            margin-left: 250px;
        }
    }
</style>
