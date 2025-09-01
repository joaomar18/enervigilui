<script lang="ts">
    import HintInfo from "../../General/HintInfo.svelte";
    import InputField from "../../General/InputField.svelte";
    import Checkbox from "../../General/Checkbox.svelte";
    import Selector from "../../General/Selector.svelte";
    import { protocolPlugins } from "$lib/stores/device/protocol";
    import ModalWindow from "../../General/ModalWindow.svelte";
    import { nodeNameChange, communicationIDChange, nodeTypeChange, customNodeChange, virtualNodeChange } from "$lib/logic/handlers/nodes";
    import { showToast } from "$lib/logic/view/toast";
    import { ToastType } from "$lib/stores/view/toast";
    import { NodeType, DECIMAL_PLACES_LIM, LOGGING_PERIOD_LIM } from "$lib/types/nodes/base";

    // Types
    import type { EditableDeviceMeter, NewDeviceMeter } from "$lib/types/device/base";
    import type { EditableDeviceNode, NodeEditState } from "$lib/types/nodes/base";

    // Stores for variable definitions
    import { defaultVariableUnits } from "$lib/stores/device/variables";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { pluginTexts } from "$lib/stores/lang/protocolPlugin";
    import { variableNameTextsByPhase } from "$lib/stores/lang/energyMeterTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { NodeConfigWindowStyle } from "$lib/style/nodes";
    import { NodeInputFieldStyle, NodeSelectorStyle } from "$lib/style/nodes";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $NodeConfigWindowStyle;

    // Props
    export let visible: boolean;
    export let deviceData: EditableDeviceMeter | NewDeviceMeter;
    export let node: EditableDeviceNode;
    export let nodeEditingState: NodeEditState;

    // Layout / styling props
    export let headerTextColor: string | undefined = undefined;
    export let headerTextWeight: string | undefined = undefined;
    export let headerSubTextColor: string | undefined = undefined;
    export let headerSubFontWeight: string | undefined = undefined;
    export let textColor: string | undefined = undefined;
    export let textWeight: string | undefined = undefined;
    export let hintInfoTextColor: string | undefined = undefined;
    export let hintInfoTextWeight: string | undefined = undefined;

    $: localOverrides = {
        headerTextColor,
        headerTextWeight,
        headerSubTextColor,
        headerSubFontWeight,
        textColor,
        textWeight,
        hintInfoTextColor,
        hintInfoTextWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Export Funcions
    export let onPropertyChanged: () => void;
</script>

<!-- NodeConfigWindow Component: renders a modal window for editing a device node's configuration, including 
variable name, unit, communication ID, type, logging, alarms, and advanced options. 
Displays contextual hints and supports multi-language labels for all fields. -->
<ModalWindow
    customTitle={true}
    width="100%"
    maxWidth="750px"
    height="fit-content"
    maxHeight="1050px"
    closeWindow={() => {
        visible = false;
    }}
>
    <span
        slot="header"
        style="
            --header-text-color: {mergedStyle.headerTextColor};
            --header-text-weight: {mergedStyle.headerTextWeight};
            --header-sub-text-color: {mergedStyle.headerSubTextColor};
            --header-sub-font-weight: {mergedStyle.headerSubFontWeight};
        "
        class="header"
    >
        <span class="header-section">
            <span class="main-text">{`${$texts.variable}:`}</span>
            {#if !node.config.custom}
                <span class="sub-text">
                    {#if node.display_name !== "" && node.display_name !== undefined}
                        {$variableNameTextsByPhase[node.phase][node.display_name] || $texts.notFound}
                    {/if}
                </span>
            {:else}
                <span class="sub-text">{node.display_name}</span>
            {/if}
        </span>
        <span class="header-section">
            <span class="main-text">{`${$texts.section}:`}</span>
            <span class="sub-text">{$texts[node.phase.toLocaleLowerCase()]}</span>
        </span>
        <span class="header-section">
            <span class="main-text">{`${$texts.protocol}:`}</span>
            <span class="sub-text">{node.protocol}</span>
        </span>
    </span>
    <div
        style="
            --text-color: {mergedStyle.textColor};
            --text-weight: {mergedStyle.textWeight};
            --hint-info-text-color: {mergedStyle.hintInfoTextColor};
            --hint-info-text-weight: {mergedStyle.hintInfoTextWeight};
        "
        class="node-config-div"
    >
        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.variable}</span>
                <span class="row-input">
                    <span class="row-entry">
                        {#if !node.config.custom}
                            <Selector
                                style={$NodeSelectorStyle}
                                options={$variableNameTextsByPhase[node.phase]}
                                bind:selectedOption={node.display_name}
                                onChange={() => {
                                    nodeNameChange(node, node.phase);
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.variableName}
                                enableInputInvalid={true}
                                scrollable={true}
                                width="100%"
                            />
                        {:else}
                            <InputField
                                style={$NodeInputFieldStyle}
                                bind:inputValue={node.display_name}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.variableName}
                                enableInputInvalid={true}
                                inputType="STRING"
                                width="100%"
                            />
                        {/if}
                    </span>
                    <span class="row-hint">
                        <HintInfo hintWidth="250px">
                            <span class="info-text">
                                {#if !node.config.custom}
                                    {$texts.variableInfo}
                                {:else}
                                    {$texts.variableCustomInfo}
                                {/if}
                            </span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>

        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.unit}</span>
                <span class="row-input">
                    <span class="row-entry">
                        {#if !node.config.custom}
                            <Selector
                                style={$NodeSelectorStyle}
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
                                style={$NodeInputFieldStyle}
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
                    <span class="row-hint">
                        <HintInfo hintWidth="250px">
                            <span class="info-text">
                                {#if !node.config.custom}
                                    {$texts.unitInfo}
                                {:else}
                                    {$texts.unitCustomInfo}
                                {/if}</span
                            >
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        {#if node.config.type === NodeType.FLOAT}
            <div class="row">
                <span class="row-variable">
                    <span class="row-identifier">{$texts.decimalPlaces}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <InputField
                                style={$NodeInputFieldStyle}
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
                                    showToast("decimalPlacesError", ToastType.ALERT, {
                                        minValue: DECIMAL_PLACES_LIM.MIN,
                                        maxValue: DECIMAL_PLACES_LIM.MAX,
                                    });
                                }}
                                width="100%"
                            />
                        </span>
                        <span class="row-hint">
                            <HintInfo hintWidth="250px">
                                <span class="info-text"> {$texts.decimalPlacesInfo}</span>
                            </HintInfo>
                        </span>
                    </span>
                </span>
            </div>
        {/if}
        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">
                    {$pluginTexts[$protocolPlugins[deviceData.protocol].textKey]}
                </span>
                <span class="row-input">
                    <span class="row-entry">
                        <InputField
                            style={$NodeInputFieldStyle}
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
                    <span class="row-hint">
                        <HintInfo hintWidth="250px">
                            <span class="info-text">
                                {$pluginTexts[$protocolPlugins[deviceData.protocol].infoTextKey]}
                            </span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.type}</span>
                <span class="row-input">
                    <span class="row-entry">
                        <Selector
                            style={$NodeSelectorStyle}
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
                    <span class="row-hint">
                        <HintInfo hintWidth="250px">
                            <span class="info-text">{$texts.typeInfo}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.loggingPeriod}</span>
                <span class="row-input">
                    <span class="row-entry">
                        <InputField
                            style={$NodeInputFieldStyle}
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
                                showToast($texts.loggingPeriodError, ToastType.ALERT, {
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
                    <span class="row-hint">
                        <HintInfo hintWidth="250px">
                            <span class="info-text">{$texts.loggingInfo}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        {#if node.config.type === NodeType.FLOAT || node.config.type == NodeType.INT}
            <div class="row">
                <span class="row-variable">
                    <span class="row-identifier">{$texts.minValue}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <InputField
                                style={$NodeInputFieldStyle}
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
                        <span class="row-hint">
                            <HintInfo hintWidth="250px">
                                <span class="info-text">{$texts.minValueInfo}</span>
                            </HintInfo>
                        </span>
                    </span>
                </span>
            </div>
            <div class="row">
                <span class="row-variable">
                    <span class="row-identifier">{$texts.maxValue}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <InputField
                                style={$NodeInputFieldStyle}
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
                        <span class="row-hint">
                            <HintInfo hintWidth="250px">
                                <span class="info-text">{$texts.maxValueInfo}</span>
                            </HintInfo>
                        </span>
                    </span>
                </span>
            </div>
        {/if}
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.custom}</span>
                <span class="row-input">
                    <span class="row-entry">
                        <Checkbox
                            bind:checked={node.config.custom}
                            onChange={() => {
                                customNodeChange(node, nodeEditingState, node.phase);
                                onPropertyChanged();
                            }}
                            inputName="custom-node"
                            width="38px"
                            height="38px"
                        />
                    </span>
                    <span class="row-hint">
                        <HintInfo hintWidth="250px">
                            <span class="info-text">{$texts.customInfo}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.publish}</span>
                <span class="row-input">
                    <span class="row-entry">
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
                    <span class="row-hint">
                        <HintInfo hintWidth="250px">
                            <span class="info-text">{$texts.publishInfo}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.virtual}</span>
                <span class="row-input">
                    <span class="row-entry">
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
                    <span class="row-hint">
                        <HintInfo openInverted={true} hintWidth="250px">
                            <span class="info-text">{$texts.virtualInfo}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        {#if node.config.type === NodeType.FLOAT || node.config.type === NodeType.INT}
            <div class="row">
                <span class="row-variable no-wrap">
                    <span class="row-identifier">{$texts.incrementalNode}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <Checkbox
                                bind:checked={node.config.incremental_node}
                                inputInvalid={!node.validation.incremental}
                                enableInputInvalid={true}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputName="incremental-node"
                                width="38px"
                                height="38px"
                            />
                        </span>
                        <span class="row-hint">
                            <HintInfo openInverted={true} hintWidth="250px">
                                <span class="info-text">{$texts.incrementalNodeInfo}</span>
                            </HintInfo>
                        </span>
                    </span>
                </span>
            </div>
        {/if}
        {#if node.config.incremental_node}
            <div class="row">
                <span class="row-variable no-wrap">
                    <span class="row-identifier">{$texts.positiveIncrement}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <Checkbox
                                bind:checked={node.config.positive_incremental}
                                inputInvalid={!node.validation.positive_incremental}
                                enableInputInvalid={true}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputName="positive-increment-node"
                                width="38px"
                                height="38px"
                            />
                        </span>
                        <span class="row-hint">
                            <HintInfo openInverted={true} hintWidth="250px">
                                <span class="info-text">{$texts.positiveIncrementInfo}</span>
                            </HintInfo>
                        </span>
                    </span>
                </span>
            </div>
            <div class="row">
                <span class="row-variable no-wrap">
                    <span class="row-identifier">{$texts.calculateIncrement}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <Checkbox
                                bind:checked={node.config.calculate_increment}
                                inputInvalid={!node.validation.calculate_increment}
                                enableInputInvalid={true}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputName="calculate-increment-node"
                                width="38px"
                                height="38px"
                            />
                        </span>
                        <span class="row-hint">
                            <HintInfo openInverted={true} hintWidth="250px">
                                <span class="info-text">{$texts.calculateIncrementInfo}</span>
                            </HintInfo>
                        </span>
                    </span>
                </span>
            </div>
        {/if}
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.enabled}</span>
                <span class="row-input">
                    <span class="row-entry">
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
                    <span class="row-hint">
                        <HintInfo openInverted={true} hintWidth="250px">
                            <span class="info-text">{$texts.enabledInfo}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
    </div>
</ModalWindow>

<style>
    /* Modal header container for node config */
    .header {
        margin: 0;
        padding: 15px;
        padding-right: 50px;
        line-height: 1.5;
        text-wrap: wrap;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        flex-wrap: wrap;
    }

    /* Header section grouping for variable, section, protocol */
    .header .header-section {
        padding: 0;
        margin: 0;
    }

    /* Main label text in header */
    .header .header-section .main-text {
        font-size: 1rem;
        color: var(--header-text-color);
        font-weight: var(--header-text-weight);
    }

    /* Sub-label text in header */
    .header .header-section .sub-text {
        padding-left: 5px;
        padding-right: 10px;
        font-size: 1rem;
        color: var(--header-sub-text-color);
        font-weight: var(--header-sub-font-weight);
    }

    /* Main container for all node config rows */
    .node-config-div {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 100%;
        gap: 15px;
    }

    /* Individual row for each config field */
    .row {
        padding: 0;
        margin: 0;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    /* Variable label and input container in each row */
    .row .row-variable {
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        max-width: 500px;
    }

    /* No-wrap style for horizontal layout of some rows */
    .row .row-variable.no-wrap {
        flex-direction: row;
        padding-top: 10px;
        padding-bottom: 10px;
        min-width: 250px;
    }

    /* Identifier label for each config field */
    .row .row-variable .row-identifier {
        font-size: 1rem;
        color: var(--text-color);
        font-weight: var(--text-weight);
        white-space: nowrap;
        text-align: center;
        padding: 0;
        margin: 0;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 100%;
    }

    /* Identifier label adjustment for no-wrap rows */
    .row .row-variable.no-wrap .row-identifier {
        padding-bottom: 0px;
        padding-top: 0px;
        text-align: left;
    }

    /* Input area for each config field */
    .row .row-variable .row-input {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        min-width: 250px;
    }

    /* Input area adjustment for no-wrap rows */
    .row .row-variable.no-wrap .row-input {
        width: fit-content;
        min-width: auto;
    }

    /* Entry field container for selectors, checkboxes, etc. */
    .row .row-variable .row-input .row-entry {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 10px;
        width: 100%;
    }

    /* Entry field adjustment for no-wrap rows */
    .row .row-variable.no-wrap .row-input .row-entry {
        width: 100%;
        min-width: auto;
        justify-content: end;
        gap: 0px;
    }

    /* Responsive: horizontal row layout on wide screens */
    @media (min-width: 880px) {
        .row {
            flex-direction: row;
        }

        /* Add spacing for hint on wide screens */
        .row .row-variable .row-input .row-hint {
            padding-left: 20px;
        }
    }

    /* Info text styling for hints in each row */
    .row-hint .info-text {
        padding: 10px;
        padding-right: 40px;
        font-size: 1rem;
        font-weight: var(--hint-info-text-weight);
        line-height: 1.5;
        color: var(--hint-info-text-color);
    }
</style>
