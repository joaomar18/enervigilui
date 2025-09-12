<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { getDeviceStateWithImage, editDevice, deleteDevice } from "$lib/logic/api/device";
    import { getDeviceNodesConfig } from "$lib/logic/api/nodes";
    import { convertToDevice } from "$lib/logic/factory/device";
    import { updateDeviceValidation, validDeviceOperation } from "$lib/logic/validation/device/base";
    import { convertToNodes } from "$lib/logic/factory/nodes";
    import { updateNodesValidation } from "$lib/logic/validation/nodes/base";
    import { updateNodes, updateEditingNode, updateNodesBySection } from "$lib/logic/handlers/nodes";
    import { protocolPlugins } from "$lib/stores/device/protocol";
    import { showToast } from "$lib/logic/view/toast";
    import { ToastType } from "$lib/stores/view/toast";
    import { MethodRetrier } from "$lib/logic/api/retrier";
    import { deviceProtocolChange } from "$lib/logic/handlers/device";
    import { noChangesToDevice } from "$lib/logic/util/device";
    import Selector from "../../../components/General/Selector.svelte";
    import HintInfo from "../../../components/General/HintInfo.svelte";
    import EditableText from "../../../components/General/EditableText.svelte";
    import UploadImage from "../../../components/General/UploadImage.svelte";
    import Button from "../../../components/General/Button.svelte";
    import NodesGrid from "../../../components/Devices/Nodes/NodesGrid.svelte";
    import MeterOptionsConfig from "../../../components/Devices/MeterOptionsConfig.svelte";
    import PopupNodeConfig from "../../../components/Devices/Nodes/PopupNodeConfig.svelte";
    import PopupDeleteDevice from "../../../components/Devices/PopupDeleteDevice.svelte";
    import PopupSaveDevice from "../../../components/Devices/PopupSaveDevice.svelte";
    import PopupCancelDeviceEdit from "../../../components/Devices/PopupCancelDeviceEdit.svelte";

    // Types
    import type { Device, EditableDevice } from "$lib/types/device/base";
    import type { NodeRecord, EditableNodeRecord, NodeRecordEditingState, NodePhase } from "$lib/types/nodes/base";

    // Styles
    import { PrimaryButtonStyle, DangerButtonStyle } from "$lib/style/button";

    // Navigation
    import { navigateTo } from "$lib/logic/view/navigation";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { protocolTexts } from "$lib/stores/lang/energyMeterTexts";

    // Stores
    import { loadedDone } from "$lib/stores/view/navigation";
    import { currentDeviceID } from "$lib/stores/device/current";

    // Variables
    let showCancelWindow: boolean = false; // Show Cancelation Window (if changes were made)
    let showSaveWindow: boolean = false; // Show Save Configuration Window
    let showDeleteWindow: boolean = false; // Show Delete Device Window
    let showConfigNodeWindow: boolean = false; // Show Node Full Configuration Window
    let performingSaveRequest: boolean = false; // Performing Save Device Request
    let performingDeleteRequest: boolean = false; // Performing Delete Device Request
    let initialDeviceData: Device; // Initial Device Data (to check if there were changes made)
    let initialNodes: Array<NodeRecord>; // Initial Nodes (to check if there were changes made)
    let deviceData: EditableDevice; // Device Data
    let nodes: Array<EditableNodeRecord>; // Editable Nodes Array
    let nodesBySection: Record<NodePhase, Array<EditableNodeRecord>>; // Editable Nodes Array divided by Phase
    let editingNode: EditableNodeRecord; // Current Node being edited in Configuration Window
    let editingNodeState: NodeRecordEditingState; // Current state of the Node being edited
    let nodesInit: boolean = false; // Nodes are initialized
    let contentInit: boolean = false; // Content is initialized

    // Reactive Statements

    // Content is initialized when both loaded is done and nodes are initialized
    $: contentInit = $loadedDone && nodesInit;

    // Update initial device validation
    $: if (deviceData) {
        updateDeviceValidation(deviceData, undefined);
    }

    // Get nodes from the nodes array by section
    $: if (contentInit) {
        nodesBySection = updateNodesBySection(deviceData.type, nodes);
        updateNodesValidation(nodes, nodesBySection);
        updateDeviceValidation(deviceData, nodes);
    }

    // Mount function
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        let deviceDataRetrier: MethodRetrier | null;
        let nodesConfigRetrier: MethodRetrier | null;

        if ($currentDeviceID) {
            deviceDataRetrier = new MethodRetrier(async (signal) => {
                ({ initialDeviceData, deviceData } = await getDeviceStateWithImage(Number($currentDeviceID)));
            }, 3000);
            nodesConfigRetrier = new MethodRetrier(async (signal) => {
                ({ initialNodes, nodes } = await getDeviceNodesConfig(Number($currentDeviceID)));
                setTimeout(() => {
                    nodesInit = true;
                }, 100); // Small timeout to give a bit of time for the page to load before the nodes
            }, 3000);
        } else {
            showToast("errorEditDeviceParams", ToastType.ALERT);
            loadedDone.set(true);
        }

        //Clean-up logic
        return () => {
            deviceDataRetrier?.stop();
            nodesConfigRetrier?.stop();
            deviceDataRetrier = null;
            nodesConfigRetrier = null;
        };
    });
