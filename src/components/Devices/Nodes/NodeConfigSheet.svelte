<script lang="ts">
    import RightPanelSheet from "../../General/RightPanelSheet.svelte";
    import InputField from "../../General/InputField.svelte";
    import Selector from "../../General/Selector.svelte";
    import Checkbox from "../../General/Checkbox.svelte";
    import InfoLabel from "../../General/InfoLabel.svelte";
    import { nodeNameChange, communicationIDChange, nodeTypeChange, customNodeChange, virtualNodeChange } from "$lib/logic/handlers/nodes";
    import { CounterMode, NodeType } from "$lib/types/nodes/base";
    import { showToast } from "$lib/logic/view/toast";
    import { AlertType } from "$lib/stores/view/toast";
    import { DECIMAL_PLACES_LIM, LOGGING_PERIOD_LIM } from "$lib/types/nodes/config";
    import { protocolPlugins } from "$lib/stores/device/protocol";
    import { defaultVariableUnits } from "$lib/stores/device/variables";
    import type { EditableDevice, NewDevice } from "$lib/types/device/base";
    import type { EditableNodeRecord, NodeRecordEditingState } from "$lib/types/nodes/config";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { pluginTexts } from "$lib/stores/lang/protocolPlugin";
    import { counterModeTexts } from "$lib/stores/lang/energyMeterTexts";
    import { variableNameTextsByPhase } from "$lib/stores/lang/energyMeterTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { NodeConfigSheetStyle } from "$lib/style/nodes";
    import { NodeConfigSheetSelectorStyle } from "$lib/style/nodes";
    import { NodeConfigSheetInputFieldStyle } from "$lib/style/nodes";
    import { NodeConfigSheetInfoLabelStyle } from "$lib/style/nodes";

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
        contentValueSize,
        contentValueColor,
        contentValueWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Export Functions
    export let onPropertyChanged: () => void;
</script>

