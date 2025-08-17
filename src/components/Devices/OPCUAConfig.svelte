<script lang="ts">
    import InputField from "../General/InputField.svelte";
    import HintInfo from "../General/HintInfo.svelte";
    import { validateOpcUaUrl } from "$lib/ts/validation/device";
    import { READ_PERIOD_LIM, TIMEOUT_LIM } from "$lib/stores/devices";

    // Stores for multi-language support
    import { texts, selectedLang } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/ts/view/notification";

    // Types
    import type { EditableDeviceOPCUAConfig } from "$lib/stores/devices";

    // Props
    export let opcuaConfig: EditableDeviceOPCUAConfig; // OPC UA Configuration Object

    // Variables
    let validOpcUaUrl: boolean; // OPC UA Url is valid
    let validReadPeriod: boolean; // Read Period is valid
    let validTimeout: boolean; // Timeout is valid

    $: validOpcUaUrl = validateOpcUaUrl(opcuaConfig.url);
    $: validReadPeriod = parseInt(opcuaConfig.read_period) >= READ_PERIOD_LIM.MIN && parseInt(opcuaConfig.read_period) <= READ_PERIOD_LIM.MAX;
    $: validTimeout = parseInt(opcuaConfig.timeout) >= TIMEOUT_LIM.MIN && parseInt(opcuaConfig.timeout) <= TIMEOUT_LIM.MAX;
    $: opcuaConfig.valid = validOpcUaUrl && validReadPeriod && validTimeout;
</script>

<!--
  OPCUAConfig: This component renders the configuration form elements for OPC UA device communication,
  including network address, read period, timeout, and optional authentication fields.
-->
<div class="device-input-div">
    <span>{$texts.networkAddress[$selectedLang]}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField bind:inputValue={opcuaConfig.url} inputInvalid={!validOpcUaUrl} enableInputInvalid={true} />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.networkAddressInfo[$selectedLang]}</span>
            </HintInfo>
        </div>
    </div>
</div>
<div class="device-input-div">
    <span>{$texts.readPeriod[$selectedLang]}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={opcuaConfig.read_period}
                inputInvalid={!validReadPeriod}
                enableInputInvalid={true}
                inputType="POSITIVE_INT"
                inputUnit={$texts.secondsUnit[$selectedLang]}
                minValue={READ_PERIOD_LIM.MIN}
                maxValue={READ_PERIOD_LIM.MAX}
                limitsPassed={() => {
                    showAlert($texts.readPeriodError, {
                        minValue: READ_PERIOD_LIM.MIN,
                        maxValue: READ_PERIOD_LIM.MAX,
                    });
                }}
            />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.readPeriodInfo[$selectedLang]}</span>
            </HintInfo>
        </div>
    </div>
</div>
<div class="device-input-div">
    <span>{$texts.commTimeout[$selectedLang]}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={opcuaConfig.timeout}
                inputInvalid={!validTimeout}
                enableInputInvalid={true}
                inputType="POSITIVE_INT"
                inputUnit={$texts.secondsUnit[$selectedLang]}
                minValue={TIMEOUT_LIM.MIN}
                maxValue={TIMEOUT_LIM.MAX}
                limitsPassed={() => {
                    showAlert($texts.commTimeoutError, {
                        minValue: TIMEOUT_LIM.MIN,
                        maxValue: TIMEOUT_LIM.MAX,
                    });
                }}
            />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.commTimeoutInfo[$selectedLang]}</span>
            </HintInfo>
        </div>
    </div>
</div>
<div class="optional-div">
    <span class="optional-text">{$texts.authenticationOptional[$selectedLang]}</span>
    <div class="device-input-div">
        <span>{$texts.username[$selectedLang]}</span>
        <div class="input-div">
            <div class="input-content-div">
                <InputField bind:inputValue={opcuaConfig.username} />
            </div>
            <div class="info-div">
                <HintInfo>
                    <span class="info-text">{$texts.commUsernameInfo[$selectedLang]}</span>
                </HintInfo>
            </div>
        </div>
    </div>
    <div class="device-input-div">
        <span>{$texts.password[$selectedLang]}</span>
        <div class="input-div">
            <div class="input-content-div">
                <InputField bind:inputValue={opcuaConfig.password} inputType="PASSWORD" />
            </div>
            <div class="info-div">
                <HintInfo>
                    <span class="info-text">{$texts.commPasswordInfo[$selectedLang]}</span>
                </HintInfo>
            </div>
        </div>
    </div>
</div>

<style>
    /* Device input row styling */
    .device-input-div {
        position: relative;
        margin-top: 30px;
        min-height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;
    }

    /* Label text for device input fields */
    .device-input-div span {
        text-align: left;
        color: #f5f5f5;
        font-size: 1rem;
        font-weight: 400;
        margin: 0;
        padding: 0;
        width: 250px;
    }

    /* Input field container styling */
    .input-div {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        margin: 0;
        padding: 0;
        width: fit-content;
        height: 100%;
    }

    /* Content area for input fields */
    .input-div .input-content-div {
        width: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Info text styling for hints */
    .info-div .info-text {
        padding: 10px;
        padding-right: 40px;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: white;
    }

    /* Optional authentication section styling */
    .optional-div {
        padding-top: 50px;
    }

    /* Optional authentication label styling */
    .optional-div .optional-text {
        display: block;
        width: 100%;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding-bottom: 5px;
        color: rgb(170, 170, 170);
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
    }
</style>
