<script lang="ts">
    import RightPanelSheet from "../../General/RightPanelSheet.svelte";
    import InputField from "../../General/InputField.svelte";
    import Selector from "../../General/Selector.svelte";
    import { nodeNameChange, communicationIDChange, nodeTypeChange } from "$lib/logic/handlers/nodes";
    import { NodeType } from "$lib/types/nodes/base";
    import { showToast } from "$lib/logic/view/toast";
    import { AlertType } from "$lib/stores/view/toast";
    import { DECIMAL_PLACES_LIM, LOGGING_PERIOD_LIM } from "$lib/types/nodes/config";
    import { protocolPlugins } from "$lib/stores/device/protocol";
    import type { EditableDevice, NewDevice } from "$lib/types/device/base";
    import type { EditableNodeRecord, NodeRecordEditingState } from "$lib/types/nodes/config";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { pluginTexts } from "$lib/stores/lang/protocolPlugin";
    import { variableNameTextsByPhase } from "$lib/stores/lang/energyMeterTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { NodeConfigSheetStyle } from "$lib/style/nodes";
    import { NodeConfigSheetSelectorStyle } from "$lib/style/nodes";
    import { NodeConfigSheetInputFieldStyle } from "$lib/style/nodes";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $NodeConfigSheetStyle;

    // Props
    export let showPanel: boolean;
    export let deviceData: EditableDevice | NewDevice;
    export let node: EditableNodeRecord;
    export let nodeEditingState: NodeRecordEditingState;

    // Layout / styling props
    export let titleSize: string | undefined = undefined;
    export let titleColor: string | undefined = undefined;
    export let titleWeight: string | undefined = undefined;
    export let titleItemGap: string | undefined = undefined;
    export let titleImageWidth: string | undefined = undefined;
    export let titleImageHeight: string | undefined = undefined;
    export let headerRowHeigth: string | undefined = undefined;
    export let headerRowGap: string | undefined = undefined;
    export let headerColGap: string | undefined = undefined;
    export let headerLabelWidth: string | undefined = undefined;
    export let headerLabelSize: string | undefined = undefined;
    export let headerLabelColor: string | undefined = undefined;
    export let headerLabelWeight: string | undefined = undefined;
    export let headerValueSize: string | undefined = undefined;
    export let headerValueColor: string | undefined = undefined;
    export let headerValueWeight: string | undefined = undefined;
    export let contentTitleSize: string | undefined = undefined;
    export let contentTitleColor: string | undefined = undefined;
    export let contentTitleWeight: string | undefined = undefined;
    export let contentTitlePaddingLeft: string | undefined = undefined;
    export let contentTitlePaddingBottom: string | undefined = undefined;
    export let contentTitleBorderBottom: string | undefined = undefined;
    export let contentTitleSpacing: string | undefined = undefined;
    export let contentTitleTransform: string | undefined = undefined;
    export let contentInnerPaddingTop: string | undefined = undefined;
    export let contentInnerPaddingBottom: string | undefined = undefined;
    export let contentInnerPaddingHorizontal: string | undefined = undefined;
    export let contentRowHeight: string | undefined = undefined;
    export let contentRowGap: string | undefined = undefined;
    export let contentColGap: string | undefined = undefined;
    export let contentLabelWidth: string | undefined = undefined;
    export let contentLabelSize: string | undefined = undefined;
    export let contentLabelColor: string | undefined = undefined;
    export let contentLabelWeight: string | undefined = undefined;
    export let contentValueSize: string | undefined = undefined;
    export let contentValueColor: string | undefined = undefined;
    export let contentValueWeight: string | undefined = undefined;

    $: localOverrides = {
        titleSize,
        titleColor,
        titleWeight,
        titleItemGap,
        titleImageWidth,
        titleImageHeight,
        headerRowHeigth,
        headerRowGap,
        headerColGap,
        headerLabelWidth,
        headerLabelSize,
        headerLabelColor,
        headerLabelWeight,
        headerValueSize,
        headerValueColor,
        headerValueWeight,
        contentTitleSize,
        contentTitleColor,
        contentTitleWeight,
        contentTitlePaddingLeft,
        contentTitlePaddingBottom,
        contentTitleBorderBottom,
        contentTitleSpacing,
        contentTitleTransform,
        contentInnerPaddingTop,
        contentInnerPaddingBottom,
        contentInnerPaddingHorizontal,
        contentRowHeight,
        contentRowGap,
        contentColGap,
        contentLabelWidth,
        contentLabelSize,
        contentLabelColor,
        contentLabelWeight,
        contentValueSize,
        contentValueColor,
        contentValueWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Export Functions
    export let onPropertyChanged: () => void;
</script>

<div
    class="variable-config-panel"
    style="
            --title-size: {mergedStyle.titleSize};
            --title-color: {mergedStyle.titleColor};
            --title-weight: {mergedStyle.titleWeight};
            --title-item-gap: {mergedStyle.titleItemGap};
            --title-image-width: {mergedStyle.titleImageWidth};
            --title-image-height: {mergedStyle.titleImageHeight};
            --header-row-height: {mergedStyle.headerRowHeigth};
            --header-row-gap: {mergedStyle.headerRowGap};
            --header-col-gap: {mergedStyle.headerColGap};
            --header-label-width: {mergedStyle.headerLabelWidth};
            --header-label-size: {mergedStyle.headerLabelSize};
            --header-label-color: {mergedStyle.headerLabelColor};
            --header-label-weight: {mergedStyle.headerLabelWeight};
            --header-value-size: {mergedStyle.headerValueSize};
            --header-value-color: {mergedStyle.headerValueColor};
            --header-value-weight: {mergedStyle.headerValueWeight};
            --content-title-size: {mergedStyle.contentTitleSize};
            --content-title-color: {mergedStyle.contentTitleColor};
            --content-title-weight: {mergedStyle.contentTitleWeight};
            --content-title-padding-left: {mergedStyle.contentTitlePaddingLeft};
            --content-title-padding-bottom: {mergedStyle.contentTitlePaddingBottom};
            --content-title-border-bottom: {mergedStyle.contentTitleBorderBottom};
            --content-title-spacing: {mergedStyle.contentTitleSpacing};
            --content-title-transform: {mergedStyle.contentTitleTransform};
            --content-inner-padding-top: {mergedStyle.contentInnerPaddingTop};
            --content-inner-padding-bottom: {mergedStyle.contentInnerPaddingBottom};
            --content-inner-padding-horizontal: {mergedStyle.contentInnerPaddingHorizontal};
            --content-row-height: {mergedStyle.contentRowHeight};
            --content-row-gap: {mergedStyle.contentRowGap};
            --content-col-gap: {mergedStyle.contentColGap};
            --content-label-width: {mergedStyle.contentLabelWidth};
            --content-label-size: {mergedStyle.contentLabelSize};
            --content-label-color: {mergedStyle.contentLabelColor};
            --content-label-weight: {mergedStyle.contentLabelWeight};
            --content-value-size: {mergedStyle.contentValueSize};
            --content-value-color: {mergedStyle.contentValueColor};
            --content-value-weight: {mergedStyle.contentValueWeight};
        "
>
    <RightPanelSheet bind:showPanel>
        <header slot="title" class="title-div">
            <img src="/img/edit_pencil.svg" alt="Estado da variável" />
            <h3>{$texts.variableConfig}</h3>
        </header>
        <section slot="header" class="header-div" aria-labelledby="hdr-title">
            {#if node}
                <div class="row col-dir">
                    <span class="label">{$texts.variable}</span>
                    <span class="value">
                        {#if !node.config.custom}
                            <Selector
                                style={$NodeConfigSheetSelectorStyle}
                                options={$variableNameTextsByPhase[node.attributes.phase]}
                                bind:selectedOption={node.display_name}
                                onChange={() => {
                                    nodeNameChange(node, node.attributes.phase);
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.variableName}
                                enableInputInvalid={true}
                                scrollable={true}
                                width="100%"
                            />
                        {:else}
                            <InputField
                                style={$NodeConfigSheetInputFieldStyle}
                                bind:inputValue={node.display_name}
                                onChange={() => {
                                    nodeNameChange(node, node.attributes.phase);
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.variableName}
                                enableInputInvalid={true}
                                inputType="STRING"
                                width="100%"
                            />
                        {/if}</span
                    >
                </div>
                <div class="row">
                    <span class="label">{$texts.section}</span>
                    <span class="value">{$texts[node.attributes.phase.toLocaleLowerCase()]}</span>
                </div>
                <div class="row">
                    <span class="label">{$texts.protocol}</span>
                    <span class="value">{node.protocol}</span>
                </div>
            {/if}
        </section>

        <main slot="content" class="content-div">
            {#if node}
                <div class="inner-content-div">
                    {#if node.config.type === NodeType.FLOAT}
                        <div class="row col-align">
                            <span class="label">{$texts.decimalPlaces}</span>
                            <span class="value extend-width">
                                <InputField
                                    style={$NodeConfigSheetInputFieldStyle}
                                    bind:inputValue={node.config.decimal_places}
                                    onChange={() => {
                                        onPropertyChanged();
                                    }}
                                    inputInvalid={!node.validation.decimalPlaces}
                                    enableInputInvalid={true}
                                    inputType="POSITIVE_INT"
                                    minValue={DECIMAL_PLACES_LIM.MIN}
                                    maxValue={DECIMAL_PLACES_LIM.MAX}
                                    limitsPassed={() => {
                                        showToast("decimalPlacesError", AlertType.ALERT, {
                                            minValue: DECIMAL_PLACES_LIM.MIN,
                                            maxValue: DECIMAL_PLACES_LIM.MAX,
                                        });
                                    }}
                                    width="100%"
                                />
                            </span>
                        </div>
                    {/if}
                    <div class="row col-align">
                        <span class="label">{$pluginTexts[$protocolPlugins[deviceData.protocol].textKey]}</span>
                        <span class="value extend-width">
                            <InputField
                                style={$NodeConfigSheetInputFieldStyle}
                                disabled={node.config.calculated}
                                bind:inputValue={node.communication_id}
                                onChange={() => {
                                    communicationIDChange(node);
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.communicationID}
                                enableInputInvalid={true}
                                inputType="STRING"
                                width="100%"
                            />
                        </span>
                    </div>
                    <div class="row col-align">
                        <span class="label">{$texts.type}</span>
                        <span class="value extend-width">
                            <Selector
                                style={$NodeConfigSheetSelectorStyle}
                                options={Object.fromEntries(Object.entries(NodeType).map(([key, value]) => [value, value]))}
                                bind:selectedOption={node.config.type}
                                onChange={() => {
                                    nodeTypeChange(node, nodeEditingState);
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.variableType}
                                enableInputInvalid={true}
                                scrollable={true}
                                width="100%"
                            />
                        </span>
                    </div>
                </div>
            {/if}
        </main>
    </RightPanelSheet>
</div>

<style>
    .title-div {
        display: flex;
        flex-direction: row;
        justify-content: start;
        gap: var(--title-item-gap);
        align-items: center;
        inline-size: 100%;
        block-size: 100%;
        margin: 0;
        padding: 0;
    }

    .title-div img {
        inline-size: var(--title-image-width);
        block-size: var(--title-image-height);
    }

    .title-div h3 {
        flex: 1;
        min-inline-size: 0;
        margin: 0;
        padding: 0;
        font-size: var(--title-size);
        color: var(--title-color);
        font-weight: var(--title-weight);
        line-height: var(--title-image-height);
    }

    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        inline-size: 100%;
        margin: 0;
        padding: 0;
    }

    .row.col-align {
        flex-direction: column;
        align-items: center;
        justify-content: start;
        width: 100%;
    }

    .row.fit-height {
        block-size: auto;
    }

    .label {
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        line-height: 1;
        block-size: 100%;
    }

    .label.align-center {
        justify-content: center;
    }

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

    .row.col-align .value {
        flex: 0;
    }

    .value.extend-width {
        width: 100%;
    }

    .header-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--header-row-gap);
        inline-size: 100%;
        margin: 0;
        padding: 0;
    }

    .header-div .row {
        gap: var(--header-col-gap);
        block-size: var(--header-row-height);
    }

    .header-div .label {
        inline-size: var(--header-label-width);
        min-inline-size: var(--header-label-width);
        font-size: var(--header-label-size);
        color: var(--header-label-color);
        font-weight: var(--header-label-weight);
    }

    .header-div .value {
        font-size: var(--header-value-size);
        color: var(--header-value-color);
        font-weight: var(--header-value-weight);
    }

    .content-div {
        inline-size: 100%;
        margin: 0;
        padding: 0;
    }

    .content-div .section-title {
        margin: 0;
        padding: 0;
        border-bottom: var(--content-title-border-bottom);
    }

    .content-div .section-title h3 {
        margin: 0;
        padding: 0 var(--content-title-padding-left) var(--content-title-padding-bottom) var(--content-title-padding-left);
        font-size: var(--content-title-size);
        color: var(--content-title-color);
        font-weight: var(--content-title-weight);
        text-transform: var(--content-title-transform);
        letter-spacing: var(--content-title-spacing);
    }

    .inner-content-div {
        box-sizing: border-box;
        position: relative;
        inline-size: 100%;
        margin: 0;
        padding: var(--content-inner-padding-top) var(--content-inner-padding-horizontal) var(--content-inner-padding-bottom);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--content-row-gap);
    }

    .inner-content-div.no-horizontal-padding {
        padding-left: 0;
        padding-right: 0;
    }

    .content-div .inner-content-div .row {
        gap: var(--content-col-gap);
        block-size: var(--content-row-height);
    }

    .content-div .inner-content-div .label {
        inline-size: var(--content-label-width);
        min-inline-size: var(--content-label-width);
        font-size: var(--content-label-size);
        color: var(--content-label-color);
        font-weight: var(--content-label-weight);
    }

    .content-div .inner-content-div .label.fit-content {
        min-inline-size: 0;
        width: fit-content;
        padding-right: 30px;
    }

    .content-div .inner-content-div .value {
        font-size: var(--content-value-size);
        color: var(--content-value-color);
        font-weight: var(--content-value-weight);
    }
</style>
