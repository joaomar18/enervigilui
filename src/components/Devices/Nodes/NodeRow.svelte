<script lang="ts">
    import Selector from "../../General/Selector.svelte";
    import InputField from "../../General/InputField.svelte";
    import Checkbox from "../../General/Checkbox.svelte";
    import { nodeNameChange, nodeTypeChange, customNodeChange, virtualNodeChange } from "$lib/ts/nodes";
    import { LOGGING_PERIOD_LIM, NodeType } from "$lib/stores/nodes";
    import { defaultVariableUnits } from "$lib/stores/nodes";
    import { showAlert } from "$lib/stores/alerts";

    // Types
    import type { EditableDeviceMeter, NewDeviceMeter } from "$lib/stores/devices";
    import type { EditableDeviceNode, NodeEditState } from "$lib/stores/nodes";
    import type { ColumnVisibilityMap } from "$lib/ts/nodes_gid";

    // Stores for multi-language support
    import { texts, variableNameTextsByPhase } from "$lib/stores/lang";

    // Props
    export let deviceData: EditableDeviceMeter | NewDeviceMeter;
    export let node: EditableDeviceNode;

    // Layout / styling props
    export let windowWidth: number;
    export let currentGridWidth: number;
    export let columnVisibility: ColumnVisibilityMap;
    export let backgroundColor: string;
    export let hoverColor: string = backgroundColor;
    export let disabledBackgroundColor: string = backgroundColor;
    export let disabledHoverColor: string = disabledBackgroundColor;

    // Variables
    let nodeEditingState: NodeEditState = {
        oldVariableName: node.display_name,
        oldVariableType: node.config.type,
        oldVariableUnit: node.config.unit,
        oldCommunicationID: node.communication_id,
    };

    let rowHeight: string;
    let buttonSize: string;

    // Export Funcions
    export let onPropertyChanged: () => void;
    export let onDelete: () => void;
    export let onConfig: (nodeEditingState: NodeEditState) => void;

    // Functions
    function handleOnDelete(): void {
        if (onDelete) {
            onDelete();
        }
    }

    function handleOnConfig(): void {
        if (onConfig) {
            onConfig(nodeEditingState);
        }
    }

    $: if (windowWidth) {
        rowHeight = windowWidth <= 880 ? "40px" : "30px";
        buttonSize = windowWidth <= 880 ? "2em" : "1.5em";
    }
</script>

<!-- NodeRow Component: renders a table row for a device node, displaying editable fields for 
name, unit, communication ID, type, alarms, and options. Includes checkboxes for node 
properties and action buttons for configuration and deletion. -->
<tr
    style="
        --background-color: {backgroundColor};
        --hover-color: {hoverColor};
        --disabled-background-color: {disabledBackgroundColor};
        --disabled-hover-color: {disabledHoverColor};
    "
    class="edit-node"
    class:disabled={!node.config.enabled}
