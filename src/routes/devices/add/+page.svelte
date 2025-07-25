<script lang="ts">
    import { onMount } from "svelte";
    import { validateDeviceName, validateOpcUaUrl, validateModbusRtuPort, createNewDevice } from "$lib/ts/devices";
    import { getNodeIndex, getDefaultNodesList, changeNodeProtocol } from "$lib/ts/nodes";
    import { nodeSections } from "$lib/stores/nodes";
    import Selector from "../../../components/General/Selector.svelte";
    import SelectorButton from "../../../components/General/SelectorButton.svelte";
    import HintInfo from "../../../components/General/HintInfo.svelte";
    import EditableText from "../../../components/General/EditableText.svelte";
    import UploadImage from "../../../components/General/UploadImage.svelte";
    import Button from "../../../components/General/Button.svelte";
    import ModalWindow from "../../../components/General/ModalWindow.svelte";
    import InputField from "../../../components/General/InputField.svelte";
    import NodesGrid from "../../../components/Devices/Nodes/NodesGrid.svelte";
    import NodeConfigWindow from "../../../components/Devices/Nodes/NodeConfigWindow.svelte";
    import { Protocol, defaultOPCUAOptions, defaultModbusRTUOptions, defaultDeviceOptions } from "$lib/stores/devices";

    // Types
    import type { NewDeviceMeter, EditableDeviceOPCUAConfig, EditableDeviceModbusRTUConfig } from "$lib/stores/devices";
    import type { EditableDeviceNode, NodeEditState, NodePhase } from "$lib/stores/nodes";

    // Navigation
    import { navigateTo } from "$lib/ts/navigation";

    // Stores for multi-language support
    import { texts, selectedLang } from "$lib/stores/lang";
    import { protocolTexts, meterTypeTexts, baudrateTexts, parityTexts, bytesizeTexts, stopbitsTexts } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/stores/alerts";

    // Stores for authorization
    import { loadedDone } from "$lib/stores/navigation";

    // Variables
    let showAddWindow: boolean = false; // Show Add Device Window
    let showConfigNodeWindow: boolean = false; // Show Node Full Configuration Window

    let deviceData: NewDeviceMeter; // Device Data
    let opcuaConfig: EditableDeviceOPCUAConfig | null; // OPC UA Configuration
    let modbusRTUConfig: EditableDeviceModbusRTUConfig | null; // Modbus RTU Configuration

    let nodesInitialized: boolean = false; // Nodes are initialized (fetched) from server
    let nodes: Array<EditableDeviceNode>;
    let nodesBySection: Record<NodePhase, Array<EditableDeviceNode>>;

    let editingNode: EditableDeviceNode; // Current Node being edited in Configuration Window
    let editingNodeState: NodeEditState; // Current state of the Node being edited

    let deviceImage: File | undefined;

    let validOpcUaUrl: boolean; // Valid OPC UA Url
    let validModbusRtuPort: boolean; // Valid Modbus RTU Port

    // Reactive Statements

    //Synchronize communication configuration with device data
    $: opcuaConfig = deviceData?.protocol === Protocol.OPC_UA ? (deviceData.communication_options as EditableDeviceOPCUAConfig) : null;
    $: modbusRTUConfig = deviceData?.protocol === Protocol.MODBUS_RTU ? (deviceData.communication_options as EditableDeviceModbusRTUConfig) : null;

    $: if (opcuaConfig) {
        deviceData.communication_options = opcuaConfig;
        validOpcUaUrl = validateOpcUaUrl(opcuaConfig.url);
    }
    $: if (modbusRTUConfig) {
        deviceData.communication_options = modbusRTUConfig;
        validModbusRtuPort = validateModbusRtuPort(modbusRTUConfig.port);
    }

    // Get nodes from the nodes array by section
    $: if (nodes) {
        nodesBySection = nodeSections.reduce(
            (acc: Record<NodePhase, Array<EditableDeviceNode>>, section) => {
                acc[section.key] = nodes.filter(section.filter);
                return acc;
            },
            {} as Record<NodePhase, Array<EditableDeviceNode>>,
        );
    }

    // Functions

    //Function to save device changes
    async function addDevice(): Promise<void> {
        showAddWindow = false;
    }

    // Function to cancel add device (go to devices page)
    async function cancelAdd(): Promise<void> {
        await navigateTo("/devices", $selectedLang, {});
    }

    // Mount function
    onMount(() => {
        deviceData = createNewDevice(defaultDeviceOptions.protocol, defaultDeviceOptions.type, defaultDeviceOptions.options);
        nodes = getDefaultNodesList(deviceData);
        loadedDone.set(true);
        nodesInitialized = true;
    });
