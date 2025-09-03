<script lang="ts">
    import { onMount } from "svelte";
    import { getDefaultImage, addDevice } from "$lib/logic/api/device";
    import { createNewDevice, convertToDevice } from "$lib/logic/factory/device";
    import { convertToNodes, getDefaultNodesList } from "$lib/logic/factory/nodes";
    import { updateDeviceValidation, validDeviceOperation } from "$lib/logic/validation/device/base";
    import { updateNodesValidation } from "$lib/logic/validation/nodes/base";
    import Selector from "../../../components/General/Selector.svelte";
    import HintInfo from "../../../components/General/HintInfo.svelte";
    import EditableText from "../../../components/General/EditableText.svelte";
    import UploadImage from "../../../components/General/UploadImage.svelte";
    import Button from "../../../components/General/Button.svelte";
    import NodesGrid from "../../../components/Devices/Nodes/NodesGrid.svelte";
    import PopupNodeConfig from "../../../components/Devices/Nodes/PopupNodeConfig.svelte";
    import PopupAddDevice from "../../../components/Devices/PopupAddDevice.svelte";
    import MeterOptionsConfig from "../../../components/Devices/MeterOptionsConfig.svelte";
    import { defaultDeviceOptions } from "$lib/types/device/base";
    import { protocolPlugins } from "$lib/stores/device/protocol";
    import { MethodRetrier } from "$lib/logic/api/retrier";
    import { deviceProtocolChange } from "$lib/logic/handlers/device";
    import { updateNodes, updateEditingNode, updateNodesBySection } from "$lib/logic/handlers/nodes";

    // Types
    import type { NewDeviceMeter } from "$lib/types/device/base";
    import type { EditableDeviceNode, NodeEditState, NodePhase } from "$lib/types/nodes/base";

    // Styles
    import { SucessButtonStyle } from "$lib/style/button";

    // Navigation
    import { navigateTo } from "$lib/logic/view/navigation";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { selectedLang } from "$lib/stores/lang/definition";
    import { protocolTexts } from "$lib/stores/lang/energyMeterTexts";

    // Stores
    import { loadedDone } from "$lib/stores/view/navigation";

    // Variables
    let showAddWindow: boolean = false; // Show Add Device Window
    let showConfigNodeWindow: boolean = false; // Show Node Full Configuration Window
    let performingAddRequest: boolean = false; // Performing Add Device Request
    let deviceData: NewDeviceMeter; // Device Data
    let nodes: Array<EditableDeviceNode>;
    let nodesBySection: Record<NodePhase, Array<EditableDeviceNode>>;
    let editingNode: EditableDeviceNode; // Current Node being edited in Configuration Window
    let editingNodeState: NodeEditState; // Current state of the Node being edited
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
        deviceData = createNewDevice(defaultDeviceOptions.protocol, defaultDeviceOptions.type, defaultDeviceOptions.options);
        nodes = getDefaultNodesList(deviceData);
        nodesInit = true;

        let defaultImageRetrier: MethodRetrier | null = new MethodRetrier(async (signal) => {
            deviceData.current_image_url = await getDefaultImage();
        }, 3000);

        //Clean-up logic
        return () => {
            defaultImageRetrier?.stop();
            defaultImageRetrier = null;
        };
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
                    placeHolder={$texts.deviceName}
                    allwaysEnabled={true}
                    enableTextInvalid={true}
                    textInvalid={!deviceData.validation.deviceName}
                    minWidth="250px"
                    maxWidth="500px"
                />
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
                        onPropertyChanged={(node: EditableDeviceNode) => {
                            nodes = updateNodes(node, nodes);
                            editingNode = updateEditingNode(node, editingNode, nodes);
                        }}
                        onShowConfigPopup={(node: EditableDeviceNode, nodeEditingState: NodeEditState) => {
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
                    imageURL="/img/previous.png"
                    onClick={async () => {
                        await navigateTo("/devices", $selectedLang, {});
                    }}
                />
                <Button
                    enabled={contentInit}
                    buttonText={$texts.add}
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
        <PopupNodeConfig
            bind:windowOpened={showConfigNodeWindow}
            onPropertyChanged={() => {
                nodes = updateNodes(editingNode, nodes);
            }}
            {deviceData}
            node={editingNode}
            bind:nodeEditingState={editingNodeState}
        />
        <PopupAddDevice
            bind:windowOpened={showAddWindow}
            processingRequest={performingAddRequest}
            onAdd={async () => {
                if (contentInit) {
                    performingAddRequest = true;
                    await addDevice(convertToDevice(deviceData), deviceData.device_image, convertToNodes(nodes));
                    performingAddRequest = false;
                }
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
