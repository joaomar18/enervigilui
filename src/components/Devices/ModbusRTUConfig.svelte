<script lang="ts">
    import InputField from "../General/InputField.svelte";
    import HintInfo from "../General/HintInfo.svelte";
    import Selector from "../General/Selector.svelte";
    import { validateModbusRtuPort } from "$lib/ts/devices";

    // Stores for multi-language support
    import { texts, baudrateTexts, parityTexts, bytesizeTexts, stopbitsTexts, selectedLang } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/stores/alerts";

    // Types
    import type { EditableDeviceModbusRTUConfig } from "$lib/stores/devices";

    // Props
    export let modbusRTUConfig: EditableDeviceModbusRTUConfig; // Modbus RTU Configuration Object
    export let modbusRTUConfigValid: boolean; // Modbus RTU Configuration is valid

    // Variables
    let validModbusRtuPort: boolean; // Modbus RTU Port is valid

    $: validModbusRtuPort = validateModbusRtuPort(modbusRTUConfig.port);
    $: modbusRTUConfigValid = validModbusRtuPort;
</script>

<div class="device-input-div">
    <span>{$texts.communicationPort[$selectedLang]}</span>
    <div class="input-div">
        <div class="input-content-div">
            <InputField
                bind:inputValue={modbusRTUConfig.port}
                inputInvalid={!validModbusRtuPort}
                enableInputInvalid={true}
                width="100%"
                height="40px"
                borderRadius="5px"
                backgroundColor="#252b33"
                borderColor="#323a45"
                selectedBackgroundColor="#252b33"
                selectedBorderColor="#2F80ED"
                badFormatBorderColor="#e74c3c"
                fontSize="1rem"
                fontColor="#f5f5f5"
                fontWeight="400"
            />
        </div>
        <div class="info-div">
            <HintInfo
                labelText=""
                hintWidth="300px"
                hintHeight="fit-content"
                hintBackgroundColor="#1e242b"
                hintBorderColor="#2c343d"
                hintBorderRadius="10px"
                textColor="#f5f5f5"
                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                openStrokeColor="#cccccc"
                openHoverStrokeColor="#eeeeee"
                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                closeStrokeColor="white"
                closeHoverStrokeColor="#eeeeee"
            >
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
                inputType="POSITIVE_INT"
                minValue={1}
                maxValue={247}
                limitsPassed={() => {
                    showAlert($texts.slaveIDError, {
                        minValue: 1,
                        maxValue: 247,
                    });
                }}
                width="100%"
                height="40px"
                borderRadius="5px"
                backgroundColor="#252b33"
                borderColor="#323a45"
                selectedBackgroundColor="#252b33"
                selectedBorderColor="#2F80ED"
                badFormatBorderColor="#e74c3c"
                fontSize="1rem"
                fontColor="#f5f5f5"
                fontWeight="400"
                textAlign="center"
            />
        </div>
        <div class="info-div">
            <HintInfo
                labelText=""
                hintWidth="300px"
                hintHeight="fit-content"
                hintBackgroundColor="#1e242b"
                hintBorderColor="#2c343d"
                hintBorderRadius="10px"
                textColor="#f5f5f5"
                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                openStrokeColor="#cccccc"
                openHoverStrokeColor="#eeeeee"
                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                closeStrokeColor="white"
                closeHoverStrokeColor="#eeeeee"
            >
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
            scrollable={true}
            maxOptions={5}
            width="200px"
            height="40px"
            borderRadius="5px"
            backgroundColor="#252b33"
            borderColor="#323a45"
            selectedColor="#14566b"
            optionsBackgroundColor="#1e242b"
            optionsBorderColor="#323a45"
            letterSpacing="0.5px"
            wordSpacing="1px"
            arrowWidth="16px"
            arrowHeight="16px"
            arrowRightPos="10px"
        />
        <div class="info-div">
            <HintInfo
                labelText=""
                hintWidth="300px"
                hintHeight="fit-content"
                hintBackgroundColor="#1e242b"
                hintBorderColor="#2c343d"
                hintBorderRadius="10px"
                textColor="#f5f5f5"
                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                openStrokeColor="#cccccc"
                openHoverStrokeColor="#eeeeee"
                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                closeStrokeColor="white"
                closeHoverStrokeColor="#eeeeee"
            >
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
            scrollable={true}
            maxOptions={5}
            width="200px"
            height="40px"
            borderRadius="5px"
            backgroundColor="#252b33"
            borderColor="#323a45"
            selectedColor="#14566b"
            optionsBackgroundColor="#1e242b"
            optionsBorderColor="#323a45"
            letterSpacing="0.5px"
            wordSpacing="1px"
            arrowWidth="16px"
            arrowHeight="16px"
            arrowRightPos="10px"
        />
        <div class="info-div">
            <HintInfo
                labelText=""
                hintWidth="300px"
                hintHeight="fit-content"
                hintBackgroundColor="#1e242b"
                hintBorderColor="#2c343d"
                hintBorderRadius="10px"
                textColor="#f5f5f5"
                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                openStrokeColor="#cccccc"
                openHoverStrokeColor="#eeeeee"
                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                closeStrokeColor="white"
                closeHoverStrokeColor="#eeeeee"
            >
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
            scrollable={true}
            maxOptions={5}
            width="200px"
            height="40px"
            borderRadius="5px"
            backgroundColor="#252b33"
            borderColor="#323a45"
            selectedColor="#14566b"
            optionsBackgroundColor="#1e242b"
            optionsBorderColor="#323a45"
            letterSpacing="0.5px"
            wordSpacing="1px"
            arrowWidth="16px"
            arrowHeight="16px"
            arrowRightPos="10px"
        />
        <div class="info-div">
            <HintInfo
                labelText=""
                hintWidth="300px"
                hintHeight="fit-content"
                hintBackgroundColor="#1e242b"
                hintBorderColor="#2c343d"
                hintBorderRadius="10px"
                textColor="#f5f5f5"
                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                openStrokeColor="#cccccc"
                openHoverStrokeColor="#eeeeee"
                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                closeStrokeColor="white"
                closeHoverStrokeColor="#eeeeee"
            >
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
            scrollable={true}
            maxOptions={5}
            width="200px"
            height="40px"
            borderRadius="5px"
            backgroundColor="#252b33"
            borderColor="#323a45"
            selectedColor="#14566b"
            optionsBackgroundColor="#1e242b"
            optionsBorderColor="#323a45"
            letterSpacing="0.5px"
            wordSpacing="1px"
            arrowWidth="16px"
            arrowHeight="16px"
            arrowRightPos="10px"
        />
        <div class="info-div">
            <HintInfo
                labelText=""
                hintWidth="300px"
                hintHeight="fit-content"
                hintBackgroundColor="#1e242b"
                hintBorderColor="#2c343d"
                hintBorderRadius="10px"
                textColor="#f5f5f5"
                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                openStrokeColor="#cccccc"
                openHoverStrokeColor="#eeeeee"
                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                closeStrokeColor="white"
                closeHoverStrokeColor="#eeeeee"
            >
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
                inputType="POSITIVE_INT"
                inputUnit={$texts.secondsUnit[$selectedLang]}
                minValue={5.0}
                maxValue={300.0}
                limitsPassed={() => {
                    showAlert($texts.readPeriodError, {
                        minValue: 5,
                        maxValue: 300,
                    });
                }}
                width="100%"
                height="40px"
                borderRadius="5px"
                backgroundColor="#252b33"
                borderColor="#323a45"
                selectedBackgroundColor="#252b33"
                selectedBorderColor="#2F80ED"
                fontSize="1rem"
                fontColor="#f5f5f5"
                fontWeight="400"
                textAlign="center"
                unitTextColor="rgb(170,170,170)"
            />
        </div>
        <div class="info-div">
            <HintInfo
                labelText=""
                hintWidth="300px"
                hintHeight="fit-content"
                hintBackgroundColor="#1e242b"
                hintBorderColor="#2c343d"
                hintBorderRadius="10px"
                textColor="#f5f5f5"
                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                openStrokeColor="#cccccc"
                openHoverStrokeColor="#eeeeee"
                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                closeStrokeColor="white"
                closeHoverStrokeColor="#eeeeee"
            >
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
                inputType="POSITIVE_FLOAT"
                inputUnit={$texts.secondsUnit[$selectedLang]}
                minValue={5.0}
                maxValue={300.0}
                limitsPassed={() => {
                    showAlert($texts.commTimeoutError, {
                        minValue: 5,
                        maxValue: 300,
                    });
                }}
                width="100%"
                height="40px"
                borderRadius="5px"
                backgroundColor="#252b33"
                borderColor="#323a45"
                selectedBackgroundColor="#252b33"
                selectedBorderColor="#2F80ED"
                fontSize="1rem"
                fontColor="#f5f5f5"
                fontWeight="400"
                textAlign="center"
                unitTextColor="rgb(170,170,170)"
            />
        </div>
        <div class="info-div">
            <HintInfo
                labelText=""
                hintWidth="300px"
                hintHeight="fit-content"
                hintBackgroundColor="#1e242b"
                hintBorderColor="#2c343d"
                hintBorderRadius="10px"
                textColor="#f5f5f5"
                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                openStrokeColor="#cccccc"
                openHoverStrokeColor="#eeeeee"
                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                closeStrokeColor="white"
                closeHoverStrokeColor="#eeeeee"
            >
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
                minValue={0.0}
                maxValue={5.0}
                limitsPassed={() => {
                    showAlert($texts.retriesError, {
                        minValue: 0,
                        maxValue: 5,
                    });
                }}
                width="100%"
                height="40px"
                borderRadius="5px"
                backgroundColor="#252b33"
                borderColor="#323a45"
                selectedBackgroundColor="#252b33"
                selectedBorderColor="#2F80ED"
                fontSize="1rem"
                fontColor="#f5f5f5"
                fontWeight="400"
                textAlign="center"
                unitTextColor="rgb(170,170,170)"
            />
        </div>
        <div class="info-div">
            <HintInfo
                labelText=""
                hintWidth="300px"
                hintHeight="fit-content"
                hintBackgroundColor="#1e242b"
                hintBorderColor="#2c343d"
                hintBorderRadius="10px"
                textColor="#f5f5f5"
                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                openStrokeColor="#cccccc"
                openHoverStrokeColor="#eeeeee"
                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                closeStrokeColor="white"
                closeHoverStrokeColor="#eeeeee"
            >
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