</script>

<!-- Add Device Page: allows the user to create a new device by entering its details and configuration options, including editable fields for device name, image, communication settings, and meter options.
Shows input forms for protocol-specific parameters and organizes device nodes for initial setup. Includes action buttons for saving or canceling the new device. -->
<div class="content">
    {#if deviceData}
        <div class="add-device-div">
            <div class="device-identification-div">
                <EditableText
                    bind:text={deviceData.name}
                    placeHolder={$texts.deviceName[$selectedLang]}
                    allwaysEnabled={true}
                    enableTextInvalid={true}
                    textInvalid={!validateDeviceName(deviceData.name)}
                    width="75%"
                    minWidth="250px"
                    maxWidth="500px"
                    fontSize="1.1rem"
                    fontColor="#f5f5f5"
                    borderColorBottom="rgba(255, 255, 255, 0.2)"
                    invalidBorderColorBottom="#e74c3c"
                    buttonImageWidth="22px"
                    buttonImageHeight="22px"
                />
                <div class="device-image-div">
                    <UploadImage
                        bind:imageFile={deviceImage}
                        width="200px"
                        height="200px"
                        borderRadius="50%"
                        imageUrl={`/img/default-device.png`}
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
                            useLang={true}
                            options={$protocolTexts}
                            bind:selectedOption={deviceData.protocol}
                            onChange={() => {
                                if (deviceData.protocol === Protocol.OPC_UA) {
                                    deviceData.communication_options = defaultOPCUAOptions;
                                } else if (deviceData.protocol === Protocol.MODBUS_RTU) {
                                    deviceData.communication_options = defaultModbusRTUOptions;
                                }
                                for (let node of nodes) {
                                    if (deviceData.protocol !== node.protocol && !node.config.calculated) {
                                        changeNodeProtocol(deviceData.protocol, node);
                                    }
                                }
                                nodes = [...nodes];
                            }}
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
                                <span class="info-text">{$texts.communicationProtocolInfo[$selectedLang]}</span>
                            </HintInfo>
                        </div>
                    </div>
                </div>

                {#if opcuaConfig}
                    <div class="device-input-div">
                        <span>{$texts.networkAddress[$selectedLang]}</span>
                        <div class="input-div">
                            <div class="input-content-div">
                                <InputField
                                    bind:inputValue={opcuaConfig.url}
                                    inputInvalid={!validOpcUaUrl}
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
                                    bind:inputValue={opcuaConfig.timeout}
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
                    <div class="optional-div">
                        <span class="optional-text">{$texts.authenticationOptional[$selectedLang]}</span>
                        <div class="device-input-div">
                            <span>{$texts.username[$selectedLang]}</span>
                            <div class="input-div">
                                <div class="input-content-div">
                                    <InputField
                                        bind:inputValue={opcuaConfig.username}
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
                                        <span class="info-text">{$texts.commUsernameInfo[$selectedLang]}</span>
                                    </HintInfo>
                                </div>
                            </div>
                        </div>
                        <div class="device-input-div">
                            <span>{$texts.password[$selectedLang]}</span>
                            <div class="input-div">
                                <div class="input-content-div">
                                    <InputField
                                        bind:inputValue={opcuaConfig.password}
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
                                        <span class="info-text">{$texts.commPasswordInfo[$selectedLang]}</span>
                                    </HintInfo>
                                </div>
                            </div>
                        </div>
                    </div>
                {:else if modbusRTUConfig}
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
                            useLang={true}
                            options={$meterTypeTexts}
                            bind:selectedOption={deviceData.type}
                            onChange={() => {
                                nodes = getDefaultNodesList(deviceData);
                            }}
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
                                <span class="info-text">{$texts.connectionTypeInfo[$selectedLang]}</span>
                            </HintInfo>
                        </div>
                    </div>
                </div>

                <div class="device-input-div">
                    <span>{$texts.readEnergyFromMeter[$selectedLang]}</span>
                    <div class="input-div">
                        <div class="input-content-div">
                            <SelectorButton
                                bind:checked={deviceData.options.read_energy_from_meter}
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
                                <span class="info-text">{$texts.readEnergyFromMeterInfo[$selectedLang]}</span>
                            </HintInfo>
                        </div>
                    </div>
                </div>
                <div class="device-input-div">
                    <span>{$texts.readForwardReverseEnergySeparate[$selectedLang]}</span>
                    <div class="input-div">
                        <div class="input-content-div">
                            <SelectorButton
                                bind:checked={deviceData.options.read_separate_forward_reverse_energy}
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
                                <span class="info-text">{$texts.readForwardReverseEnergySeparateInfo[$selectedLang]}</span>
                            </HintInfo>
                        </div>
                    </div>
                </div>
                <div class="device-input-div">
                    <span>{$texts.negativeReactivePower[$selectedLang]}</span>
                    <div class="input-div">
                        <div class="input-content-div">
                            <SelectorButton
                                bind:checked={deviceData.options.negative_reactive_power}
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
                                <span class="info-text">{$texts.negativeReactivePowerInfo[$selectedLang]}</span>
                            </HintInfo>
                        </div>
                    </div>
                </div>
                <div class="device-input-div">
                    <span>{$texts.frequencyReading[$selectedLang]}</span>
                    <div class="input-div">
                        <div class="input-content-div">
                            <SelectorButton
                                bind:checked={deviceData.options.frequency_reading}
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
                                <span class="info-text">{$texts.frequencyReadingInfo[$selectedLang]}</span>
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
                        {deviceData}
                        {nodesInitialized}
                        bind:nodes
                        bind:nodesBySection
                        onPropertyChanged={(node: EditableDeviceNode) => {
                            const editNodesIndex = getNodeIndex(node, nodes);
                            if (editNodesIndex !== -1) {
                                nodes[editNodesIndex] = node;
                                nodes = [...nodes];
                            }
                            if (nodes[editNodesIndex] === editingNode) {
                                editingNode = nodes[editNodesIndex];
                            }
                        }}
                        onShowConfigPopup={(node: EditableDeviceNode, nodeEditingState: NodeEditState) => {
                            editingNode = node;
                            editingNodeState = nodeEditingState;
                            showConfigNodeWindow = true;
                        }}
                        width="100%"
                        height="fit-content"
                        borderRadius="10px"
                        backgroundColor="#252b33"
                        borderColor="#323a45"
                        headerBackgroundColor="#1A2128"
                        headerTextColor="#f5f5f5"
                        subSectionBackgroundColor="#1f2a31"
                        subSectionTextColor="#cbd5e1"
                        subSectionBorderColor="transparent"
                    />
                </div>
            </div>
            <div class="action-buttons-div">
                <Button
                    buttonText={$texts.cancel[$selectedLang]}
                    width="250px"
                    height="50px"
                    borderRadius="5px"
                    backgroundColor="#232528"
                    borderColor="#8A8C91"
                    hoverColor="#2C2E34"
                    fontColor="#f5f5f5"
                    imageURL="/img/previous.png"
                    imageWidth="22px"
                    imageHeight="22px"
                    imageLeftPos="20px"
                    onClick={cancelAdd}
                />
                <Button
                    enabled={$loadedDone && nodesInitialized}
                    buttonText={$texts.add[$selectedLang]}
                    width="250px"
                    height="50px"
                    borderRadius="5px"
                    backgroundColor="#16281a"
                    borderColor="#1a8d46"
                    hoverColor="#1c3922"
                    disabledBackgroundColor="#282828"
                    disabledBorderColor="#444444"
                    disabledHoverColor="#282828"
                    fontColor="#f5f5f5"
                    imageURL="/img/plus.png"
                    imageWidth="22px"
                    imageHeight="22px"
                    imageLeftPos="20px"
                    onClick={() => {
                        showAddWindow = true;
                    }}
                />
            </div>
        </div>
        {#if showConfigNodeWindow}
            <div class="overlay-device-div">
                <div class="overlay-device-div-content">
                    <div class="window-div">
                        <NodeConfigWindow
                            bind:visible={showConfigNodeWindow}
                            onPropertyChanged={() => {
                                const editNodesIndex = getNodeIndex(editingNode, nodes);
                                if (editNodesIndex !== -1) {
                                    nodes[editNodesIndex] = editingNode;
                                    nodes = [...nodes];
                                }
                                if (nodes[editNodesIndex] === editingNode) {
                                    editingNode = nodes[editNodesIndex];
                                }
                            }}
                            {deviceData}
                            node={editingNode}
                            bind:nodeEditingState={editingNodeState}
                            sectionNodes={nodesBySection[editingNode.phase]}
                        />
                    </div>
                </div>
            </div>
        {/if}
        {#if showAddWindow}
            <div class="overlay-device-div">
                <div class="overlay-device-div-content">
                    <div class="window-div">
                        <ModalWindow
                            title={`${$texts.addNewDevice[$selectedLang]}`}
                            width="80%"
                            minWidth="300px"
                            maxWidth="550px"
                            height="fit-content"
                            borderRadius="10px"
                            borderColor="#2a2e3a"
                            backgroundColor="#14161c"
                            closeWindow={() => {
                                showAddWindow = false;
                            }}
                        >
                            <span class="add-window-text">{$texts.addNewDeviceInfo[$selectedLang]}</span>
                            <div class="button-div save-window-button">
                                <Button
                                    buttonText={$texts.confirm[$selectedLang]}
                                    width="150px"
                                    height="40px"
                                    borderRadius="5px"
                                    backgroundColor="#1a8d46"
                                    hoverColor="#17673a"
                                    borderColor="#145a36"
                                    fontColor="#f5f5f5"
                                    onClick={addDevice}
                                />
                            </div>
                        </ModalWindow>
                    </div>
                </div>
            </div>
        {/if}
    {/if}
</div>

<style>
    /* Main content container for the edit device page */
    .content {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    /* Container for all add device sections */
    .add-device-div {
        height: 100%;
        width: 100%;
        min-width: 250px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    /* Device identification section: name, ID, image */
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

    /* Device image container styling */
    .device-identification-div .device-image-div {
        padding-top: 10px;
    }

    /* Section for device configuration options */
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

    /* Title area for each device section */
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

    /* Section title text styling */
    .device-section-div h3 {
        color: #f5f5f5;
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
        padding: 0;
    }

    /* Section subtitle text styling */
    .device-section-div span {
        color: rgb(170, 170, 170);
        font-weight: 400;
        margin: 0;
        padding: 0;
        line-height: 1.5;
    }

    /* Optional authentication section styling */
    .device-section-div .optional-div {
        padding-top: 50px;
    }

    /* Optional authentication label styling */
    .device-section-div .optional-div .optional-text {
        display: block;
        width: 100%;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding-bottom: 5px;
    }

    /* Nodes grid container styling */
    .device-section-div .nodes-grid-div {
        width: 100%;
        height: fit-content;
        padding: 10px;
        padding-left: 0px;
        padding-right: 0px;
        box-sizing: border-box;
    }

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

    /* Action buttons container (save, cancel, delete) */
    .action-buttons-div {
        margin: 0;
        padding: 0;
        padding-top: 50px;
        padding-bottom: 50px;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(2, 250px);
        gap: 30px;
        justify-content: center;
        justify-items: center;
    }

    /* Overlay for modal windows (node config, delete, save) */
    .overlay-device-div {
        position: absolute;
        inset: 0;
    }

    /* Overlay content container for modals */
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
        z-index: 2;
    }

    /* Modal window container styling */
    .overlay-device-div-content .window-div {
        width: 100%;
        height: fit-content;
        margin: 0;
        padding: 0;
        position: sticky;
        top: 50%;
        transform: translateY(calc(-50% + 37px));
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Modal window text styling */
    .overlay-device-div-content .window-div span {
        font-size: 1rem;
        font-weight: 400;
        color: #e74c3c;
        line-height: 1.5;
        text-align: left;
        word-break: break-word;
    }

    /* Add window text color override */
    .overlay-device-div-content .window-div span.add-window-text {
        color: rgb(170, 170, 170);
    }

    /* Button container inside modal windows */
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

    /* Button container for save window modal */
    .overlay-device-div-content .window-div .button-div.save-window-button {
        padding: 10px;
        padding-top: 20px;
        padding-left: 0px;
        padding-right: 0px;
    }

    /* Responsive: stack action buttons vertically on small screens */
    @media (max-width: 1200px) {
        .action-buttons-div {
            grid-template-columns: 1fr;
        }
    }

    /* Responsive: limit add device container width on large screens */
    @media (min-width: 880px) {
        .add-device-div {
            width: 80%;
        }
    }
</style>
