<script lang="ts">
    import { goto } from "$app/navigation";
    import Link from "./Buttons/Link.svelte";
    import LangSelector from "../General/LangSelector.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "../../stores/lang";

    //Props
    export let leftPanelOpen: boolean;
    export let activeSection: string;

    function navigateTo(path: string) {
        goto(path);
    }
</script>

<div class="container" class:open={leftPanelOpen}>
    <div class="content">
        <nav class="nav-section">
            <!-- Devices Section -->
            <div class="section">
                <span class="section-label">{$texts.general[$selectedLang]}</span>
                <Link
                    selected={activeSection === "/devices"}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.devices[$selectedLang]}
                    imageURL="./img/devices.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        navigateTo("/devices");
                    }}
                />
                <Link
                    selected={activeSection == "/mqtt"}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText="MQTT"
                    imageURL="./img/mqtt.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        navigateTo("/mqtt");
                    }}
                />
            </div>

            <!-- Diagnostics Section -->
            <div class="section">
                <span class="section-label">{$texts.diagnostics[$selectedLang]}</span>
                <Link
                    selected={activeSection === "/health"}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.health[$selectedLang]}
                    imageURL="./img/health.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        navigateTo("/health");
                    }}
                />
                <Link
                    selected={activeSection === "/logs"}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.logs[$selectedLang]}
                    imageURL="./img/logs.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        navigateTo("/logs");
                    }}
                />
            </div>

            <!-- System Section -->
            <div class="section">
                <span class="section-label">{$texts.system[$selectedLang]}</span>
                <Link
                    selected={activeSection === "/settings"}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.settings[$selectedLang]}
                    imageURL="./img/settings.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        navigateTo("/settings");
                    }}
                />
                <Link
                    selected={activeSection === "/backup"}
                    paddingLeft="10px"
                    paddingRight="10px"
                    paddingLeftText="10px"
                    buttonText={$texts.backup[$selectedLang]}
                    imageURL="./img/backup.png"
                    imageWidth="25px"
                    imageHeight="25px"
                    fontSize="1rem"
                    backgroundColor="transparent"
                    hoverColor="rgba(255, 255, 255, 0.05)"
                    selectedColor="#2F4138"
                    onClick={() => {
                        navigateTo("/backup");
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
    .container {
        position: fixed;
        top: 0;
        left: 0;
        width: 0px;
        height: calc(100vh - 74px);
        padding-top: 74px;
        background: #15191f;
        border-right: 1px solid rgba(255, 255, 255, 0.02);
        display: flex;
        flex-direction: column;
        transition: width 0.1s ease-in-out;
    }

    .container.open {
        width: 250px;
    }

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

    /* Navigation Section */
    .nav-section {
        padding: 16px 0;
        display: flex;
        flex-direction: column;
    }

    .section {
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }

    .section-label {
        box-sizing: content-box;
        display: block;
        margin: 0;
        padding: 10px;
        padding-right: 0px;
        font-size: 0.75rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.4);
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        width: calc(100% - 40px);
    }

    .language-selector-div {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 30px;
    }

    .language-text {
        color: #eeeeee;
        font-weight: 300;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 18px;
        padding-top: 10px;
    }
</style>
