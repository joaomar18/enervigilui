<script lang="ts">
    import { isDeviceViewPage, navigateTo } from "$lib/logic/view/navigation";
    import { isDeviceSubPage } from "$lib/logic/view/navigation";

    import Link from "./Link.svelte";
    import LangSelector from "../General/LangSelector.svelte";
    import Logo from "../General/Logo.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { currentDeviceID } from "$lib/stores/device/current";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { LeftPanelStyle } from "$lib/style/dashboard";
    import { SubLinkStyle } from "$lib/style/dashboard";

    // Stores
    import { currentPage } from "$lib/stores/view/navigation";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $LeftPanelStyle;

    // Props
    export let leftPanelOpen: boolean;
    export let activeSection: string;

    // Layout / styling props
    export let overlayMaskBackgroundColor: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let borderRightColor: string | undefined = undefined;
    export let scrollbarTrackColor: string | undefined = undefined;
    export let scrollbarThumbColor: string | undefined = undefined;
    export let sectionTextColor: string | undefined = undefined;
    export let sectionTextWeight: string | undefined = undefined;
    export let sectionBorderBottomColor: string | undefined = undefined;
    export let textColor: string | undefined = undefined;
    export let textWeight: string | undefined = undefined;

    $: localOverrides = {
        overlayMaskBackgroundColor,
        backgroundColor,
        borderRightColor,
        scrollbarTrackColor,
        scrollbarThumbColor,
        sectionTextColor,
        sectionTextWeight,
        sectionBorderBottomColor,
        textColor,
        textWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let devicesSubSection: boolean = false;
    let devicesViewPage: boolean = false;

    // Reactive Statements
    $: devicesSubSection = isDeviceSubPage($currentPage);
    $: devicesViewPage = isDeviceViewPage($currentPage);

    // Functions
    async function browseTo(path: string, params: Record<string, string> = {}) {
        await navigateTo(path, params);
    }

    function closePanel(): void {
        leftPanelOpen = false;
    }
</script>

<!--
    LeftPanel: main navigation sidebar for the dashboard.
    Contains navigation links for devices, diagnostics, system, and language selector.
    Responsive: overlays as a drawer on small screens, fixed on desktop.
    Uses Link, Logo, and LangSelector components for modularity and theme support.
    Handles open/close state and disables device-specific links when no device is selected.
-->
<div
    class="mask"
    style="
        --overlay-mask-background-color: {mergedStyle.overlayMaskBackgroundColor};
    "
    class:close={!leftPanelOpen}
>
    <button on:click={closePanel} aria-label="Close Panel"></button>
</div>
<div
    class="container"
    style="
        --background-color: {mergedStyle.backgroundColor};
        --border-right-color: {mergedStyle.borderRightColor};
        --scrollbar-track-color: {mergedStyle.scrollbarTrackColor};
        --scrollbar-thumb-color: {mergedStyle.scrollbarThumbColor};
        --section-text-color: {mergedStyle.sectionTextColor};
        --section-text-weight: {mergedStyle.sectionTextWeight};
        --section-border-bottom-color: {mergedStyle.sectionBorderBottomColor};
        --text-color: {mergedStyle.textColor};
        --text-weight: {mergedStyle.textWeight};
    "
    class:open={leftPanelOpen}
>
    <!--Only show logo div when logo div of header is disabled-->
    <div class="logo-div" class:management-page={!devicesViewPage} class:device-view-page={devicesViewPage}>
        <Logo />
    </div>
    <div class="content">
        <nav class="nav-section">
            <!-- Devices Section -->
            <div class="section">
                <span class="section-label">{$texts.general}</span>
                <div class="section-links-div">
                    <Link
                        selected={activeSection.includes("/devices")}
                        showExpandArrow={devicesSubSection}
                        triggerExpand={devicesSubSection}
                        buttonText={$texts.devices}
                        imageURL="/img/devices.svg"
                        onClick={() => {
                            browseTo("/devices");
                        }}
                    >
                        <Link
                            style={$SubLinkStyle}
                            selected={activeSection.includes("/add")}
                            buttonText={$texts.addNew}
                            imageURL="/img/plus-simple.svg"
                            onClick={() => {
                                browseTo("/devices/add");
                            }}
                        />
                        <Link
                            style={$SubLinkStyle}
                            disabled={!$currentDeviceID}
                            selected={activeSection.includes("/edit")}
                            buttonText={$texts.editConfig}
                            imageURL="/img/edit_pencil.svg"
                            disabledImageURL="/img/edit_pencil_muted.svg"
                            onClick={() => {
                                browseTo("/devices/edit", { deviceId: String($currentDeviceID) });
                            }}
                        />
                        <Link
                            style={$SubLinkStyle}
                            disabled={!$currentDeviceID}
                            selected={activeSection.includes("/general")}
                            buttonText={$texts.generalView}
                            imageURL="/img/general_view.svg"
                            disabledImageURL="/img/general_view_muted.svg"
                            onClick={() => {
                                browseTo("/devices/general_view", { deviceId: String($currentDeviceID) });
                            }}
                        />
                        <Link
                            style={$SubLinkStyle}
                            disabled={!$currentDeviceID}
                            selected={activeSection.includes("/analytics")}
                            buttonText={$texts.dataAnalytics}
                            imageURL="/img/analytics.svg"
                            disabledImageURL="/img/analytics_muted.svg"
                            onClick={() => {
                                browseTo("/devices/analytics", { deviceId: String($currentDeviceID) });
                            }}
                        />
                    </Link>

                    <Link
                        selected={activeSection.includes("/mqtt")}
                        buttonText="MQTT"
                        imageURL="/img/mqtt.svg"
                        onClick={() => {
                            browseTo("/mqtt");
                        }}
                    ></Link>
                </div>
            </div>

            <!-- Diagnostics Section -->
            <div class="section">
                <span class="section-label">{$texts.diagnostics}</span>
                <div class="section-links-div">
                    <Link
                        selected={activeSection.includes("/health")}
                        buttonText={$texts.health}
                        imageURL="/img/health.svg"
                        onClick={() => {
                            browseTo("/health");
                        }}
                    ></Link>
                    <Link
                        selected={activeSection.includes("/logs")}
                        buttonText={$texts.logs}
                        imageURL="/img/logs.svg"
                        onClick={() => {
                            browseTo("/logs");
                        }}
                    ></Link>
                </div>
            </div>

            <!-- System Section -->
            <div class="section">
                <span class="section-label">{$texts.system}</span>
                <div class="section-links-div">
                    <Link
                        selected={activeSection.includes("/settings")}
                        buttonText={$texts.settings}
                        imageURL="/img/settings.svg"
                        onClick={() => {
                            browseTo("/settings");
                        }}
                    ></Link>
                    <Link
                        selected={activeSection.includes("/backup")}
                        buttonText={$texts.backup}
                        imageURL="/img/backup.svg"
                        onClick={() => {
                            browseTo("/backup");
                        }}
                    ></Link>
                </div>
            </div>
        </nav>
        <div class="language-selector-div">
            <LangSelector invertOptions={true} />
            <span class="language-text">{$texts.language}</span>
        </div>
    </div>
</div>

<style>
    /* Overlay mask for panel on small screens */
    .mask {
        background-color: var(--overlay-mask-background-color);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 110;
        display: block;
    }

    /* Hide mask when panel is closed */
    .mask.close {
        display: none;
    }

    /* Full-area button for closing panel */
    .mask button {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: transparent;
        border: none;
    }

    /* Main sidebar container */
    .container {
        position: fixed;
        top: 0;
        left: 0;
        width: 250px;
        height: calc(100vh - 74px);
        padding-top: 74px;
        background: var(--background-color);
        border-right: 1px solid var(--border-right-color);
        display: flex;
        flex-direction: column;
        transform: translateX(-100%);
        transition: transform 0.2s ease-in-out;
        z-index: 111;
    }

    /* Slide in when open */
    .container.open {
        transform: translateX(0);
    }

    /* Logo area at top of sidebar */
    .container .logo-div {
        box-sizing: border-box;
        position: absolute;
        top: 0px;
        height: 74px;
        left: 56px;
        width: calc(250px - 56px);
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 25px;
    }

    /* Main content area with nav and language selector */
    .content {
        display: flex;
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
        flex-direction: column;
        justify-content: space-between;
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-track-color) var(--scrollbar-thumb-color);
        scrollbar-gutter: stable;
    }

    /* Navigation section */
    .nav-section {
        padding: 16px 0;
        display: flex;
        flex-direction: column;
    }

    /* Section group (devices, diagnostics, system) */
    .section {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }

    /* Section label styling */
    .section-label {
        box-sizing: content-box;
        display: block;
        margin: 0;
        margin-bottom: 2px;
        padding: 10px;
        padding-bottom: 5px;
        padding-right: 0px;
        font-size: 0.75rem;
        font-weight: var(--section-text-weight);
        color: var(--section-text-color);
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 2px solid var(--section-border-bottom-color);
        width: calc(100% - 40px);
    }

    /* Links container for each section */
    .section .section-links-div {
        margin: 0;
        padding: 0;
        width: calc(100% - 30px);
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 5px;
    }

    /* Language selector at bottom */
    .language-selector-div {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 30px;
    }

    /* Language label styling */
    .language-text {
        color: var(--text-color);
        font-weight: var(--text-weight);
        font-size: 18px;
        padding-top: 10px;
    }

    /* Hide logo on management page (desktop) */
    @media (min-width: 470px) {
        .container .logo-div.management-page {
            display: none;
        }
    }

    /* Hide mask and logo on device view (desktop) */
    @media (min-width: 880px) {
        .mask {
            display: none;
        }
        .container .logo-div.device-view-page {
            display: none;
        }
    }
</style>
