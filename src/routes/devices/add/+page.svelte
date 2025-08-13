<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { getDefaultImage, addDevice, createNewDevice, updateDeviceValidation, validDeviceOperation, convertToDevice } from "$lib/ts/devices";
    import { getNodeIndex, getDefaultNodesList, changeNodeProtocol, updateNodesValidation, convertToNodes } from "$lib/ts/nodes";
    import { nodeSections } from "$lib/stores/nodes";
    import Selector from "../../../components/General/Selector.svelte";
    import HintInfo from "../../../components/General/HintInfo.svelte";
    import EditableText from "../../../components/General/EditableText.svelte";
    import UploadImage from "../../../components/General/UploadImage.svelte";
    import Button from "../../../components/General/Button.svelte";
    import ModalWindow from "../../../components/General/ModalWindow.svelte";
    import NodesGrid from "../../../components/Devices/Nodes/NodesGrid.svelte";
    import NodeConfigWindow from "../../../components/Devices/Nodes/NodeConfigWindow.svelte";
    import OpcuaConfig from "../../../components/Devices/OPCUAConfig.svelte";
    import ModbusRtuConfig from "../../../components/Devices/ModbusRTUConfig.svelte";
    import MeterOptionsConfig from "../../../components/Devices/MeterOptionsConfig.svelte";
    import { Protocol, defaultOPCUAOptions, defaultModbusRTUOptions, defaultDeviceOptions } from "$lib/stores/devices";

    // Types
    import type { NewDeviceMeter, EditableDeviceOPCUAConfig, EditableDeviceModbusRTUConfig } from "$lib/stores/devices";
    import type { EditableDeviceNode, NodeEditState, NodePhase } from "$lib/stores/nodes";

    // Styles
    import { SubSucessButtonStyle, SucessButtonStyle } from "$lib/style/button";

    // Navigation
    import { navigateTo } from "$lib/ts/navigation";

    // Stores for multi-language support
    import { texts, selectedLang } from "$lib/stores/lang";
    import { protocolTexts } from "$lib/stores/lang";

    // Stores for authorization
    import { loadedDone } from "$lib/stores/navigation";
    import { showAlert } from "$lib/stores/alerts";

    // Variables
    let showAddWindow: boolean = false; // Show Add Device Window
    let showConfigNodeWindow: boolean = false; // Show Node Full Configuration Window

    let performingAddRequest: boolean = false; // Performing Add Device Request

    let defaultImgPollTimer: ReturnType<typeof setTimeout>; // Timeout for default image request

    let deviceData: NewDeviceMeter; // Device Data
    let opcuaConfig: EditableDeviceOPCUAConfig | null; // OPC UA Configuration
    let modbusRTUConfig: EditableDeviceModbusRTUConfig | null; // Modbus RTU Configuration

    let nodesInitialized: boolean = false; // Nodes are initialized (fetched) from server
    let nodes: Array<EditableDeviceNode>;
    let nodesBySection: Record<NodePhase, Array<EditableDeviceNode>>;

    let editingNode: EditableDeviceNode; // Current Node being edited in Configuration Window
    let editingNodeState: NodeEditState; // Current state of the Node being edited

    // Reactive Statements

    //Synchronize communication configuration with device data
    $: opcuaConfig = deviceData?.protocol === Protocol.OPC_UA ? (deviceData.communication_options as EditableDeviceOPCUAConfig) : null;
    $: modbusRTUConfig = deviceData?.protocol === Protocol.MODBUS_RTU ? (deviceData.communication_options as EditableDeviceModbusRTUConfig) : null;

    $: if (opcuaConfig) {
        deviceData.communication_options = opcuaConfig;
    }
    $: if (modbusRTUConfig) {
        deviceData.communication_options = modbusRTUConfig;
    }

    // Get nodes from the nodes array by section and update nodes validation status
    $: if (deviceData && nodes) {
        nodesBySection = nodeSections.reduce(
            (acc: Record<NodePhase, Array<EditableDeviceNode>>, section) => {
                acc[section.key] = nodes.filter((node) => section.filter(node, deviceData.type));
                return acc;
            },
            {} as Record<NodePhase, Array<EditableDeviceNode>>,
        );
        updateNodesValidation(nodes, nodesBySection);
        updateDeviceValidation(deviceData, nodes);
    }

    // Functions

    // Function to fetch default image for devices
    function fetchDefaultImage(): void {
        const tick = async () => {
            let sucess = false;
            try {
                const { status, data }: { status: number; data: any } = await getDefaultImage();
                if (status !== 200) {
                    showAlert($texts.errorDefaultImage, {
                        error: String(data["error"]),
                    });
                } else {
                    const deviceImage = data as Record<string, string>;
                    deviceData.current_image_url = `data:${deviceImage["type"]};base64,${deviceImage["data"]}`;
                    sucess = true;
                }
            } catch (e) {
                showAlert($texts.errorDefaultImage, {
                    error: String(e),
                });
                console.error(`Could not obtain the devices status: ${e}`);
            }
            loadedDone.set(true);
            if (!sucess) {
                defaultImgPollTimer = setTimeout(tick, 2500);
            }
        };
        tick();
    }

    //Function to save device changes
    async function addDeviceConfirmation(): Promise<void> {
        if ($loadedDone && nodesInitialized) {
            let convertedNodes = convertToNodes(nodes);

            performingAddRequest = true;
            const { status, data } = await addDevice(convertToDevice(deviceData), deviceData.device_image, convertedNodes);
            performingAddRequest = false;
            if (status !== 200) {
                showAlert($texts.addDeviceRequestError, {
                    error: String(data["error"]),
                });
                showAddWindow = false;
                return;
            }
            await navigateTo("/devices", $selectedLang, {});
        }
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
        fetchDefaultImage();
        loadedDone.set(true);
        nodesInitialized = true;
    });

    // Cleanup function
    onDestroy(() => {
        clearTimeout(defaultImgPollTimer);
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
                    textInvalid={!deviceData.validation.deviceName}
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
                        bind:imageFile={deviceData.device_image}
                        width="200px"
                        height="200px"
                        borderRadius="50%"
                        imageUrl={deviceData.current_image_url ?? ""}
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
                            inputInvalid={!deviceData.validation.deviceProtocol}
                            enableInputInvalid={true}
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
                            badFormatBorderColor="#e74c3c"
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
                    <OpcuaConfig bind:opcuaConfig />
                {:else if modbusRTUConfig}
                    <ModbusRtuConfig bind:modbusRTUConfig />
                {/if}
            </div>
            <div class="device-section-div">
                <div class="title">
                    <h3>{$texts.deviceOptions[$selectedLang]}</h3>
                    <span>{$texts.deviceOptionsSub[$selectedLang]}</span>
                </div>
                <MeterOptionsConfig bind:deviceData bind:nodes bind:meterOptionsValid={deviceData.validation.meterOptions} />
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
                <Button buttonText={$texts.cancel[$selectedLang]} imageURL="/img/previous.png" onClick={cancelAdd} />
                <Button
                    enabled={$loadedDone && nodesInitialized}
                    buttonText={$texts.add[$selectedLang]}
                    style={$SucessButtonStyle}
                    imageURL="/img/plus.png"
                    onClick={() => {
                        if (validDeviceOperation(deviceData)) {
                            showAddWindow = true;
                        }
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
                            <div class="modal-window-div">
                                <span class="add-window-text">{$texts.addNewDeviceInfo[$selectedLang]}</span>
                                <div class="button-div save-window-button">
                                    <Button
                                        processing={performingAddRequest}
                                        buttonText={$texts.confirm[$selectedLang]}
                                        style={$SubSucessButtonStyle}
                                        onClick={addDeviceConfirmation}
                                    />
                                </div>
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

    /* Modal window content container styling */
    .overlay-device-div-content .window-div .modal-window-div {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 20px;
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
