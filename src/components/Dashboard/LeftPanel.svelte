<script lang="ts">
    import { navigateTo } from "$lib/ts/view/navigation";

    import Link from "./Link.svelte";
    import LangSelector from "../General/LangSelector.svelte";
    import Logo from "../General/Logo.svelte";

    // Texts
    import { selectedLang } from "$lib/stores/lang/definition";
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { LeftPanelStyle } from "$lib/style/dashboard";

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

    // Functions
    async function browseTo(path: string) {
        await navigateTo(path, $selectedLang);
    }

    function closePanel(): void {
        leftPanelOpen = false;
    }
</script>

<!-- 
  Left Side Panel: Overlay mask and collapsible left navigation with logo, sections, and language selector.  
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
    <div class="logo-div">
        <Logo />
    </div>
    <div class="content">
        <nav class="nav-section">
            <!-- Devices Section -->
            <div class="section">
                <span class="section-label">{$texts.general}</span>
                <Link
                    selected={activeSection.includes("/devices")}
                    buttonText={$texts.devices}
                    imageURL="/img/devices.png"
                    onClick={() => {
                        browseTo("/devices");
                    }}
                />
                <Link
                    selected={activeSection.includes("/mqtt")}
                    buttonText="MQTT"
                    imageURL="/img/mqtt.png"
                    onClick={() => {
                        browseTo("/mqtt");
                    }}
                />
            </div>

            <!-- Diagnostics Section -->
            <div class="section">
                <span class="section-label">{$texts.diagnostics}</span>
                <Link
                    selected={activeSection.includes("/health")}
                    buttonText={$texts.health}
                    imageURL="/img/health.png"
                    onClick={() => {
                        browseTo("/health");
                    }}
                />
                <Link
                    selected={activeSection.includes("/logs")}
                    buttonText={$texts.logs}
                    imageURL="/img/logs.png"
                    onClick={() => {
                        browseTo("/logs");
                    }}
                />
            </div>

            <!-- System Section -->
            <div class="section">
                <span class="section-label">{$texts.system}</span>
                <Link
                    selected={activeSection.includes("/settings")}
                    buttonText={$texts.settings}
                    imageURL="/img/settings.png"
                    onClick={() => {
                        browseTo("/settings");
                    }}
                />
                <Link
                    selected={activeSection.includes("/backup")}
                    buttonText={$texts.backup}
                    imageURL="/img/backup.png"
                    onClick={() => {
                        browseTo("/backup");
                    }}
                />
            </div>
        </nav>
        <div class="language-selector-div">
            <LangSelector invertOptions={true} />
            <span class="language-text">{$texts.language}</span>
        </div>
    </div>
</div>

<style>
    /* Overlay mask: full-screen semi-transparent backdrop */
    .mask {
        background-color: var(--overlay-mask-background-color);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 102;
        display: block;
    }

    /* Hide mask when panel closed */
    .mask.close {
        display: none;
    }

    /* Mask click area */
    .mask button {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: transparent;
        border: none;
    }

    /* Side panel container: off-canvas slide-in panel */
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
        z-index: 103;
    }

    /* Slide panel into view when open */
    .container.open {
        transform: translateX(0);
    }

    /* Logo area: fixed header slot inside panel */
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

    /* Main content: scrollable vertical flex container */
    .content {
        display: flex;
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
        flex-direction: column;
        justify-content: space-between;
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-track-color) var(--scrollbar-thumb-color);
    }

    /* Navigation section wrapper */
    .nav-section {
        padding: 16px 0;
        display: flex;
        flex-direction: column;
    }

    /* Individual menu section block */
    .section {
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }

    /* Section header label styling */
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

    /* Language selector area */
    .language-selector-div {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 30px;
    }

    /* Language text label */
    .language-text {
        color: var(--text-color);
        font-weight: var(--text-weight);
        font-size: 18px;
        padding-top: 10px;
    }

    /* Hide logo slot on larger screens */
    @media (min-width: 470px) {
        .container .logo-div {
            display: none;
        }
    }

    /* Disable mask above certain width */
    @media (min-width: 880px) {
        .mask {
            display: none;
        }
    }
</style>
