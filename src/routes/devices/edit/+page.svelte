<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { getDeviceState, getDeviceNodesConfig } from "$lib/ts/devices";
    import Selector from "../../../components/General/Selector.svelte";
    import SelectorButton from "../../../components/General/SelectorButton.svelte";
    import HintInfo from "../../../components/General/HintInfo.svelte";
    import EditableText from "../../../components/General/EditableText.svelte";
    import UploadImage from "../../../components/General/UploadImage.svelte";
    import Button from "../../../components/General/Button.svelte";
    import ConfirmWindow from "../../../components/General/ConfirmWindow.svelte";
    import InputField from "../../../components/General/InputField.svelte";
    import NodesGrid from "../../../components/Devices/Nodes/NodesGrid.svelte";

    // Navigation
    import { navigateTo } from "$lib/ts/navigation";

    // Stores for multi-language support
    import { texts, selectedLang } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/stores/alerts";

    // Stores for authorization
    import { loadedDone } from "$lib/stores/navigation";

    //Variables
    let showSaveWindow: boolean = false;
    let showDeleteWindow: boolean = false;
    let deleteDeviceName: string;

    let devicePollTimer: ReturnType<typeof setTimeout>;
    let nodesPollTimer: ReturnType<typeof setTimeout>;
    let deviceData: any;
    let deviceNodes: any;
    let protocols: Record<string, string> = { "OPC UA": "OPC_UA", "MODBUS RTU": "MODBUS_RTU" };
    let types: Record<string, string> = { "1F": "SINGLE_PHASE", "3F": "THREE_PHASE" };

    //modbus rtu options
    let baudrateOptions: Record<string, string> = {
        "1200": "1200",
        "2400": "2400",
        "4800": "4800",
        "9600": "9600",
        "19200": "19200",
        "38400": "38400",
        "57600": "57600",
        "115200": "115200",
    };

    let parityOptions: Record<string, string> = {
        None: "N",
        Even: "E",
        Odd: "O",
    };

    let bytesizeOptions: Record<string, string> = {
        "7": "7",
        "8": "8",
    };

    let stopbitsOptions: Record<string, string> = {
        "1": "1",
        "2": "2",
    };

    let deviceName: string;
    let deviceImage: File | undefined;

    // Variables for device communication
    let selectedProtocol: string;
    let opcua_options: Record<string, string> = {
        url: "opc.tcp://", // OPC UA server URL
        read_period: "10", // polling interval in seconds
        timeout: "10", // communication timeout in seconds
        username: "", // authentication username
        password: "", // authentication password
    };
    let modbus_rtu_options: Record<string, string> = {
        port: "", // COM port (e.g., "COM1", "/dev/ttyUSB0")
        slave_id: "1", // 1-247 (slave address)
        baudrate: "9600", // 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200
        parity: "N", // "none", "even", "odd"
        stopbits: "1", // "1", "2"
        bytesize: "8", // "7", "8"
        read_period: "10", // polling interval in seconds
        timeout: "10", // communication timeout in seconds
        retries: "3", // number of retry attemps
    };

    // Variables for device options
    let meter_type: "SINGLE_PHASE" | "THREE_PHASE" = "SINGLE_PHASE";

    let meter_options: Record<string, any> = {
        read_energy_from_meter: true, // Read energy from meter
        read_separate_forward_reverse_energy: false, // Read forward and reverse energy separately
        negative_reactive_power: false, // Read negative reactive power
        frequency_reading: false, // Read frequency
    };

    //Function to fetch device status and configuration
    function fetchDeviceStatus(name: string, id: number): void {
        const tick = async () => {
            let sucess = false;
            try {
                const { status, data }: { status: number; data: any } = await getDeviceState(
                    name,
                    id
                );
                if (status !== 200) {
                    showAlert($texts.errorDeviceConfig);
                } else {
                    deviceData = data;
                    deviceName = deviceData.name;

                    selectedProtocol = deviceData.protocol;
                    if (selectedProtocol === "OPC_UA") {
                        for (let option in deviceData.communication_options) {
                            if (opcua_options.hasOwnProperty(option)) {
                                opcua_options[option] = deviceData.communication_options[option];
                            }
                        }
                    } else if (selectedProtocol === "MODBUS_RTU") {
                        for (let option in deviceData.communication_options) {
                            if (modbus_rtu_options.hasOwnProperty(option)) {
                                modbus_rtu_options[option] =
                                    deviceData.communication_options[option];
                            }
                        }
                    }

                    meter_type = deviceData.type;
                    for (let option in deviceData.options) {
                        if (meter_options.hasOwnProperty(option)) {
                            meter_options[option] = deviceData.options[option];
                        }
                    }

                    sucess = true;
                }
            } catch (e) {
                showAlert($texts.errorDeviceConfig);
            }
            loadedDone.set(true);
            if (!sucess) {
                devicePollTimer = setTimeout(tick, 2500);
            }
        };
        tick();
    }

    // Function to fetch device nodes (variables)
    function fetchDeviceNodesConfig(name: string, id: number): void {
        const tick = async () => {
            let sucess = false;
            try {
                const { status, data }: { status: number; data: any } = await getDeviceNodesConfig(
                    name,
                    id
                );
                if (status !== 200) {
                    showAlert($texts.errorDeviceNodesConfig);
                } else {
                    deviceNodes = data;
                    sucess = true;
                }
            } catch (e) {
                showAlert($texts.errorDeviceNodesConfig);
            }
            if (!sucess) {
                nodesPollTimer = setTimeout(tick, 2500);
            }
        };
        tick();
    }

    //Function to save device changes
    async function saveEdit(): Promise<void> {
        showSaveWindow = false;
    }

    // Function to cancel edit device (go to devices page)
    async function cancelEdit(): Promise<void> {
        await navigateTo("/devices", $selectedLang, {});
    }

    // Function to open popup to confirm device delete
    async function deleteDevice(): Promise<void> {
        deleteDeviceName = "";
        showDeleteWindow = false;
    }

    // Mount function
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        let deviceName = params.get("deviceName");
        let deviceId = params.get("deviceId");
        if (deviceName && deviceId) {
            fetchDeviceStatus(deviceName, Number(deviceId));
            fetchDeviceNodesConfig(deviceName, Number(deviceId));
        } else {
            showAlert($texts.errorEditDeviceParams);
            loadedDone.set(true);
        }
    });

    // Cleanup function
    onDestroy(() => {
        clearTimeout(devicePollTimer);
        clearTimeout(nodesPollTimer);
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
            <div class="device-section-div">
                <div class="title">
                    <h3>{$texts.deviceCommunication[$selectedLang]}</h3>
                    <span>{$texts.deviceCommunicationSub[$selectedLang]}</span>
                </div>

                <div class="device-input-div">
                    <span>{$texts.communicationProtocol[$selectedLang]}</span>
                    <div class="input-div">
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

                {#if selectedProtocol === "OPC_UA"}
                    <div class="device-input-div">
                        <span>{$texts.networkAddress[$selectedLang]}</span>
                        <div class="input-div">
                            <div class="input-content-div">
                                <InputField
                                    bind:inputValue={opcua_options.url}
                                    width="100%"
                                    height="40px"
                                    borderRadius="5px"
                                    backgroundColor="#252b33"
                                    borderColor="#323a45"
                                    selectedBackgroundColor="#252b33"
                                    selectedBorderColor="#2F80ED"
                                    fontSize="1rem"
                                    fontColor="#f5f5f5"
                                    fontWeight="300"
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
                                        >{$texts.networkAddressInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>
                    <div class="device-input-div">
                        <span>{$texts.readPeriod[$selectedLang]}</span>
                        <div class="input-div">
                            <div class="input-content-div">
                                <InputField
                                    bind:inputValue={opcua_options.read_period}
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
                                    fontWeight="300"
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
                                    <span class="info-text"
                                        >{$texts.readPeriodInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>
                    <div class="device-input-div">
                        <span>{$texts.commTimeout[$selectedLang]}</span>
                        <div class="input-div">
                            <div class="input-content-div">
                                <InputField
                                    bind:inputValue={opcua_options.timeout}
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
                                    fontWeight="300"
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
                                    <span class="info-text"
                                        >{$texts.commTimeoutInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>
                    <div class="optional-div">
                        <span class="optional-text"
                            >{$texts.authenticationOptional[$selectedLang]}</span
                        >
                        <div class="device-input-div">
                            <span>{$texts.username[$selectedLang]}</span>
                            <div class="input-div">
                                <div class="input-content-div">
                                    <InputField
                                        bind:inputValue={opcua_options.username}
                                        width="100%"
                                        height="40px"
                                        borderRadius="5px"
                                        backgroundColor="#252b33"
                                        borderColor="#323a45"
                                        selectedBackgroundColor="#252b33"
                                        selectedBorderColor="#2F80ED"
                                        fontSize="1rem"
                                        fontColor="#f5f5f5"
                                        fontWeight="300"
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
                                            >{$texts.commUsernameInfo[$selectedLang]}</span
                                        >
                                    </HintInfo>
                                </div>
                            </div>
                        </div>
                        <div class="device-input-div">
                            <span>{$texts.password[$selectedLang]}</span>
                            <div class="input-div">
                                <div class="input-content-div">
                                    <InputField
                                        bind:inputValue={opcua_options.password}
                                        inputType="PASSWORD"
                                        width="100%"
                                        height="40px"
                                        borderRadius="5px"
                                        backgroundColor="#252b33"
                                        borderColor="#323a45"
                                        selectedBackgroundColor="#252b33"
                                        selectedBorderColor="#2F80ED"
                                        fontSize="1rem"
                                        fontColor="#f5f5f5"
                                        fontWeight="300"
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
                                            >{$texts.commPasswordInfo[$selectedLang]}</span
                                        >
                                    </HintInfo>
                                </div>
                            </div>
                        </div>
                    </div>
                {:else if selectedProtocol === "MODBUS_RTU"}
                    <div class="device-input-div">
                        <span>{$texts.communicationPort[$selectedLang]}</span>
                        <div class="input-div">
                            <div class="input-content-div">
                                <InputField
                                    bind:inputValue={modbus_rtu_options.port}
                                    width="100%"
                                    height="40px"
                                    borderRadius="5px"
                                    backgroundColor="#252b33"
                                    borderColor="#323a45"
                                    selectedBackgroundColor="#252b33"
                                    selectedBorderColor="#2F80ED"
                                    fontSize="1rem"
                                    fontColor="#f5f5f5"
                                    fontWeight="300"
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
                                        >{$texts.communicationPortInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>

                    <div class="device-input-div">
                        <span>{$texts.baudrate[$selectedLang]}</span>
                        <div class="input-div">
                            <Selector
                                options={baudrateOptions}
                                bind:selectedOption={modbus_rtu_options.baudrate}
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
                                        >{$texts.baudrateInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>

                    <div class="device-input-div">
                        <span>{$texts.parity[$selectedLang]}</span>
                        <div class="input-div">
                            <Selector
                                options={parityOptions}
                                bind:selectedOption={modbus_rtu_options.parity}
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
                                    <span class="info-text">{$texts.parityInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>

                    <div class="device-input-div">
                        <span>{$texts.bytesize[$selectedLang]}</span>
                        <div class="input-div">
                            <Selector
                                options={bytesizeOptions}
                                bind:selectedOption={modbus_rtu_options.bytesize}
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
                                        >{$texts.bytesizeInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>

                    <div class="device-input-div">
                        <span>{$texts.stopbits[$selectedLang]}</span>
                        <div class="input-div">
                            <Selector
                                options={stopbitsOptions}
                                bind:selectedOption={modbus_rtu_options.stopbits}
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
                                        >{$texts.stopbitsInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>

                    <div class="device-input-div">
                        <span>{$texts.readPeriod[$selectedLang]}</span>
                        <div class="input-div">
                            <div class="input-content-div">
                                <InputField
                                    bind:inputValue={modbus_rtu_options.read_period}
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
                                    fontWeight="300"
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
                                    <span class="info-text"
                                        >{$texts.readPeriodInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>
                    <div class="device-input-div">
                        <span>{$texts.commTimeout[$selectedLang]}</span>
                        <div class="input-div">
                            <div class="input-content-div">
                                <InputField
                                    bind:inputValue={modbus_rtu_options.timeout}
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
                                    fontWeight="300"
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
                                    <span class="info-text"
                                        >{$texts.commTimeoutInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>
                    <div class="device-input-div">
                        <span>{$texts.retries[$selectedLang]}</span>
                        <div class="input-div">
                            <div class="input-content-div">
                                <InputField
                                    bind:inputValue={modbus_rtu_options.retries}
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
                                    fontWeight="300"
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
                                    <span class="info-text"
                                        >{$texts.retriesInfo[$selectedLang]}</span
                                    >
                                </HintInfo>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
            <div class="device-section-div">
                <div class="title">
                    <h3>{$texts.deviceOptions[$selectedLang]}</h3>
                    <span>{$texts.deviceOptionsSub[$selectedLang]}</span>
                </div>

                <div class="device-input-div">
                    <span>{$texts.connectionType[$selectedLang]}</span>
                    <div class="input-div">
                        <Selector
                            options={types}
                            bind:selectedOption={meter_type}
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
                    <div class="input-div">
                        <div class="input-content-div">
                            <SelectorButton
                                bind:checked={meter_options.read_energy_from_meter}
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
                    <div class="input-div">
                        <div class="input-content-div">
                            <SelectorButton
                                bind:checked={meter_options.read_separate_forward_reverse_energy}
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
                    <div class="input-div">
                        <div class="input-content-div">
                            <SelectorButton
                                bind:checked={meter_options.negative_reactive_power}
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
                    <div class="input-div">
                        <div class="input-content-div">
                            <SelectorButton
                                bind:checked={meter_options.frequency_reading}
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
            <div class="device-section-div">
                <div class="title">
                    <h3>{$texts.deviceNodes[$selectedLang]}</h3>
                    <span>{$texts.deviceNodesSub[$selectedLang]}</span>
                </div>
                <div class="nodes-grid-div">
                    <NodesGrid
                        width="100%"
                        height="100px"
                        borderRadius="10px"
                        backgroundColor="#252b33"
                        borderColor="#323a45"
                    />
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
                    onClick={() => {
                        showSaveWindow = true;
                    }}
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
                    onClick={() => {
                        showDeleteWindow = true;
                    }}
                />
            </div>
        </div>
        {#if showDeleteWindow}
            <div class="overlay-device-div">
                <div class="overlay-device-div-content">
                    <div class="window-div">
                        <ConfirmWindow
                            title={`${$texts.deleteDevice[$selectedLang]} ${deviceName}`}
                            width="80%"
                            minWidth="300px"
                            maxWidth="550px"
                            height="fit-content"
                            borderRadius="10px"
                            borderColor="#2a2e3a"
                            backgroundColor="#14161c"
                            closeWindow={() => {
                                showDeleteWindow = false;
                            }}
                        >
                            <span>{$texts.deleteDeviceInfo[$selectedLang]}</span>
                            <div class="input-field-div">
                                <InputField
                                    bind:inputValue={deleteDeviceName}
                                    infoText={$texts.confirmDeleteDevice[$selectedLang]}
                                    width="100%"
                                    height="40px"
                                    borderRadius="5px"
                                    backgroundColor="#23272f"
                                    borderColor="#323a45"
                                    selectedBackgroundColor="#252b33"
                                    selectedBorderColor="#e74c3c"
                                    fontSize="1rem"
                                    fontColor="#f5f5f5"
                                    fontWeight="300"
                                    infoTextColor="rgb(170, 170, 170)"
                                    infoTextSize="0.95rem"
                                />
                            </div>
                            <div class="button-div">
                                <Button
                                    enabled={deleteDeviceName === deviceName}
                                    buttonText={$texts.confirm[$selectedLang]}
                                    width="150px"
                                    height="40px"
                                    borderRadius="5px"
                                    backgroundColor="#E74C3C"
                                    hoverColor="#C0392B"
                                    borderColor="#A93226"
                                    disabledBackgroundColor="#3a2323"
                                    disabledHoverColor="#2a1818"
                                    disabledBorderColor="#5a3a3a"
                                    fontColor="#f5f5f5"
                                    onClick={deleteDevice}
                                />
                            </div>
                        </ConfirmWindow>
                    </div>
                </div>
            </div>
        {/if}
        {#if showSaveWindow}
            <div class="overlay-device-div">
                <div class="overlay-device-div-content">
                    <div class="window-div">
                        <ConfirmWindow
                            title={`${$texts.saveDevice[$selectedLang]}`}
                            width="80%"
                            minWidth="300px"
                            maxWidth="550px"
                            height="fit-content"
                            borderRadius="10px"
                            borderColor="#2a2e3a"
                            backgroundColor="#14161c"
                            closeWindow={() => {
                                showSaveWindow = false;
                            }}
                        >
                            <span class="save-window-text"
                                >{$texts.saveDeviceInfo[$selectedLang]}</span
                            >
                            <div class="button-div save-window-button">
                                <Button
                                    buttonText={$texts.confirm[$selectedLang]}
                                    width="150px"
                                    height="40px"
                                    borderRadius="5px"
                                    backgroundColor="#2F80ED"
                                    hoverColor="#1C6DD0"
                                    borderColor="#1456B0"
                                    fontColor="#f5f5f5"
                                    onClick={saveEdit}
                                />
                            </div>
                        </ConfirmWindow>
                    </div>
                </div>
            </div>
        {/if}
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

    .device-section-div {
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

    .device-section-div .title {
        display: flex;
        flex-direction: column;
        align-self: flex-start;
        gap: 10px;
        padding: 20px;
        padding-left: 0px;
        padding-right: 0px;
        width: 100%;
    }

    .device-section-div h3 {
        color: #f5f5f5;
        font-size: 1rem;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        margin: 0;
        padding: 0;
    }

    .device-section-div span {
        color: rgb(170, 170, 170);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 400;
        margin: 0;
        padding: 0;
        line-height: 1.5;
    }

    .device-section-div .optional-div {
        padding-top: 50px;
    }

    .device-section-div .optional-div .optional-text {
        display: block;
        width: 100%;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding-bottom: 5px;
    }

    .device-section-div .nodes-grid-div {
        width: 100%;
        height: fit-content;
        padding: 10px;
        padding-left: 0px;
        padding-right: 0px;
        box-sizing: border-box;
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

    .input-div .input-content-div {
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

    .overlay-device-div {
        position: absolute;
        inset: 0;
    }

    .overlay-device-div-content {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        background: rgba(24, 29, 35, 0.25);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    .overlay-device-div-content .window-div {
        width: 100%;
        height: fit-content;
        margin: 0;
        padding: 0;
        position: sticky;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .overlay-device-div-content .window-div span {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1rem;
        font-weight: 300;
        color: #e74c3c;
        line-height: 1.5;
        text-align: left;
        word-break: break-word;
    }

    .overlay-device-div-content .window-div span.save-window-text {
        color: rgb(170, 170, 170);
    }

    .overlay-device-div-content .window-div .input-field-div {
        margin: 0;
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 20px;
        padding-left: 0px;
        padding-right: 0px;
    }

    .overlay-device-div-content .window-div .button-div {
        margin: 0;
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 10px;
        padding-left: 0px;
        padding-right: 0px;
    }

    .overlay-device-div-content .window-div .button-div.save-window-button {
        padding: 10px;
        padding-top: 20px;
        padding-left: 0px;
        padding-right: 0px;
    }

    @media (max-width: 769px) {
        .action-buttons-div {
            grid-template-columns: 1fr;
        }
    }
</style>