<!-- NodeConfigSheet Component: renders a slide-in right panel for configuring an energy meter node.
Provides editable fields for variable name, unit, communication ID, type, logging settings, alarms,
incremental logic, virtual node settings, and enable/disable status. -->
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
                    <div class="row col-align">
                        <div class="label-wrapper extend-width">
                            <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.unit} toolTipText={$texts.unitInfo} />
                        </div>
                        <span class="value extend-width">
                            {#if !node.config.custom}
                                <Selector
                                    style={$NodeConfigSheetSelectorStyle}
                                    options={Object.fromEntries($defaultVariableUnits[node.display_name]?.map((unit) => [unit, unit]) || [])}
                                    bind:selectedOption={node.config.unit}
                                    onChange={() => {
                                        onPropertyChanged();
                                    }}
                                    disabled={node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN}
                                    inputInvalid={!node.validation.variableUnit}
                                    enableInputInvalid={true}
                                    scrollable={true}
                                    width="100%"
                                />
                            {:else}
                                <InputField
                                    style={$NodeConfigSheetInputFieldStyle}
                                    bind:inputValue={node.config.unit}
                                    onChange={() => {
                                        onPropertyChanged();
                                    }}
                                    disabled={node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN}
                                    inputInvalid={!node.validation.variableUnit}
                                    enableInputInvalid={true}
                                    inputType="STRING"
                                    width="100%"
                                />
                            {/if}
                        </span>
                    </div>
                    {#if node.config.type === NodeType.FLOAT}
                        <div class="row col-align">
                            <div class="label-wrapper extend-width">
                                <InfoLabel
                                    style={$NodeConfigSheetInfoLabelStyle}
                                    labelText={$texts.decimalPlaces}
                                    toolTipText={$texts.decimalPlacesInfo}
                                />
                            </div>
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
                        <div class="label-wrapper extend-width">
                            <InfoLabel
                                style={$NodeConfigSheetInfoLabelStyle}
                                labelText={$pluginTexts[$protocolPlugins[deviceData.protocol].textKey]}
                                toolTipText={$pluginTexts[$protocolPlugins[deviceData.protocol].infoTextKey]}
                            />
                        </div>
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
                        <div class="label-wrapper extend-width">
                            <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.type} toolTipText={$texts.typeInfo} />
                        </div>
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

                    <div class="row col-align">
                        <div class="label-wrapper extend-width">
                            <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.loggingPeriod} toolTipText={$texts.loggingInfo} />
                        </div>
                        <span class="value extend-width">
                            <InputField
                                style={$NodeConfigSheetInputFieldStyle}
                                disabled={!node.config.logging}
                                bind:inputValue={node.config.logging_period}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.loggingPeriod}
                                enableInputInvalid={true}
                                inputType="POSITIVE_INT"
                                minValue={LOGGING_PERIOD_LIM.MIN}
                                maxValue={LOGGING_PERIOD_LIM.MAX}
                                limitsPassed={() => {
                                    showToast("loggingPeriodError", AlertType.ALERT, {
                                        minValue: LOGGING_PERIOD_LIM.MIN,
                                        maxValue: LOGGING_PERIOD_LIM.MAX,
                                    });
                                }}
                                inputUnit="min."
                                width="100%"
                            />
                            <Checkbox
                                bind:checked={node.config.logging}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.loggingPeriod}
                                enableInputInvalid={true}
                                inputName="log-node"
                                width="38px"
                                height="38px"
                            />
                        </span>
                    </div>

                    {#if node.config.type === NodeType.FLOAT || node.config.type == NodeType.INT}
                        <div class="row col-align">
                            <div class="label-wrapper extend-width">
                                <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.minValue} toolTipText={$texts.minValueInfo} />
                            </div>
                            <span class="value extend-width">
                                <InputField
                                    style={$NodeConfigSheetInputFieldStyle}
                                    disabled={(node.config.type !== NodeType.FLOAT && node.config.type !== NodeType.INT) || !node.config.min_alarm}
                                    bind:inputValue={node.config.min_alarm_value}
                                    inputInvalid={!node.validation.minAlarm}
                                    enableInputInvalid={true}
                                    onChange={() => {
                                        onPropertyChanged();
                                    }}
                                    inputType={node.config.type}
                                    inputUnit={node.config.unit}
                                    width="100%"
                                />
                                <Checkbox
                                    bind:checked={node.config.min_alarm}
                                    inputInvalid={!node.validation.minAlarm}
                                    enableInputInvalid={true}
                                    onChange={() => {
                                        onPropertyChanged();
                                    }}
                                    inputName="node-min-alarm"
                                    width="38px"
                                    height="38px"
                                />
                            </span>
                        </div>

                        <div class="row col-align">
                            <div class="label-wrapper extend-width">
                                <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.maxValue} toolTipText={$texts.maxValueInfo} />
                            </div>
                            <span class="value extend-width">
                                <InputField
                                    style={$NodeConfigSheetInputFieldStyle}
                                    disabled={(node.config.type !== NodeType.FLOAT && node.config.type !== NodeType.INT) || !node.config.max_alarm}
                                    bind:inputValue={node.config.max_alarm_value}
                                    inputInvalid={!node.validation.maxAlarm}
                                    enableInputInvalid={true}
                                    onChange={() => {
                                        onPropertyChanged();
                                    }}
                                    inputType={node.config.type}
                                    inputUnit={node.config.unit}
                                    width="100%"
                                />
                                <Checkbox
                                    bind:checked={node.config.max_alarm}
                                    inputInvalid={!node.validation.maxAlarm}
                                    enableInputInvalid={true}
                                    onChange={() => {
                                        onPropertyChanged();
                                    }}
                                    inputName="node-max-alarm"
                                    width="38px"
                                    height="38px"
                                />
                            </span>
                        </div>
                    {/if}
                    <div class="row">
                        <div class="label-wrapper">
                            <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.custom} toolTipText={$texts.customInfo} />
                        </div>
                        <span class="value shrink-width">
                            <Checkbox
                                bind:checked={node.config.custom}
                                onChange={() => {
                                    customNodeChange(node, nodeEditingState, node.attributes.phase);
                                    onPropertyChanged();
                                }}
                                inputName="custom-node"
                                width="38px"
                                height="38px"
                            />
                        </span>
                    </div>
                    <div class="row">
                        <div class="label-wrapper">
                            <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.publish} toolTipText={$texts.publishInfo} />
                        </div>
                        <span class="value shrink-width">
                            <Checkbox
                                bind:checked={node.config.publish}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputName="publish-node"
                                width="38px"
                                height="38px"
                            />
                        </span>
                    </div>
                    <div class="row">
                        <div class="label-wrapper">
                            <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.virtual} toolTipText={$texts.virtualInfo} />
                        </div>
                        <span class="value shrink-width">
                            <Checkbox
                                bind:checked={node.config.calculated}
                                onChange={() => {
                                    virtualNodeChange(node, nodeEditingState, deviceData.protocol);
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.calculated}
                                enableInputInvalid={true}
                                inputName="virtual-node"
                                width="38px"
                                height="38px"
                            />
                        </span>
                    </div>
                    {#if node.config.type === NodeType.FLOAT || node.config.type === NodeType.INT}
                        <div class="row">
                            <div class="label-wrapper">
                                <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.counterNode} toolTipText={$texts.counterNodeInfo} />
                            </div>
                            <span class="value shrink-width">
                                <Checkbox
                                    bind:checked={node.config.is_counter}
                                    inputInvalid={!node.validation.isCounter}
                                    enableInputInvalid={true}
                                    onChange={() => {
                                        node.config.counter_mode = node.config.is_counter ? CounterMode.DIRECT : null;
                                        onPropertyChanged();
                                    }}
                                    inputName="counter-node"
                                    width="38px"
                                    height="38px"
                                />
                            </span>
                        </div>
                    {/if}
                    {#if node.config.is_counter}
                        <div class="row col-align">
                            <div class="label-wrapper extend-width">
                                <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.counterMode} toolTipText={$texts.counterModeInfo} />
                            </div>
                            <span class="value extend-width">
                                <Selector
                                    style={$NodeConfigSheetSelectorStyle}
                                    options={$counterModeTexts}
                                    bind:selectedOption={node.config.counter_mode}
                                    onChange={() => {
                                        onPropertyChanged();
                                    }}
                                    inputInvalid={!node.validation.counterMode}
                                    enableInputInvalid={true}
                                    invertOptions={true}
                                    scrollable={true}
                                    width="100%"
                                />
                            </span>
                        </div>
                    {/if}
                    <div class="row">
                        <div class="label-wrapper">
                            <InfoLabel style={$NodeConfigSheetInfoLabelStyle} labelText={$texts.enabled} toolTipText={$texts.enabledInfo} />
                        </div>
                        <span class="value shrink-width">
                            <Checkbox
                                bind:checked={node.config.enabled}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputName="enable-node"
                                width="38px"
                                height="38px"
                            />
                        </span>
                    </div>
                </div>
            {/if}
        </main>
    </RightPanelSheet>
</div>

<style>
    /* Title container: horizontal layout with icon + title text aligned and spaced */
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

    /* Title icon: size controlled entirely by theme variables */
    .title-div img {
        inline-size: var(--title-image-width);
        block-size: var(--title-image-height);
    }

    /* Title text: flexible width, theme-driven typography, vertically aligned to icon */
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

    /* Generic row: label + value horizontal layout */
    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        inline-size: 100%;
        margin: 0;
        padding: 0;
    }

    /* Column-aligned row: used for stacked fields (label above value) */
    .row.col-align {
        flex-direction: column;
        align-items: center;
        justify-content: start;
        width: 100%;
    }

    /* Label text inside rows: aligned, clean baseline, no wrapping */
    .label {
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        line-height: 1;
        block-size: 100%;
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

    /* Shrink-to-content value: used for checkboxes and small toggles */
    .value.shrink-width {
        flex: 0;
        width: fit-content;
    }

    /* Full-width value container: used for multi-input rows (input + checkbox) */
    .value.extend-width {
        flex: 0;
        width: 100%;
        justify-content: space-between;
        gap: 15px;
    }

    /* Header container: stacked rows with spacing controlled by theme variables */
    .header-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--header-row-gap);
        inline-size: 100%;
        margin: 0;
        padding: 0;
    }

    /* Header rows: spaced columns inside each header row */
    .header-div .row {
        gap: var(--header-col-gap);
        block-size: var(--header-row-height);
    }

    /* Header labels: fixed width and theme-driven typography */
    .header-div .label {
        inline-size: var(--header-label-width);
        min-inline-size: var(--header-label-width);
        font-size: var(--header-label-size);
        color: var(--header-label-color);
        font-weight: var(--header-label-weight);
    }

    /* Header values: theme-driven text styling */
    .header-div .value {
        font-size: var(--header-value-size);
        color: var(--header-value-color);
        font-weight: var(--header-value-weight);
    }

    /* Content outer container */
    .content-div {
        inline-size: 100%;
        margin: 0;
        padding: 0;
    }

    /* Inner content wrapper: column layout with adjustable padding and spacing */
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

    /* Content rows: spacing and height controlled by theme variables */
    .content-div .inner-content-div .row {
        gap: var(--content-col-gap);
        block-size: var(--content-row-height);
    }

    /* Content value text: typography controlled by theme variables */
    .content-div .inner-content-div .value {
        font-size: var(--content-value-size);
        color: var(--content-value-color);
        font-weight: var(--content-value-weight);
    }
</style>
