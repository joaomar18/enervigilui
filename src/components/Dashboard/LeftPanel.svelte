<script lang="ts">
    import { navigateTo } from "$lib/ts/navigation";

    import Link from "./Buttons/Link.svelte";
    import LangSelector from "../General/LangSelector.svelte";
    import Logo from "../General/Logo.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    //Props
    export let leftPanelOpen: boolean;
    export let activeSection: string;

    //Functions
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
<div class="mask" class:close={!leftPanelOpen}>
    <button on:click={closePanel} aria-label="Close Panel"></button>
</div>
<div class="container" class:open={leftPanelOpen}>
    <!--Only show logo div when logo div of header is disabled-->
    <div class="logo-div">
        <Logo />
    </div>
    <div class="content">
        <nav class="nav-section">
            <!-- Devices Section -->
            <div class="section">
                <span class="section-label">{$texts.general[$selectedLang]}</span>
                <Link
                    selected={activeSection.includes("/devices")}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.devices[$selectedLang]}
                    imageURL="/img/devices.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        browseTo("/devices");
                    }}
                />
                <Link
                    selected={activeSection.includes("/mqtt")}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText="MQTT"
                    imageURL="/img/mqtt.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        browseTo("/mqtt");
                    }}
                />
            </div>

            <!-- Diagnostics Section -->
            <div class="section">
                <span class="section-label">{$texts.diagnostics[$selectedLang]}</span>
                <Link
                    selected={activeSection.includes("/health")}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.health[$selectedLang]}
                    imageURL="/img/health.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        browseTo("/health");
                    }}
                />
                <Link
                    selected={activeSection.includes("/logs")}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.logs[$selectedLang]}
                    imageURL="/img/logs.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        browseTo("/logs");
                    }}
                />
            </div>

            <!-- System Section -->
            <div class="section">
                <span class="section-label">{$texts.system[$selectedLang]}</span>
                <Link
                    selected={activeSection.includes("/settings")}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.settings[$selectedLang]}
                    imageURL="/img/settings.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        browseTo("/settings");
                    }}
                />
                <Link
                    selected={activeSection.includes("/backup")}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.backup[$selectedLang]}
                    imageURL="/img/backup.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        browseTo("/backup");
                    }}
                />
            </div>
        </nav>
        <div class="language-selector-div">
            <LangSelector invertOptions={true} backgroundColor="#1e242b" borderColor="#323a45" />
            <span class="language-text">{$texts.language[$selectedLang]}</span>
        </div>
    </div>
</div>

<style>
    /* Overlay mask: full-screen semi-transparent backdrop */
    .mask {
        background-color: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
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
        background: #15191f;
        border-right: 1px solid rgba(255, 255, 255, 0.02);
        display: flex;
        flex-direction: column;
        transform: translateX(-100%);
        transition: transform 0.2s ease-in-out;
        z-index: 3;
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
        scrollbar-color: #323a45 #1e242b;
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
        font-weight: 500;
        color: rgba(255, 255, 255, 0.4);
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
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
        color: #eeeeee;
        font-weight: 300;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
