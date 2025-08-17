<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { getDeviceState, editDevice, deleteDevice } from "$lib/ts/api/device";
    import { getDeviceNodesConfig } from "$lib/ts/api/nodes";
    import { convertToEditableDevice, convertToDevice } from "$lib/ts/factory/device";
    import { updateDeviceValidation, validDeviceOperation, areDevicesEqual } from "$lib/ts/validation/device";
    import { convertToEditableNodes, convertToNodes } from "$lib/ts/factory/nodes";
    import { updateNodesValidation, areNodesEqual } from "$lib/ts/validation/nodes";
    import { changeNodeProtocol } from "$lib/ts/handlers/nodes";
    import { getNodeIndex } from "$lib/ts/util/nodes";
    import { nodeSections } from "$lib/stores/nodes";
    import Selector from "../../../components/General/Selector.svelte";
    import HintInfo from "../../../components/General/HintInfo.svelte";
    import EditableText from "../../../components/General/EditableText.svelte";
    import UploadImage from "../../../components/General/UploadImage.svelte";
    import Button from "../../../components/General/Button.svelte";
    import ModalWindow from "../../../components/General/ModalWindow.svelte";
    import InputField from "../../../components/General/InputField.svelte";
    import NodesGrid from "../../../components/Devices/Nodes/NodesGrid.svelte";
    import NodeConfigWindow from "../../../components/Devices/Nodes/NodeConfigWindow.svelte";
    import OpcuaConfig from "../../../components/Devices/OPCUAConfig.svelte";
    import ModbusRtuConfig from "../../../components/Devices/ModbusRTUConfig.svelte";
    import MeterOptionsConfig from "../../../components/Devices/MeterOptionsConfig.svelte";
    import { Protocol, defaultOPCUAOptions, defaultModbusRTUOptions } from "$lib/stores/devices";

    // Types
    import type { DeviceMeter, EditableDeviceMeter, EditableDeviceOPCUAConfig, EditableDeviceModbusRTUConfig } from "$lib/stores/devices";
    import type { DeviceNode, EditableDeviceNode, NodeEditState, NodePhase } from "$lib/stores/nodes";

    // Styles
    import { SubDefaultButtonStyle, PrimaryButtonStyle, SubPrimaryButtonStyle, DangerButtonStyle, SubDangerButtonStyle } from "$lib/style/button";

    // Navigation
    import { navigateTo } from "$lib/ts/view/navigation";

    // Stores for multi-language support
    import { texts, selectedLang } from "$lib/stores/lang";
    import { protocolTexts } from "$lib/stores/lang";

    // Stores for alerts
    import { showAlert } from "$lib/stores/alerts";

    // Stores for authorization
    import { loadedDone } from "$lib/stores/navigation";

    // Variables
    let showCancelWindow: boolean = false; // Show Cancelation Window (if changes were made)
    let showSaveWindow: boolean = false; // Show Save Configuration Window
    let showDeleteWindow: boolean = false; // Show Delete Device Window
    let showConfigNodeWindow: boolean = false; // Show Node Full Configuration Window

    let deleteDeviceName: string; // Variable to confirm device delete (must match device name)

    let performingSaveRequest: boolean = false; // Performing Save Device Request
    let performingDeleteRequest: boolean = false; // Performing Delete Device Request

    let devicePollTimer: ReturnType<typeof setTimeout>; // Timeout for device configuration request
    let nodesPollTimer: ReturnType<typeof setTimeout>; // Timeout for device nodes configuration request

    let initialDeviceData: DeviceMeter; // Initial Device Data (to check if there were changes made)
    let initialNodes: Array<DeviceNode>; // Initial Nodes (to check if there were changes made)

    let deviceData: EditableDeviceMeter; // Device Data
    let deviceImageURL: string; // Device image URL (from request)
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

    // Get nodes from the nodes array by section
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

    //Function to fetch device configuration
    function fetchDeviceConfig(id: number): void {
        const tick = async () => {
            let sucess = false;
            try {
                const { status, data }: { status: number; data: any } = await getDeviceState(id);
                if (status !== 200) {
                    showAlert($texts.errorDeviceConfig, {
                        error: String(data["error"]),
                    });
                } else {
                    const { image: deviceImage, ...requestDeviceData } = data as DeviceMeter & { image: Record<string, string> };
                    initialDeviceData = requestDeviceData as DeviceMeter;
                    deviceData = convertToEditableDevice(initialDeviceData, deviceImage);
                    sucess = true;
                }
            } catch (e) {
                showAlert($texts.errorDeviceConfig, {
                    error: String(e),
                });
                console.error(`Could not obtain the device configuration: ${e}`);
            }
            loadedDone.set(true);
            if (!sucess) {
                devicePollTimer = setTimeout(tick, 2500);
            }
        };
        tick();
    }

    // Function to fetch device nodes (variables)
    function fetchDeviceNodesConfig(id: number): void {
        const tick = async () => {
            let sucess = false;
            try {
                const { status, data }: { status: number; data: any } = await getDeviceNodesConfig(id);
                if (status !== 200) {
                    showAlert($texts.errorDeviceNodesConfig, {
                        error: String(data["error"]),
                    });
                } else {
                    let requestDeviceNodes: Record<string, DeviceNode> = data;
                    initialNodes = Object.values(requestDeviceNodes) as Array<DeviceNode>;
                    sucess = true;
                }
            } catch (e) {
                showAlert($texts.errorDeviceNodesConfig, {
                    error: String(e),
                });
                console.error(`Could not obtain the nodes configuration: ${e}`);
            }
            if (!sucess) {
                nodesPollTimer = setTimeout(tick, 2500);
            }
        };
        tick();
    }

    // When device data is ready as well as nodes, initializes nodes
    $: if (initialNodes && deviceData && !nodesInitialized) {
        try {
            nodes = convertToEditableNodes(initialNodes, deviceData.type);
            nodesInitialized = true;
        } catch (e) {
            console.error(`Could not initialize the nodes configuration from the request: ${e}`);
            setTimeout(() => fetchDeviceNodesConfig(deviceData.id), 2500);
        }
    }

    //Function to save device changes
    async function editDeviceConfirmation(): Promise<void> {
        if (validDeviceOperation(deviceData)) {
            let convertedDevice = convertToDevice(deviceData);
            let convertedNodes = convertToNodes(nodes);

            try {
                if (
                    areNodesEqual(initialNodes, convertedNodes) &&
                    areDevicesEqual(initialDeviceData, convertedDevice) &&
                    deviceData.device_image === undefined
                ) {
                    showAlert($texts.noChangesToDevice, {}, true);
                    showSaveWindow = false;
                    return;
                }
                performingSaveRequest = true;
                const { status, data } = await editDevice(convertedDevice, deviceData.device_image, convertedNodes);
                performingSaveRequest = false;
                if (status !== 200) {
                    showAlert($texts.editDeviceRequestError, {
                        error: String(data["error"]),
                    });
                    showSaveWindow = false;
                    return;
                }
                await navigateTo("/devices", $selectedLang, {});
            } catch (e) {
                console.error(e);
            }
        }
        showSaveWindow = false;
    }

    // Function to cancel edit device (go to devices page)
    async function cancelEdit(): Promise<void> {
        showCancelWindow = false;
        await navigateTo("/devices", $selectedLang, {});
    }

    // Function to delete device
    async function deleteDeviceConfirmation(): Promise<void> {
        if ($loadedDone && nodesInitialized) {
            try {
                performingDeleteRequest = true;
                const { status, data } = await deleteDevice(deviceData.name, deviceData.id);
                performingDeleteRequest = false;
                if (status !== 200) {
                    showAlert($texts.deleteDeviceRequestError, {
                        error: String(data["error"]),
                    });
                    deleteDeviceName = "";
                    showDeleteWindow = false;
                    return;
                }
                await navigateTo("/devices", $selectedLang, {});
            } catch (e) {
                console.error(e);
            }
        }
        deleteDeviceName = "";
        showDeleteWindow = false;
    }

    // Mount function
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        let deviceId = params.get("deviceId");
        if (deviceId) {
            fetchDeviceConfig(Number(deviceId));
            fetchDeviceNodesConfig(Number(deviceId));
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

<!-- Edit Device Page: displays the selected device's details and configuration options, including editable fields for device name, image, communication settings, and meter options. 
Shows input forms for protocol-specific parameters and organizes device nodes for editing. Includes action buttons for saving, canceling, and deleting the device. -->
<div class="content">
    {#if deviceData}
        <div class="edit-device-div">
            <div class="device-identification-div">
                <EditableText
                    bind:text={deviceData.name}
                    textInvalid={!deviceData.validation.deviceName}
                    enableTextInvalid={true}
                    minWidth="200px"
                    maxWidth="500px"
                />
                <span class="id-text">ID: {String(deviceData?.id).padStart(3, "0")}</span>
                <div class="device-image-div">
                    <UploadImage bind:imageFile={deviceData.device_image} imageUrl={deviceData.current_image_url ?? ""} />
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
                <Button
                    buttonText={$texts.cancel[$selectedLang]}
                    imageURL="/img/previous.png"
                    onClick={() => {
                        if (
                            areNodesEqual(initialNodes, convertToNodes(nodes)) &&
                            areDevicesEqual(initialDeviceData, convertToDevice(deviceData)) &&
                            deviceData.device_image === undefined
                        ) {
                            cancelEdit();
                            return;
                        }
                        showCancelWindow = true;
                    }}
                />
                <Button
                    enabled={$loadedDone && nodesInitialized}
                    buttonText={$texts.save[$selectedLang]}
                    style={$PrimaryButtonStyle}
                    imageURL="/img/save.png"
                    onClick={() => {
                        if (validDeviceOperation(deviceData)) {
                            if (
                                areNodesEqual(initialNodes, convertToNodes(nodes)) &&
                                areDevicesEqual(initialDeviceData, convertToDevice(deviceData)) &&
                                deviceData.device_image === undefined
                            ) {
                                showAlert($texts.noChangesToDevice, {}, true);
                                return;
                            }
                            showSaveWindow = true;
                        }
                    }}
                />
                <Button
                    enabled={$loadedDone && nodesInitialized}
                    buttonText={$texts.delete[$selectedLang]}
                    style={$DangerButtonStyle}
                    imageURL="/img/delete.png"
                    onClick={() => {
                        showDeleteWindow = true;
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
        {#if showDeleteWindow}
            <div class="overlay-device-div">
                <div class="overlay-device-div-content">
                    <div class="window-div">
                        <ModalWindow
                            title={`${$texts.deleteDevice[$selectedLang]} ${deviceData.name}`}
                            minWidth="300px"
                            maxWidth="550px"
                            closeWindow={() => {
                                showDeleteWindow = false;
                            }}
                        >
                            <div class="modal-window-div">
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
                                        fontWeight="400"
                                        infoTextColor="rgb(170, 170, 170)"
                                        infoTextSize="0.95rem"
                                    />
                                </div>
                                <div class="button-div">
                                    <Button
                                        processing={performingDeleteRequest}
                                        enabled={deleteDeviceName === deviceData.name}
                                        buttonText={$texts.confirm[$selectedLang]}
                                        style={$SubDangerButtonStyle}
                                        onClick={deleteDeviceConfirmation}
                                    />
                                </div>
                            </div>
                        </ModalWindow>
                    </div>
                </div>
            </div>
        {/if}
        {#if showCancelWindow}
            <div class="overlay-device-div">
                <div class="overlay-device-div-content">
                    <div class="window-div">
                        <ModalWindow
                            title={`${$texts.cancelDeviceEdit[$selectedLang]}`}
                            minWidth="300px"
                            maxWidth="550px"
                            closeWindow={() => {
                                showCancelWindow = false;
                            }}
                        >
                            <div class="modal-window-div">
                                <span class="save-window-text">{$texts.cancelDeviceEditInfo[$selectedLang]}</span>
                                <div class="button-div save-window-button">
                                    <Button buttonText={$texts.confirm[$selectedLang]} style={$SubDefaultButtonStyle} onClick={cancelEdit} />
                                </div>
                            </div>
                        </ModalWindow>
                    </div>
                </div>
            </div>
        {/if}
        {#if showSaveWindow}
            <div class="overlay-device-div">
                <div class="overlay-device-div-content">
                    <div class="window-div">
                        <ModalWindow
                            title={`${$texts.saveDevice[$selectedLang]}`}
                            minWidth="300px"
                            maxWidth="550px"
                            closeWindow={() => {
                                showSaveWindow = false;
                            }}
                        >
                            <div class="modal-window-div">
                                <span class="save-window-text">{$texts.saveDeviceInfo[$selectedLang]}</span>
                                <div class="button-div save-window-button">
                                    <Button
                                        processing={performingSaveRequest}
                                        buttonText={$texts.confirm[$selectedLang]}
                                        style={$SubPrimaryButtonStyle}
                                        onClick={editDeviceConfirmation}
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

    /* Container for all editable device sections */
    .edit-device-div {
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

    /* Device ID text styling */
    .device-identification-div .id-text {
        padding: 0px;
        padding-top: 10px;
        padding-bottom: 10px;
        color: rgb(170, 170, 170);
        font-size: 0.9rem;
        font-weight: 300;
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
        grid-template-columns: repeat(3, 250px);
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

    /* Save window text color override */
    .overlay-device-div-content .window-div span.save-window-text {
        color: rgb(170, 170, 170);
    }

    /* Input field container inside modal windows */
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

    /* Responsive: limit edit device container width on large screens */
    @media (min-width: 880px) {
        .edit-device-div {
            width: 80%;
        }
    }
</style>
