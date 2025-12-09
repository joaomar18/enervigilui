<script lang="ts">
    import { validateOpcUaNodeId } from "$lib/logic/validation/nodes/protocol/opcUa";
    import InfoLabel from "../../../../General/InfoLabel.svelte";
    import InputField from "../../../../General/InputField.svelte";
    import Selector from "../../../../General/Selector.svelte";
    import type { EditableNodeRecord } from "$lib/types/nodes/config";
    import type { ProtocolPlugin } from "$lib/stores/device/protocol";
    import type { EditableOPCUANodeOptions } from "$lib/types/nodes/protocol/opcUa";

    // Texts
    import { pluginTexts } from "$lib/stores/lang/protocolPlugin";
    import { opcUaNodeTypeTexts } from "$lib/stores/lang/opcUaTexts";

    // Styles
    import { NodeConfigSheetInfoLabelStyle } from "$lib/style/nodes";
    import { NodeConfigSheetInputFieldStyle, NodeConfigSheetSelectorStyle } from "$lib/style/nodes";

    // Props
    export let node: EditableNodeRecord;
    export let protocolPlugin: ProtocolPlugin;
    export let textKey: string;
    export let infoTextKey: string;
    export let typeKey: string;
    export let infoTypeKey: string;
    export let disableAnimations: boolean = false;

    // Variables
    let commOptions: EditableOPCUANodeOptions;
    let validOpcUaId: boolean = false;

    // Reactive Statements
    $: commOptions = node?.protocol_options as EditableOPCUANodeOptions;
    $: validOpcUaId = validateOpcUaNodeId(commOptions.node_id);

    // Export Functions
    export let onPropertyChanged: () => void;
</script>

<div class="row col-align">
    <div class="label-wrapper extend-width">
        <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$pluginTexts[textKey]} toolTipText={$pluginTexts[infoTextKey]} />
    </div>
    <span class="value extend-width">
        <InputField
            style={$NodeConfigSheetInputFieldStyle}
            disabled={node.config.calculated}
            bind:inputValue={commOptions.node_id}
            inputInvalid={!validOpcUaId}
            enableInputInvalid={true}
            onChange={() => {
                onPropertyChanged();
            }}
            inputType="STRING"
            width="100%"
            disableHints={true}
            {disableAnimations}
        />
    </span>
</div>
<div class="row col-align">
    <div class="label-wrapper extend-width">
        <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$pluginTexts[typeKey]} toolTipText={$pluginTexts[infoTypeKey]} />
    </div>
    <span class="value extend-width">
        <Selector
            style={$NodeConfigSheetSelectorStyle}
            options={$opcUaNodeTypeTexts}
            bind:selectedOption={commOptions.type}
            onChange={() => {
                onPropertyChanged();
                protocolPlugin.setProtocolType(commOptions, commOptions.type);
                node.is_numeric = protocolPlugin.isNumeric(node.protocol_options);
            }}
            inputInvalid={!node.validation.variableType}
            enableInputInvalid={true}
            scrollable={true}
        />
    </span>
</div>

<style>
    /* Generic row: label + value horizontal layout */
    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        inline-size: 100%;
        margin: 0;
        padding: 0;
        gap: var(--content-col-gap);
        block-size: var(--content-row-height);
    }

    /* Column-aligned row: used for stacked fields (label above value) */
    .row.col-align {
        flex-direction: column;
        align-items: center;
        justify-content: start;
        width: 100%;
    }

    /* Label wrapper: flexible container for InfoLabel components */
    .label-wrapper {
        margin: 0;
        padding: 0;
        flex: 1;
        display: flex;
        justify-content: start;
        align-items: center;
    }

    /* Extended label wrapper: forces full-width alignment in column rows */
    .label-wrapper.extend-width {
        flex: 0;
        width: 100%;
    }

    /* Value container: right-aligned by default, horizontal layout for inputs */
    .value {
        flex: 1;
        text-align: right;
        display: inline-flex;
        justify-content: end;
        align-items: center;
        white-space: nowrap;
        line-height: 1;
        block-size: 100%;
    }

    /* Full-width value container: used for multi-input rows (input + checkbox) */
    .value.extend-width {
        flex: 0;
        width: 100%;
        justify-content: space-between;
        gap: 15px;
    }
</style>
