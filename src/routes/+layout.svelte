<script lang="ts">
    import { onMount } from "svelte";
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
    import MenuButton from "../components/General/MenuButton.svelte";
    import Logout from "../components/Dashboard/Buttons/Logout.svelte";
    import Notification from "../components/Dashboard/Buttons/Notification.svelte";
    import SearchBar from "../components/Dashboard/SearchBar.svelte";
    import Logo from "../components/General/Logo.svelte";

    let shouldRedirect: boolean = false;
    let redirectTarget: string | undefined = undefined;

    let leftPanelOpen: boolean = true;

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
    onMount(async () => {
        await waitInitialSplash(300);
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
        <div class="header-div">
            <div class="menu-button-div">
                <MenuButton
                    backgroundColor="transparent"
                    hoverColor="#323a45"
                    bind:menuOpen={leftPanelOpen}
                />
            </div>
            <div class="logo-div">
                <Logo />
            </div>
            <div class="main-header-div">
                <div class="search-bar-div">
                    <SearchBar
                        placeholderText={$texts.searchDevice[$selectedLang]}
                        backgroundColor="#14161c"
                        borderColor="#2a2e3a"
                        selectedBorderColor="#3B7DFF"
                    />
                </div>
                <div class="right-header-div">
                    <Notification
                        notificationsNumber={""}
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
        <LeftPanel {leftPanelOpen} activeSection={page.url.pathname} />
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

    .dashboard-container .header-div .logo-div {
        position: absolute;
        left: 56px;
        width: calc(250px - 56px);
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 25px;
    }

    .dashboard-container .header-div .menu-button-div {
        position: absolute;
        left: 10px;
    }

    .dashboard-container .header-div .main-header-div {
        margin: 0;
        padding: 0;
        margin-left: 250px;
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dashboard-container .right-header-div {
        padding-right: 20px;
        width: fit-content;
        height: fit-content;
        right: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 10px;
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
</style>
