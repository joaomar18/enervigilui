<script lang="ts">
    import InputField from "../General/InputField.svelte";
    import HintInfo from "../General/HintInfo.svelte";
    import Selector from "../General/Selector.svelte";
    import { validateModbusRtuPort } from "$lib/logic/validation/device/modbusRtu";
    import { READ_PERIOD_LIM, TIMEOUT_LIM } from "$lib/types/device/base";
    import { SLAVE_ID_LIM, RETRIES_NUMBER_LIM } from "$lib/types/device/modbusRtu";
    import { showToast } from "$lib/logic/view/toast";
    import { ToastType } from "$lib/stores/view/toast";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { baudrateTexts, parityTexts, bytesizeTexts, stopbitsTexts } from "$lib/stores/lang/modbusRtuTexts";

    // Types
    import type { EditableDeviceModbusRTUConfig } from "$lib/types/device/modbusRtu";

    // Props
    export let configuration: EditableDeviceModbusRTUConfig; // Modbus RTU Configuration Object

    // Variables
    let validModbusRtuPort: boolean; // Modbus RTU Port is valid
    let validModbusSlaveID: boolean; // Modbus Slave ID is valid
    let validBaudrate: boolean; // Modbus Baudrate is valid
    let validParity: boolean; // Modbus Parity is valid
    let validByteSize: boolean; // Modbus Byte Size is valid
    let validStopBits: boolean; // Modbus Stop Bits is valid
    let validReadPeriod: boolean; // Read Period is valid
    let validTimeout: boolean; // Timeout is valid
    let validRetriesNumber: boolean; // Number of retries is valid

    $: validModbusRtuPort = validateModbusRtuPort(configuration.port);
    $: validModbusSlaveID = parseInt(configuration.slave_id) >= SLAVE_ID_LIM.MIN && parseInt(configuration.slave_id) <= SLAVE_ID_LIM.MAX;
    $: validBaudrate = Object.keys($baudrateTexts).includes(configuration.baudrate);
    $: validParity = Object.keys($parityTexts).includes(configuration.parity);
    $: validByteSize = Object.keys($bytesizeTexts).includes(configuration.bytesize);
    $: validStopBits = Object.keys($stopbitsTexts).includes(configuration.stopbits);
    $: validReadPeriod = parseInt(configuration.read_period) >= READ_PERIOD_LIM.MIN && parseInt(configuration.read_period) <= READ_PERIOD_LIM.MAX;
    $: validTimeout = parseInt(configuration.timeout) >= TIMEOUT_LIM.MIN && parseInt(configuration.timeout) <= TIMEOUT_LIM.MAX;
    $: validRetriesNumber = parseInt(configuration.retries) >= RETRIES_NUMBER_LIM.MIN && parseInt(configuration.retries) <= RETRIES_NUMBER_LIM.MAX;

    $: configuration.valid =
        validModbusRtuPort &&
        validModbusSlaveID &&
        validBaudrate &&
        validParity &&
        validByteSize &&
        validStopBits &&
        validReadPeriod &&
        validTimeout &&
        validRetriesNumber;
</script>

<!-- 
  Modbus RTU Configuration:
    • Form component for configuring Modbus RTU protocol settings.
    • Input fields: Communication port, slave ID, baudrate, parity, byte size, stop bits.
    • Timing settings: Read period, timeout, and retry attempts configuration.
    • Real-time validation with visual feedback and error handling.
    • Includes hint tooltips for each configuration parameter.
-->
<div class="device-input-div">
    <span>{$texts.communicationPort}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField bind:inputValue={configuration.port} inputInvalid={!validModbusRtuPort} enableInputInvalid={true} />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.communicationPortInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.slaveID}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={configuration.slave_id}
                inputInvalid={!validModbusSlaveID}
                enableInputInvalid={true}
                inputType="POSITIVE_INT"
                minValue={SLAVE_ID_LIM.MIN}
                maxValue={SLAVE_ID_LIM.MAX}
                limitsPassed={() => {
                    showToast("slaveIDError", ToastType.ALERT, {
                        minValue: SLAVE_ID_LIM.MIN,
                        maxValue: SLAVE_ID_LIM.MAX,
                    });
                }}
            />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.slaveIDInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.baudrate}</span>
    <div class="input-div">
        <Selector
            options={$baudrateTexts}
            bind:selectedOption={configuration.baudrate}
            inputInvalid={!validBaudrate}
            enableInputInvalid={true}
            scrollable={true}
        />
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.baudrateInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.parity}</span>
    <div class="input-div">
        <Selector
            options={$parityTexts}
            bind:selectedOption={configuration.parity}
            inputInvalid={!validParity}
            enableInputInvalid={true}
            scrollable={true}
        />
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.parityInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.bytesize}</span>
    <div class="input-div">
        <Selector
            options={$bytesizeTexts}
            bind:selectedOption={configuration.bytesize}
            inputInvalid={!validByteSize}
            enableInputInvalid={true}
            scrollable={true}
        />
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.bytesizeInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.stopbits}</span>
    <div class="input-div">
        <Selector
            options={$stopbitsTexts}
            bind:selectedOption={configuration.stopbits}
            inputInvalid={!validStopBits}
            enableInputInvalid={true}
            scrollable={true}
        />
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.stopbitsInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.readPeriod}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={configuration.read_period}
                inputInvalid={!validReadPeriod}
                enableInputInvalid={true}
                inputType="POSITIVE_INT"
                inputUnit={$texts.secondsUnit}
                minValue={READ_PERIOD_LIM.MIN}
                maxValue={READ_PERIOD_LIM.MAX}
                limitsPassed={() => {
                    showToast("readPeriodError", ToastType.ALERT, {
                        minValue: READ_PERIOD_LIM.MIN,
                        maxValue: READ_PERIOD_LIM.MAX,
                    });
                }}
            />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.readPeriodInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>
<div class="device-input-div">
    <span>{$texts.commTimeout}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={configuration.timeout}
                inputInvalid={!validTimeout}
                enableInputInvalid={true}
                inputType="POSITIVE_INT"
                inputUnit={$texts.secondsUnit}
                minValue={TIMEOUT_LIM.MIN}
                maxValue={TIMEOUT_LIM.MAX}
                limitsPassed={() => {
                    showToast("commTimeoutError", ToastType.ALERT, {
                        minValue: TIMEOUT_LIM.MIN,
                        maxValue: TIMEOUT_LIM.MAX,
                    });
                }}
            />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.commTimeoutInfo}</span>
            </HintInfo>
        </div>
    </div>
</div>
<div class="device-input-div">
    <span>{$texts.retries}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={configuration.retries}
                inputType="POSITIVE_INT"
                inputInvalid={!validRetriesNumber}
                enableInputInvalid={true}
                minValue={RETRIES_NUMBER_LIM.MIN}
                maxValue={RETRIES_NUMBER_LIM.MAX}
                limitsPassed={() => {
                    showToast("retriesError", ToastType.ALERT, {
                        minValue: RETRIES_NUMBER_LIM.MIN,
                        maxValue: RETRIES_NUMBER_LIM.MAX,
                    });
                }}
            />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.retriesInfo}</span>
            </HintInfo>
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
</style>
