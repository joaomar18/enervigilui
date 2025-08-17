<script lang="ts">
    import InputField from "../General/InputField.svelte";
    import HintInfo from "../General/HintInfo.svelte";
    import Selector from "../General/Selector.svelte";
    import { validateModbusRtuPort } from "$lib/ts/validation/device";
    import { READ_PERIOD_LIM, TIMEOUT_LIM, SLAVE_ID_LIM, RETRIES_NUMBER_LIM } from "$lib/stores/devices";

    // Stores for multi-language support
    import { texts, baudrateTexts, parityTexts, bytesizeTexts, stopbitsTexts, selectedLang } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/ts/view/notification";

    // Types
    import type { EditableDeviceModbusRTUConfig } from "$lib/stores/devices";

    // Props
    export let modbusRTUConfig: EditableDeviceModbusRTUConfig; // Modbus RTU Configuration Object

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

    $: validModbusRtuPort = validateModbusRtuPort(modbusRTUConfig.port);
    $: validModbusSlaveID = parseInt(modbusRTUConfig.slave_id) >= SLAVE_ID_LIM.MIN && parseInt(modbusRTUConfig.slave_id) <= SLAVE_ID_LIM.MAX;
    $: validBaudrate = Object.keys($baudrateTexts).includes(modbusRTUConfig.baudrate);
    $: validParity = Object.keys($parityTexts).includes(modbusRTUConfig.parity);
    $: validByteSize = Object.keys($bytesizeTexts).includes(modbusRTUConfig.bytesize);
    $: validStopBits = Object.keys($stopbitsTexts).includes(modbusRTUConfig.stopbits);
    $: validReadPeriod = parseInt(modbusRTUConfig.read_period) >= READ_PERIOD_LIM.MIN && parseInt(modbusRTUConfig.read_period) <= READ_PERIOD_LIM.MAX;
    $: validTimeout = parseInt(modbusRTUConfig.timeout) >= TIMEOUT_LIM.MIN && parseInt(modbusRTUConfig.timeout) <= TIMEOUT_LIM.MAX;
    $: validRetriesNumber = parseInt(modbusRTUConfig.retries) >= RETRIES_NUMBER_LIM.MIN && parseInt(modbusRTUConfig.retries) <= RETRIES_NUMBER_LIM.MAX;

    $: modbusRTUConfig.valid =
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

<div class="device-input-div">
    <span>{$texts.communicationPort[$selectedLang]}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField bind:inputValue={modbusRTUConfig.port} inputInvalid={!validModbusRtuPort} enableInputInvalid={true} />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.communicationPortInfo[$selectedLang]}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.slaveID[$selectedLang]}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={modbusRTUConfig.slave_id}
                inputInvalid={!validModbusSlaveID}
                enableInputInvalid={true}
                inputType="POSITIVE_INT"
                minValue={SLAVE_ID_LIM.MIN}
                maxValue={SLAVE_ID_LIM.MAX}
                limitsPassed={() => {
                    showAlert($texts.slaveIDError, {
                        minValue: SLAVE_ID_LIM.MIN,
                        maxValue: SLAVE_ID_LIM.MAX,
                    });
                }}
            />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.slaveIDInfo[$selectedLang]}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.baudrate[$selectedLang]}</span>
    <div class="input-div">
        <Selector
            useLang={true}
            options={$baudrateTexts}
            bind:selectedOption={modbusRTUConfig.baudrate}
            inputInvalid={!validBaudrate}
            enableInputInvalid={true}
            scrollable={true}
        />
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.baudrateInfo[$selectedLang]}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.parity[$selectedLang]}</span>
    <div class="input-div">
        <Selector
            useLang={true}
            options={$parityTexts}
            bind:selectedOption={modbusRTUConfig.parity}
            inputInvalid={!validParity}
            enableInputInvalid={true}
            scrollable={true}
        />
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.parityInfo[$selectedLang]}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.bytesize[$selectedLang]}</span>
    <div class="input-div">
        <Selector
            useLang={true}
            options={$bytesizeTexts}
            bind:selectedOption={modbusRTUConfig.bytesize}
            inputInvalid={!validByteSize}
            enableInputInvalid={true}
            scrollable={true}
        />
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.bytesizeInfo[$selectedLang]}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.stopbits[$selectedLang]}</span>
    <div class="input-div">
        <Selector
            useLang={true}
            options={$stopbitsTexts}
            bind:selectedOption={modbusRTUConfig.stopbits}
            inputInvalid={!validStopBits}
            enableInputInvalid={true}
            scrollable={true}
        />
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.stopbitsInfo[$selectedLang]}</span>
            </HintInfo>
        </div>
    </div>
</div>

<div class="device-input-div">
    <span>{$texts.readPeriod[$selectedLang]}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={modbusRTUConfig.read_period}
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
                bind:inputValue={modbusRTUConfig.timeout}
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
<div class="device-input-div">
    <span>{$texts.retries[$selectedLang]}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={modbusRTUConfig.retries}
                inputType="POSITIVE_INT"
                inputInvalid={!validRetriesNumber}
                enableInputInvalid={true}
                minValue={RETRIES_NUMBER_LIM.MIN}
                maxValue={RETRIES_NUMBER_LIM.MAX}
                limitsPassed={() => {
                    showAlert($texts.retriesError, {
                        minValue: RETRIES_NUMBER_LIM.MIN,
                        maxValue: RETRIES_NUMBER_LIM.MAX,
                    });
                }}
            />
        </div>
        <div class="info-div">
            <HintInfo>
                <span class="info-text">{$texts.retriesInfo[$selectedLang]}</span>
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
