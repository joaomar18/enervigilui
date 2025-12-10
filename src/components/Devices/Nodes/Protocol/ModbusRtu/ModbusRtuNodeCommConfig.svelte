<script lang="ts">
    import InfoLabel from "../../../../General/InfoLabel.svelte";
    import InputField from "../../../../General/InputField.svelte";
    import Selector from "../../../../General/Selector.svelte";
    import type { EditableNodeRecord } from "$lib/types/nodes/config";
    import type { ProtocolPlugin } from "$lib/stores/device/protocol";
    import { ModbusRTUFunction, ModbusRTUNodeMode, ModbusRTUNodeType, type EditableModbusRTUNodeOptions } from "$lib/types/nodes/protocol/modbusRtu";
    import {
        validateModbusFunction,
        validateModbusAddress,
        validateModbusBitIndex,
        validateModbusEndianMode,
    } from "$lib/logic/validation/nodes/protocol/modbusRtu";
    import { multiregisterTypes } from "$lib/types/nodes/protocol/modbusRtu";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { pluginTexts } from "$lib/stores/lang/protocolPlugin";
    import { modbusNodeTypeTexts, modbusNodeFunctionTexts, modbusNodeEndianModeTexts } from "$lib/stores/lang/modbusRtuTexts";

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
    let firstValidationDone: boolean = false;
    let commOptions: EditableModbusRTUNodeOptions;
    let validFunction: boolean = false;
    let validAddress: boolean = false;
    let validBitIndex: boolean = false;
    let validEndianMode: boolean = false;
    let enableBit: boolean = false;
    let enableEndianMode: boolean = false;

    // Reactive Statements
    $: enableBit =
        commOptions.type === ModbusRTUNodeType.BOOL &&
        commOptions.function != ModbusRTUFunction.READ_COILS &&
        commOptions.function !== ModbusRTUFunction.READ_DISCRETE_INPUTS;
    $: if (!enableBit) {
        commOptions.bit = null;
    } else {
        commOptions.bit = "";
    }

    $: enableEndianMode = multiregisterTypes.includes(commOptions.type);
    $: if (!enableEndianMode) {
        commOptions.endian_mode = null;
    } else {
        commOptions.endian_mode = ModbusRTUNodeMode.BIG_ENDIAN;
    }

    $: commOptions = node?.protocol_options as EditableModbusRTUNodeOptions;
    $: if (node && !firstValidationDone) firstValidation();
    $: if (!node) firstValidationDone = false;

    // Export Functions
    export let onPropertyChanged: () => void;

    // Functions
    function firstValidation(): void {
        validFunction = validateModbusFunction(commOptions.function, commOptions.type);
        validAddress = validateModbusAddress(commOptions.address);
        validBitIndex = validateModbusBitIndex(commOptions.type, commOptions.bit);
        validEndianMode = validateModbusEndianMode(commOptions.type, commOptions.endian_mode);
        firstValidationDone = true;
    }
</script>

<div class="row col-align">
    <div class="label-wrapper extend-width">
        <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.functionCode} toolTipText={$texts.functionCodeInfo} />
    </div>
    <span class="value extend-width">
        <Selector
            style={$NodeConfigSheetSelectorStyle}
            options={$modbusNodeFunctionTexts}
            bind:selectedOption={commOptions.function}
            onChange={() => {
                validFunction = validateModbusFunction(commOptions.function, commOptions.type);
                onPropertyChanged();
            }}
            inputInvalid={!validFunction}
            enableInputInvalid={true}
            scrollable={true}
        />
    </span>
</div>
<div class="row col-align">
    <div class="label-wrapper extend-width">
        <InfoLabel
            style={$NodeConfigSheetInfoLabelStyle}
            labelText={enableBit ? $pluginTexts.modbusAdressBit : $pluginTexts[textKey]}
            toolTipText={enableBit ? $pluginTexts.modbusAddressBitInfo : $pluginTexts[infoTextKey]}
        />
    </div>
    <span class="value extend-width">
        <InputField
            style={$NodeConfigSheetInputFieldStyle}
            disabled={node.config.calculated}
            bind:inputValue={commOptions.address}
            inputInvalid={!validAddress}
            enableInputInvalid={true}
            onChange={() => {
                validAddress = validateModbusAddress(commOptions.address);
                onPropertyChanged();
            }}
            inputType="STRING"
            width="100%"
            disableHints={true}
            {disableAnimations}
        />

        {#if enableBit && commOptions.bit !== null}
            <span class="label">/</span>
            <InputField
                style={$NodeConfigSheetInputFieldStyle}
                disabled={node.config.calculated}
                bind:inputValue={commOptions.bit}
                inputInvalid={!validBitIndex}
                enableInputInvalid={true}
                onChange={() => {
                    validBitIndex = validateModbusBitIndex(commOptions.type, commOptions.bit);
                    onPropertyChanged();
                }}
                minValue={0}
                maxValue={15}
                inputType="POSITIVE_INT"
                width="75px"
                disableHints={true}
                {disableAnimations}
            />
        {/if}
    </span>
</div>
<div class="row col-align">
    <div class="label-wrapper extend-width">
        <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$pluginTexts[typeKey]} toolTipText={$pluginTexts[infoTypeKey]} />
    </div>
    <span class="value extend-width">
        <Selector
            style={$NodeConfigSheetSelectorStyle}
            options={$modbusNodeTypeTexts}
            bind:selectedOption={commOptions.type}
            onChange={() => {
                validFunction = validateModbusFunction(commOptions.function, commOptions.type);
                validBitIndex = validateModbusBitIndex(commOptions.type, commOptions.bit);
                validEndianMode = validateModbusEndianMode(commOptions.type, commOptions.endian_mode);
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
{#if enableEndianMode && commOptions.endian_mode !== null}
    <div class="row col-align">
        <div class="label-wrapper extend-width">
            <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.byteOrder} toolTipText={$texts.byteOrderInfo} />
        </div>
        <span class="value extend-width">
            <Selector
                style={$NodeConfigSheetSelectorStyle}
                options={$modbusNodeEndianModeTexts}
                bind:selectedOption={commOptions.endian_mode}
                onChange={() => {
                    validEndianMode = validateModbusEndianMode(commOptions.type, commOptions.endian_mode);
                    onPropertyChanged();
                }}
                inputInvalid={!validEndianMode}
                enableInputInvalid={true}
                scrollable={true}
            />
        </span>
    </div>
{/if}

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

    /* Label text styling */
    .label {
        color: var(--content-label-color);
        font-weight: var(--content-label-weight);
        font-size: var(--content-label-size);
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