>
    {#if columnVisibility.name.visible}
        <td>
            <div class="cell-content">
                {#if !node.config.custom}
                    <Selector
                        useLang={true}
                        options={$variableNameTextsByPhase[node.phase]}
                        bind:selectedOption={node.display_name}
                        onChange={() => {
                            nodeNameChange(node, node.phase);
                            onPropertyChanged();
                        }}
                        inputInvalid={!node.validation.variableName}
                        enableInputInvalid={true}
                        scrollable={true}
                        maxOptions={5}
                        width="90%"
                        height={rowHeight}
                        optionHeight={rowHeight}
                        borderRadius="5px"
                        backgroundColor="#1a2027"
                        selectedColor="#14566b"
                        badFormatBorderColor="#e74c3c"
                        optionsBackgroundColor="#1e242b"
                        optionsBorderColor="#323a45"
                        optionsInnerBorderColor="#323a45"
                        fontSize="0.9rem"
                        arrowWidth="16px"
                        arrowHeight="16px"
                        arrowRightPos="5px"
                    />
                {:else}
                    <InputField
                        bind:inputValue={node.display_name}
                        onChange={() => {
                            onPropertyChanged();
                        }}
                        inputInvalid={!node.validation.variableName}
                        enableInputInvalid={true}
                        inputType="STRING"
                        width="90%"
                        height={rowHeight}
                        borderRadius="5px"
                        backgroundColor="#1a2027"
                        disabledBackgroundColor="#42505f"
                        selectedBackgroundColor="#1a2027"
                        selectedBorderColor="#2F80ED"
                        badFormatBorderColor="#e74c3c"
                        fontSize="0.9rem"
                        fontColor="#f5f5f5"
                        fontWeight="400"
                        textAlign="center"
                        unitTextColor="rgb(170,170,170)"
                    />
                {/if}
            </div>
        </td>
    {/if}
    {#if columnVisibility.unit.visible}
        <td>
            <div class="cell-content">
                {#if !node.config.custom}
                    <Selector
                        options={Object.fromEntries($defaultVariableUnits[node.display_name]?.map((unit) => [unit, unit]) || [])}
                        bind:selectedOption={node.config.unit}
                        onChange={() => {
                            onPropertyChanged();
                        }}
                        disabled={node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN}
                        inputInvalid={!node.validation.variableUnit}
                        enableInputInvalid={true}
                        scrollable={true}
                        maxOptions={5}
                        width="90%"
                        height={rowHeight}
                        optionHeight={rowHeight}
                        borderRadius="5px"
                        backgroundColor="#1a2027"
                        disabledBackgroundColor="#42505f"
                        selectedColor="#14566b"
                        badFormatBorderColor="#e74c3c"
                        optionsBackgroundColor="#1e242b"
                        optionsBorderColor="#323a45"
                        fontSize="0.9rem"
                        arrowWidth="16px"
                        arrowHeight="16px"
                        arrowRightPos="5px"
                    />
                {:else}
                    <InputField
                        bind:inputValue={node.config.unit}
                        onChange={() => {
                            onPropertyChanged();
                        }}
                        disabled={node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN}
                        inputInvalid={!node.validation.variableUnit}
                        enableInputInvalid={true}
                        inputType="STRING"
                        width="90%"
                        height={rowHeight}
                        borderRadius="5px"
                        backgroundColor="#1a2027"
                        disabledBackgroundColor="#42505f"
                        selectedBackgroundColor="#1a2027"
                        selectedBorderColor="#2F80ED"
                        badFormatBorderColor="#e74c3c"
                        fontSize="0.9rem"
                        fontColor="#f5f5f5"
                        fontWeight="400"
                        textAlign="center"
                        unitTextColor="rgb(170,170,170)"
                    />
                {/if}
            </div>
        </td>
    {/if}
    {#if columnVisibility.communicationID.visible}
        <td>
            <div class="cell-content">
                <InputField
                    disabled={node.config.calculated}
                    bind:inputValue={node.communication_id}
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputInvalid={!node.validation.communicationID}
                    enableInputInvalid={true}
                    inputType="STRING"
                    width="90%"
                    height={rowHeight}
                    borderRadius="5px"
                    backgroundColor="#1a2027"
                    disabledBackgroundColor="#42505f"
                    selectedBackgroundColor="#1a2027"
                    selectedBorderColor="#2F80ED"
                    badFormatBorderColor="#e74c3c"
                    fontSize="0.9rem"
                    fontColor="#f5f5f5"
                    fontWeight="400"
                    textAlign="center"
                    unitTextColor="rgb(170,170,170)"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.type.visible}
        <td>
            <div class="cell-content">
                <Selector
                    options={Object.fromEntries(Object.entries(NodeType).map(([key, value]) => [value, value]))}
                    bind:selectedOption={node.config.type}
                    onChange={() => {
                        nodeTypeChange(node, nodeEditingState);
                        onPropertyChanged();
                    }}
                    inputInvalid={!node.validation.variableType}
                    enableInputInvalid={true}
                    scrollable={true}
                    maxOptions={5}
                    width="90%"
                    height={rowHeight}
                    optionHeight={rowHeight}
                    borderRadius="5px"
                    backgroundColor="#1a2027"
                    disabledBackgroundColor="#42505f"
                    selectedColor="#14566b"
                    badFormatBorderColor="#e74c3c"
                    optionsBackgroundColor="#1e242b"
                    optionsBorderColor="#323a45"
                    fontSize="0.9rem"
                    arrowWidth="16px"
                    arrowHeight="16px"
                    arrowRightPos="5px"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.logging_period.visible}
        <td>
            <div class="cell-content">
                <InputField
                    disabled={!node.config.logging}
                    bind:inputValue={node.config.logging_period}
                    inputInvalid={!node.validation.loggingPeriod}
                    enableInputInvalid={true}
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputType="POSITIVE_INT"
                    minValue={LOGGING_PERIOD_LIM.MIN}
                    maxValue={LOGGING_PERIOD_LIM.MAX}
                    limitsPassed={() => {
                        showAlert($texts.loggingPeriodError, {
                            minValue: LOGGING_PERIOD_LIM.MIN,
                            maxValue: LOGGING_PERIOD_LIM.MAX,
                        });
                    }}
                    inputUnit="min."
                    width="90%"
                    height={rowHeight}
                    borderRadius="5px"
                    backgroundColor="#1a2027"
                    disabledBackgroundColor="#42505f"
                    selectedBackgroundColor="#1a2027"
                    selectedBorderColor="#2F80ED"
                    badFormatBorderColor="#e74c3c"
                    fontSize="0.9rem"
                    fontColor="#f5f5f5"
                    fontWeight="400"
                    textAlign="center"
                    unitTextColor="rgb(170,170,170)"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.min_alarm.visible}
        <td>
            <div class="cell-content">
                <InputField
                    disabled={(node.config.type !== NodeType.FLOAT && node.config.type !== NodeType.INT) || !node.config.min_alarm}
                    bind:inputValue={node.config.min_alarm_value}
                    inputInvalid={!node.validation.type}
                    enableInputInvalid={true}
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputType={node.config.type}
                    inputUnit={node.config.unit}
                    width="90%"
                    height={rowHeight}
                    borderRadius="5px"
                    backgroundColor="#1a2027"
                    disabledBackgroundColor="#42505f"
                    selectedBackgroundColor="#1a2027"
                    selectedBorderColor="#2F80ED"
                    badFormatBorderColor="#e74c3c"
                    fontSize="0.9rem"
                    fontColor="#f5f5f5"
                    fontWeight="400"
                    textAlign="center"
                    unitTextColor="rgb(170,170,170)"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.max_alarm.visible}
        <td>
            <div class="cell-content">
                <InputField
                    disabled={(node.config.type !== NodeType.FLOAT && node.config.type !== NodeType.INT) || !node.config.max_alarm}
                    bind:inputValue={node.config.max_alarm_value}
                    inputInvalid={!node.validation.maxAlarm}
                    enableInputInvalid={true}
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputType={node.config.type}
                    inputUnit={node.config.unit}
                    width="90%"
                    height={rowHeight}
                    borderRadius="5px"
                    backgroundColor="#1a2027"
                    disabledBackgroundColor="#42505f"
                    selectedBackgroundColor="#1a2027"
                    selectedBorderColor="#2F80ED"
                    badFormatBorderColor="#e74c3c"
                    fontSize="0.9rem"
                    fontColor="#f5f5f5"
                    fontWeight="400"
                    textAlign="center"
                    unitTextColor="rgb(170,170,170)"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.custom.visible}
        <td>
            <div class="cell-content">
                <Checkbox
                    bind:checked={node.config.custom}
                    onChange={() => {
                        customNodeChange(node, nodeEditingState, node.phase);
                        onPropertyChanged();
                    }}
                    inputName="custom-node"
                    width="1.5em"
                    height="1.5em"
                    checkMarkWidth={24}
                    checkMarkHeight={24}
                    enabledbgColor="#2f80ed"
                    enabledBorderColor="#5a646e"
                    disabledbgColor="#42505f"
                    disabledBorderColor="#5a646e"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.publish.visible}
        <td>
            <div class="cell-content">
                <Checkbox
                    bind:checked={node.config.publish}
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputName="publish-node"
                    width="1.5em"
                    height="1.5em"
                    checkMarkWidth={24}
                    checkMarkHeight={24}
                    enabledbgColor="#2f80ed"
                    enabledBorderColor="#5a646e"
                    disabledbgColor="#42505f"
                    disabledBorderColor="#5a646e"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.virtual.visible}
        <td>
            <div class="cell-content">
                <Checkbox
                    bind:checked={node.config.calculated}
                    onChange={() => {
                        virtualNodeChange(node, nodeEditingState, deviceData.protocol);
                        onPropertyChanged();
                    }}
                    inputInvalid={!node.validation.calculated}
                    enableInputInvalid={true}
                    inputName="virtual-node"
                    width="1.5em"
                    height="1.5em"
                    checkMarkWidth={24}
                    checkMarkHeight={24}
                    enabledbgColor="#2f80ed"
                    enabledBorderColor="#5a646e"
                    disabledbgColor="#42505f"
                    disabledBorderColor="#5a646e"
                    badFormatBackgroundColor="#e74c3c"
                    badFormatBorderColor="#5a646e"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.logging.visible}
        <td>
            <div class="cell-content">
                <Checkbox
                    bind:checked={node.config.logging}
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputInvalid={!node.validation.loggingPeriod}
                    inputName="log-node"
                    width="1.5em"
                    height="1.5em"
                    checkMarkWidth={24}
                    checkMarkHeight={24}
                    enabledbgColor="#2f80ed"
                    enabledBorderColor="#5a646e"
                    disabledbgColor="#42505f"
                    disabledBorderColor="#5a646e"
                    badFormatBackgroundColor="#e74c3c"
                    badFormatBorderColor="#5a646e"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.enable_min_alarm.visible}
        <td>
            <div class="cell-content">
                <Checkbox
                    disabled={node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN}
                    bind:checked={node.config.min_alarm}
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputInvalid={!node.validation.minAlarm}
                    enableInputInvalid={true}
                    inputName="node-min-alarm"
                    width="1.5em"
                    height="1.5em"
                    checkMarkWidth={24}
                    checkMarkHeight={24}
                    enabledbgColor="#2f80ed"
                    enabledBorderColor="#5a646e"
                    disabledbgColor="#42505f"
                    disabledBorderColor="#5a646e"
                    badFormatBackgroundColor="#e74c3c"
                    badFormatBorderColor="#5a646e"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.enable_max_alarm.visible}
        <td>
            <div class="cell-content">
                <Checkbox
                    disabled={node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN}
                    bind:checked={node.config.max_alarm}
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputInvalid={!node.validation.maxAlarm}
                    enableInputInvalid={true}
                    inputName="node-max-alarm"
                    width="1.5em"
                    height="1.5em"
                    checkMarkWidth={24}
                    checkMarkHeight={24}
                    enabledbgColor="#2f80ed"
                    enabledBorderColor="#5a646e"
                    disabledbgColor="#42505f"
                    disabledBorderColor="#5a646e"
                    badFormatBackgroundColor="#e74c3c"
                    badFormatBorderColor="#5a646e"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.enable.visible}
        <td>
            <div class="cell-content">
                <Checkbox
                    bind:checked={node.config.enabled}
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputName="enable-node"
                    width={buttonSize}
                    height={buttonSize}
                    checkMarkWidth={24}
                    checkMarkHeight={24}
                    enabledbgColor="#2f80ed"
                    enabledBorderColor="#5a646e"
                    disabledbgColor="#42505f"
                    disabledBorderColor="#5a646e"
                />
            </div>
        </td>
    {/if}
    {#if columnVisibility.actions.visible}
        <td>
            <div class="cell-content gap-items">
                {#if currentGridWidth > 325}
                    <button class="btn-delete" aria-label="Delete Node" on:click={handleOnDelete}>
                        <svg xmlns="http://www.w3.org/2000/svg" height={buttonSize} viewBox="0 0 24 24" width={buttonSize}
                            ><path
                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm2 2v6h1v-6h-1zm3 0v6h1v-6h-1zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                            /></svg
                        >
                    </button>
                {/if}
                <button class="btn-more-options" class:not-valid={!node.validation.isValid()} aria-label="More Options" on:click={handleOnConfig}>
                    <svg xmlns="http://www.w3.org/2000/svg" height={buttonSize} viewBox="0 -960 960 960" width={buttonSize}
                        ><path
                            d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
                        /></svg
                    >
                </button>
            </div>
        </td>
    {/if}
</tr>

<style>
    /* Table row for editable node */
    tr.edit-node {
        background-color: var(--background-color);
    }

    /* Node row hover styling */
    tr.edit-node:hover {
        background-color: var(--hover-color);
    }

    /* Disabled node row styling */
    tr.edit-node.disabled {
        background-color: var(--disabled-background-color);
    }

    /* Disabled node row hover styling */
    tr.edit-node.disabled:hover {
        background-color: var(--disabled-hover-color);
    }

    /* Table cell styling for node fields */
    tr td {
        height: 40px;
        padding: 5px;
        padding-left: 0px;
        padding-right: 0px;
    }

    /* Content container for each cell */
    tr td .cell-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
    }

    /* Adds gap between action buttons */
    tr td .cell-content.gap-items {
        gap: 15px;
    }

    /* Button base styling for actions */
    button {
        background-color: transparent;
        cursor: pointer;
        border: none;
    }

    /* Delete button icon color */
    .btn-delete svg {
        fill: rgb(192, 192, 192);
    }

    /* Delete button icon color on hover */
    .btn-delete:hover svg {
        fill: #e74c3c;
    }

    /* More options button icon color */
    .btn-more-options svg {
        fill: rgb(192, 192, 192);
    }

    /* More options button icon color on hover */
    .btn-more-options:hover svg {
        fill: #2f80ed;
    }

    /* Make more options button red if node is not valid */
    .btn-more-options.not-valid svg {
        fill: #e74c3c;
    }

    /* Hover color for more options button when node is not valid */
    .btn-more-options.not-valid:hover svg {
        fill: #c0392b;
    }

    /* Responsive: reduce row height on wide screens */
    @media (min-width: 880px) {
        tr td {
            height: 30px;
        }
    }
</style>