</script>

<!-- Edit Device Page: displays the selected device's details and configuration options, including editable fields for device name, image, communication settings, and meter options. 
Shows input forms for protocol-specific parameters and organizes device nodes for editing. Includes action buttons for saving, canceling, and deleting the device. -->
<div class="content" in:fade={{ duration: 300 }}>
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
                    <h3>{$texts.deviceCommunication}</h3>
                    <span>{$texts.deviceCommunicationSub}</span>
                </div>

                <div class="device-input-div">
                    <span>{$texts.communicationProtocol}</span>
                    <div class="input-div">
                        <Selector
                            options={$protocolTexts}
                            bind:selectedOption={deviceData.protocol}
                            inputInvalid={!deviceData.validation.deviceProtocol}
                            enableInputInvalid={true}
                            onChange={() => {
                                deviceProtocolChange(deviceData, nodes);
                            }}
                            scrollable={true}
                        />
                        <div class="info-div">
                            <HintInfo>
                                <span class="info-text">{$texts.communicationProtocolInfo}</span>
                            </HintInfo>
                        </div>
                    </div>
                </div>
                <svelte:component this={$protocolPlugins[deviceData.protocol].ConfigComponent} bind:configuration={deviceData.communication_options} />
            </div>
            <div class="device-section-div">
                <div class="title">
                    <h3>{$texts.deviceOptions}</h3>
                    <span>{$texts.deviceOptionsSub}</span>
                </div>
                <MeterOptionsConfig bind:deviceData bind:nodes bind:meterOptionsValid={deviceData.validation.meterOptions} />
            </div>
            <div class="device-section-div">
                <div class="title">
                    <h3>{$texts.deviceNodes}</h3>
                    <span>{$texts.deviceNodesSub}</span>
                </div>
                <div class="nodes-grid-div">
                    <NodesGrid
                        minHeight="200px"
                        {deviceData}
                        {nodesInit}
                        bind:nodes
                        bind:nodesBySection
                        onPropertyChanged={(node: EditableNodeRecord) => {
                            nodes = updateNodes(node, nodes);
                            editingNode = updateEditingNode(node, editingNode, nodes);
                        }}
                        onShowConfigPopup={(node: EditableNodeRecord, nodeEditingState: NodeRecordEditingState) => {
                            editingNode = node;
                            editingNodeState = nodeEditingState;
                            showConfigNodeWindow = true;
                        }}
                    />
                </div>
            </div>
            <!----------     A C T I O N     B U T T O N S     ---------->
            <div class="action-buttons-div">
                <Button
                    buttonText={$texts.cancel}
                    imageURL="/img/previous.svg"
                    onClick={async () => {
                        if (noChangesToDevice(initialDeviceData, deviceData, initialNodes, nodes)) {
                            await navigateTo("/devices");
                            return;
                        }
                        showCancelWindow = true;
                    }}
                />
                <Button
                    enabled={contentInit}
                    buttonText={$texts.save}
                    style={$PrimaryButtonStyle}
                    imageURL="/img/save.svg"
                    onClick={async () => {
                        if (validDeviceOperation(deviceData)) {
                            if (noChangesToDevice(initialDeviceData, deviceData, initialNodes, nodes)) {
                                showToast("noChangesToDevice", ToastType.INFO);
                                return;
                            }
                            showSaveWindow = true;
                        }
                    }}
                />
                <Button
                    enabled={contentInit}
                    buttonText={$texts.delete}
                    style={$DangerButtonStyle}
                    imageURL="/img/delete.svg"
                    onClick={async () => {
                        showDeleteWindow = true;
                    }}
                />
            </div>
        </div>
        <!----------     P O P U P     W I N D O W S     ---------->
        <PopupNodeConfig
            bind:windowOpened={showConfigNodeWindow}
            onPropertyChanged={() => {
                nodes = updateNodes(editingNode, nodes);
                editingNode = updateEditingNode(editingNode, editingNode, nodes);
            }}
            {deviceData}
            node={editingNode}
            bind:nodeEditingState={editingNodeState}
        />
        <PopupSaveDevice
            bind:windowOpened={showSaveWindow}
            processingRequest={performingSaveRequest}
            onSave={async () => {
                if (validDeviceOperation(deviceData)) {
                    if (noChangesToDevice(initialDeviceData, deviceData, initialNodes, nodes)) {
                        showToast("noChangesToDevice", ToastType.INFO);
                        return;
                    }
                    performingSaveRequest = true;
                    await editDevice(convertToDevice(deviceData), deviceData.device_image, convertToNodes(nodes));
                    performingSaveRequest = false;
                }
            }}
        />
        <PopupDeleteDevice
            deviceName={deviceData.name}
            bind:windowOpened={showDeleteWindow}
            processingRequest={performingDeleteRequest}
            onDelete={async () => {
                if (contentInit) {
                    performingDeleteRequest = true;
                    await deleteDevice(deviceData.name, deviceData.id);
                    performingDeleteRequest = false;
                }
            }}
        />
        <PopupCancelDeviceEdit
            bind:windowOpened={showCancelWindow}
            onCancelEdit={async () => {
                await navigateTo("/devices");
            }}
        />
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
