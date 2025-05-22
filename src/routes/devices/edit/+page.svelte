<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { getDeviceState } from "$lib/ts/devices";
    import Selector from "../../../components/General/Selector.svelte";
    import SelectorButton from "../../../components/General/SelectorButton.svelte";
    import HintInfo from "../../../components/General/HintInfo.svelte";
    import EditableText from "../../../components/General/EditableText.svelte";
    import UploadImage from "../../../components/General/UploadImage.svelte";
    import Button from "../../../components/General/Button.svelte";

    // Navigation
    import { navigateTo } from "$lib/ts/navigation";

    // Stores for multi-language support
    import { texts, selectedLang } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/stores/alerts";

    // Stores for authorization
    import { loadedDone } from "$lib/stores/auth";

    //Variables
    let pollTimer: ReturnType<typeof setTimeout>;
    let deviceData: any;
    let protocols = { "OPC UA": "OPC_UA", "MODBUS RTU": "MODBUS_RTU" };
    let types = { "1F": "SINGLE_PHASE", "3F": "THREE_PHASE" };
    let deviceName: string;
    let deviceImage: File | undefined;
    let selectedProtocol: string;
    let selectedType: string;
    let readEnergyFromMeter: boolean;
    let readForwardReverseEnergySeparate: boolean;
    let negativeReactivePower: boolean;
    let frequencyReading: boolean;

    //Function to fetch device status
    function fetchDeviceStatus(name: string, id: number): void {
        const tick = async () => {
            let sucess = false;
            try {
                const { status, data }: { status: number; data: any } = await getDeviceState(
                    name,
                    id
                );
                if (status !== 200) {
                    showAlert($texts.errorDeviceState);
                } else {
                    deviceData = data;
                    deviceName = deviceData.name;
                    selectedProtocol = deviceData.protocol;
                    selectedType = deviceData.type;
                    readEnergyFromMeter = deviceData.options.read_energy_from_meter;
                    readForwardReverseEnergySeparate =
                        deviceData.options.read_separate_forward_reverse_energy;
                    negativeReactivePower = deviceData.options.negative_reactive_power;
                    frequencyReading = deviceData.options.frequency_reading;
                    sucess = true;
                }
            } catch (e) {
                showAlert($texts.errorDeviceState);
            }
            loadedDone.set(true);
            if (!sucess) {
                pollTimer = setTimeout(tick, 2500);
            }
        };
        tick();
    }

    //Function to save device changes
    async function saveEdit(): Promise<void> {
        console.log("Save Device changes");
    }

    // Function to cancel edit device (go to devices page)
    async function cancelEdit(): Promise<void> {
        await navigateTo("/devices", $selectedLang, {});
    }

    // Function to open popup to confirm device delete
    async function deleteDevice(): Promise<void> {
        console.log("Delete device popup");
    }

    // Mount function
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        let deviceName = params.get("deviceName");
        let deviceId = params.get("deviceId");
        if (deviceName && deviceId) {
            fetchDeviceStatus(deviceName, Number(deviceId));
        } else {
            showAlert($texts.errorEditDeviceParams);
            loadedDone.set(true);
        }
    });

    // Cleanup function
    onDestroy(() => {
        clearTimeout(pollTimer);
    });
</script>

