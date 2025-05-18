<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { getDeviceState } from "$lib/ts/devices";
    import Selector from "../../../components/General/Selector.svelte";
    import HintInfo from "../../../components/General/HintInfo.svelte";

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
    let selectedProtocol: string;
    let selectedType: string;

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
                    console.log(deviceData);
                    selectedProtocol = deviceData.protocol;
                    selectedType = deviceData.type;
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

    $: console.log(selectedProtocol);
</script>

<div class="content">
    <div class="edit-device-div">
        <div class="device-identification-div">
            <h3>{deviceData?.name}</h3>
            <div
                class="device-image-div"
                style="background-image: url('{`/devices/${deviceData?.name}_${deviceData?.id}.png`}');"
            ></div>
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
                            textColor="#f5f5f5;"
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
                            textColor="#f5f5f5;"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.connectionTypeInfo[$selectedLang]}</span
                            >
                        </HintInfo>
                    </div>
                </div>
            </div>
        </div>
    </div>
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

    .device-identification-div h3 {
        color: #f5f5f5;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1rem;
        font-weight: 300;
    }

    .device-identification-div .device-image-div {
        padding: 0;
        margin: 0;
        margin-top: 10px;
        width: 200px;
        height: 200px;
        background-color: rgba(255, 255, 255, 0.1);
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 87.5%;
        border-radius: 50%;
    }

    .device-options-div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
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

    .device-input-div {
        position: relative;
        margin-top: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 30px;
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

    .info-div .info-text {
        padding: 10px;
        padding-right: 40px;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1rem;
        font-weight: 300;
        line-height: 1.5;
        color: white;
    }
</style>