<div class="content">
    {#if deviceData}
        <div class="edit-device-div">
            <div class="device-identification-div">
                <EditableText
                    bind:text={deviceName}
                    fontSize="1.1rem"
                    fontColor="#f5f5f5"
                    borderColorBottom="rgba(255, 255, 255, 0.2)"
                    buttonImageWidth="22px"
                    buttonImageHeight="22px"
                />
                <span class="id-text">ID: {String(deviceData?.id).padStart(3, "0")}</span>
                <div class="device-image-div">
                    <UploadImage
                        bind:imageFile={deviceImage}
                        width="200px"
                        height="200px"
                        borderRadius="50%"
                        imageUrl={`/devices/${deviceData?.name}_${deviceData?.id}.png`}
                        imageHeight="87.5%"
                        backgroundColor="rgba(255, 255, 255, 0.1)"
                        hoverColor="rgba(255, 255, 255, 0.13)"
                    />
                </div>
            </div>
            <div class="device-options-div">
                <div class="device-options-title">
                    <h3>{$texts.deviceOptions[$selectedLang]}</h3>
                    <span>{$texts.deviceOptionsSub[$selectedLang]}</span>
                </div>

                <div class="device-input-div">
                    <span>{$texts.communicationProtocol[$selectedLang]}</span>
                    <div class="selector-div">
                        <Selector
                            options={protocols}
                            bind:selectedOption={selectedProtocol}
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
                                <span class="info-text"
                                    >{$texts.communicationProtocolInfo[$selectedLang]}</span
                                >
                            </HintInfo>
                        </div>
                    </div>
                </div>

                <div class="device-input-div">
                    <span>{$texts.connectionType[$selectedLang]}</span>
                    <div class="selector-div">
                        <Selector
                            options={types}
                            bind:selectedOption={selectedType}
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
                                <span class="info-text"
                                    >{$texts.connectionTypeInfo[$selectedLang]}</span
                                >
                            </HintInfo>
                        </div>
                    </div>
                </div>

                <div class="device-input-div">
                    <span>{$texts.readEnergyFromMeter[$selectedLang]}</span>
                    <div class="selector-div">
                        <div class="selector-button-div">
                            <SelectorButton
                                bind:checked={readEnergyFromMeter}
                                width="75px"
                                height="20px"
                                knobWidth="32px"
                                knobHeight="32px"
                                borderRadius="10px"
                                backgroundColor="#3a3a3a"
                                selectedBackgroundColor="#4a4a4a"
                                knobBackgroundColor="#e0e0e0"
                                knobSelectedBackgroundColor="#2f80ed"
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
                                <span class="info-text"
                                    >{$texts.readEnergyFromMeterInfo[$selectedLang]}</span
                                >
                            </HintInfo>
                        </div>
                    </div>
                </div>
                <div class="device-input-div">
                    <span>{$texts.readForwardReverseEnergySeparate[$selectedLang]}</span>
                    <div class="selector-div">
                        <div class="selector-button-div">
                            <SelectorButton
                                bind:checked={readForwardReverseEnergySeparate}
                                width="75px"
                                height="20px"
                                knobWidth="32px"
                                knobHeight="32px"
                                borderRadius="10px"
                                backgroundColor="#3a3a3a"
                                selectedBackgroundColor="#4a4a4a"
                                knobBackgroundColor="#e0e0e0"
                                knobSelectedBackgroundColor="#2f80ed"
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
                                <span class="info-text"
                                    >{$texts.readForwardReverseEnergySeparateInfo[
                                        $selectedLang
                                    ]}</span
                                >
                            </HintInfo>
                        </div>
                    </div>
                </div>
                <div class="device-input-div">
                    <span>{$texts.negativeReactivePower[$selectedLang]}</span>
                    <div class="selector-div">
                        <div class="selector-button-div">
                            <SelectorButton
                                bind:checked={negativeReactivePower}
                                width="75px"
                                height="20px"
                                knobWidth="32px"
                                knobHeight="32px"
                                borderRadius="10px"
                                backgroundColor="#3a3a3a"
                                selectedBackgroundColor="#4a4a4a"
                                knobBackgroundColor="#e0e0e0"
                                knobSelectedBackgroundColor="#2f80ed"
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
                                <span class="info-text"
                                    >{$texts.negativeReactivePowerInfo[$selectedLang]}</span
                                >
                            </HintInfo>
                        </div>
                    </div>
                </div>
                <div class="device-input-div">
                    <span>{$texts.frequencyReading[$selectedLang]}</span>
                    <div class="selector-div">
                        <div class="selector-button-div">
                            <SelectorButton
                                bind:checked={frequencyReading}
                                width="75px"
                                height="20px"
                                knobWidth="32px"
                                knobHeight="32px"
                                borderRadius="10px"
                                backgroundColor="#3a3a3a"
                                selectedBackgroundColor="#4a4a4a"
                                knobBackgroundColor="#e0e0e0"
                                knobSelectedBackgroundColor="#2f80ed"
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
                                <span class="info-text"
                                    >{$texts.frequencyReadingInfo[$selectedLang]}</span
                                >
                            </HintInfo>
                        </div>
                    </div>
                </div>
            </div>
            <div class="device-nodes-div">
                <div class="device-nodes-title">
                    <h3>{$texts.deviceNodes[$selectedLang]}</h3>
                    <span>{$texts.deviceNodesSub[$selectedLang]}</span>
                </div>
            </div>
            <div class="action-buttons-div">
                <Button
                    buttonText={$texts.save[$selectedLang]}
                    width="150px"
                    height="40px"
                    borderRadius="5px"
                    backgroundColor="#2F80ED"
                    hoverColor="#1C6DD0"
                    fontColor="#f5f5f5"
                    imageURL="/img/save.png"
                    imageWidth="22px"
                    imageHeight="22px"
                    imageLeftPos="20px"
                    onClick={saveEdit}
                />
                <Button
                    buttonText={$texts.cancel[$selectedLang]}
                    width="150px"
                    height="40px"
                    borderRadius="5px"
                    backgroundColor="#707070"
                    hoverColor="#5A5A5A"
                    fontColor="#f5f5f5"
                    imageURL="/img/previous.png"
                    imageWidth="22px"
                    imageHeight="22px"
                    imageLeftPos="20px"
                    onClick={cancelEdit}
                />
                <Button
                    buttonText={$texts.delete[$selectedLang]}
                    width="150px"
                    height="40px"
                    borderRadius="5px"
                    backgroundColor="#E74C3C"
                    hoverColor="#C0392B"
                    fontColor="#f5f5f5"
                    imageURL="/img/delete.png"
                    imageWidth="22px"
                    imageHeight="22px"
                    imageLeftPos="20px"
                    onClick={deleteDevice}
                />
            </div>
        </div>
    {/if}
</div>

<style>
    .content {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .edit-device-div {
        height: 100%;
        width: 80%;
        min-width: 250px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .device-identification-div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .device-identification-div .id-text {
        padding: 0px;
        padding-top: 10px;
        padding-bottom: 10px;
        color: rgb(170, 170, 170);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 0.9rem;
        font-weight: 300;
    }

    .device-identification-div .device-image-div {
        padding-top: 10px;
    }

    .device-options-div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .device-options-div .device-options-title {
        display: flex;
        flex-direction: column;
        align-self: flex-start;
        gap: 10px;
        padding: 20px;
        padding-left: 0px;
        padding-right: 0px;
        width: 100%;
    }

    .device-options-div h3 {
        color: #f5f5f5;
        font-size: 1rem;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        margin: 0;
        padding: 0;
    }

    .device-options-div span {
        color: rgb(170, 170, 170);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 400;
        margin: 0;
        padding: 0;
        line-height: 1.5;
    }

    .device-nodes-div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .device-nodes-div .device-nodes-title {
        display: flex;
        flex-direction: column;
        align-self: flex-start;
        gap: 10px;
        padding: 20px;
        padding-left: 0px;
        padding-right: 0px;
        width: 100%;
    }

    .device-nodes-div h3 {
        color: #f5f5f5;
        font-size: 1rem;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        margin: 0;
        padding: 0;
    }

    .device-nodes-div span {
        color: rgb(170, 170, 170);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 400;
        margin: 0;
        padding: 0;
        line-height: 1.5;
    }

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

    .device-input-div span {
        text-align: left;
        color: #f5f5f5;
        font-size: 1rem;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 300;
        margin: 0;
        padding: 0;
        width: 250px;
    }

    .selector-div {
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

    .selector-div .selector-button-div {
        width: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .info-div .info-text {
        padding: 10px;
        padding-right: 40px;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1rem;
        font-weight: 300;
        line-height: 1.5;
        color: white;
    }

    .action-buttons-div {
        margin: 0;
        padding: 0;
        padding-top: 50px;
        padding-bottom: 50px;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(3, 150px);
        gap: 30px;
        justify-content: center;
        justify-items: center;
    }

    @media (max-width: 769px) {
        .action-buttons-div {
            grid-template-columns: 1fr;
        }
    }
</style>
