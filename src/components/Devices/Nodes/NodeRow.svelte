<script lang="ts">
    import Selector from "../../General/Selector.svelte";
    import InputField from "../../General/InputField.svelte";
    import Checkbox from "../../General/Checkbox.svelte";
    import { validateNodeName, validateNodeUnit, validateCommunicationID, validateNodeType } from "$lib/ts/nodes";

    import { Protocol, NodeType, NodePhase } from "$lib/stores/nodes";
    import type { FormattedNode } from "$lib/stores/nodes";
    import { defaultVariableUnits } from "$lib/stores/nodes";

    // Stores for multi-language support
    import { variableNameTexts, variableNameTextsByPhase } from "$lib/stores/lang";

    // Props
    export let sectionNodes: Array<FormattedNode>;
    export let selectedProtocol: Protocol;
    export let variablePhase: NodePhase;
    export let node: FormattedNode;

    // Layout / styling props
    export let backgroundColor: string;

    // Variables
    let publish: boolean;

    let oldVariableName: string = node.displayName;
    let oldVariableUnit: string = node.config.unit;
    let customVariableChanged: boolean = node.config.custom;

    let disabledUnit: boolean = false;
    let disabledCommIDString: string = "";

    // Export Funcions
    export let onVariableNameChanged: (variableName: string) => void = () => {};
    export let onVariableUnitChanged: (variableUnit: string) => void = () => {};
    export let onVariableTypeChanged: (variableType: NodeType) => void = () => {};
    export let onCommunicationIDChanged: (communicationID: string | undefined) => void = () => {};
    export let onCustomVariableChanged: (customVariable: boolean) => void = () => {};
    export let onVirtualVariableChanged: (virtualVariable: boolean) => void = () => {};
    export let onLogVariableChanged: (logVariable: boolean) => void = () => {};
    export let onEnableMinAlarmChanged: (enableMinAlarm: boolean) => void = () => {};
    export let onEnableMaxAlarmChanged: (enableMaxAlarm: boolean) => void = () => {};
    export let onEnableChanged: (enable: boolean) => void = () => {};
    export let onProtocolChanged: (newProtocol: Protocol) => void = () => {};
    export let onDelete: () => void;
    export let onConfig: () => void;

    // Functions
    function handleOnDelete(): void {
        if (onDelete) {
            onDelete();
        }
    }

    function handleOnConfig(): void {
        if (onConfig) {
            onConfig();
        }
    }

    // Reactive statements
    $: onVariableNameChanged(node.displayName);
    $: onVariableUnitChanged(node.config.unit);
    $: {
        if (node.config.type === NodeType.FLOAT || node.config.type === NodeType.INT) {
            if ($defaultVariableUnits[node.displayName]) {
                node.config.unit = $defaultVariableUnits[node.displayName][0];
            } else {
                node.config.unit = "";
            }
            disabledUnit = false;
        } else if (node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN) {
            node.config.unit = "";
            disabledUnit = true;
        }
    }
    $: onVariableTypeChanged(node.config.type);
    $: onCommunicationIDChanged(node.communicationID);
    $: {
        if (node.config.custom && !customVariableChanged) {
            oldVariableName = node.displayName;
            oldVariableUnit = node.config.unit;
            node.displayName = "";
            node.config.unit = "";
            customVariableChanged = true;
        } else if (!node.config.custom && customVariableChanged) {
            node.displayName = oldVariableName;
            node.config.unit = oldVariableUnit;
            customVariableChanged = false;
        }
        onCustomVariableChanged(node.config.custom);
    }
    $: {
        if (node.config.calculated) {
            node.communicationID = "";
            node.config.protocol = Protocol.NONE;
        } else {
            node.config.protocol = selectedProtocol;
        }
        onVirtualVariableChanged(node.config.calculated);
    }
    $: onLogVariableChanged(node.config.logging);
    $: onEnableMinAlarmChanged(node.config.min_alarm);
    $: onEnableMaxAlarmChanged(node.config.max_alarm);
    $: onEnableChanged(node.config.enabled);
    $: onProtocolChanged(node.config.protocol);
</script>

<tr
    style="
        --background-color: {backgroundColor};
    "
    class="edit-node"
>
    <td>
        <div class="cell-content">
            {#if !node.config.custom}
                <Selector
                    useLang={true}
                    options={$variableNameTextsByPhase[variablePhase]}
                    bind:selectedOption={node.displayName}
                    enableInputInvalid={!validateNodeName(node.displayName, node.config.custom, sectionNodes)}
                    inputInvalid={true}
                    scrollable={true}
                    maxOptions={5}
                    width="90%"
                    height="30px"
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
                    bind:inputValue={node.displayName}
                    inputInvalid={!validateNodeName(node.displayName, node.config.custom, sectionNodes)}
                    enableInputInvalid={true}
                    inputType="STRING"
                    width="90%"
                    height="30px"
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
    <td>
        <div class="cell-content">
            {#if !node.config.custom}
                <Selector
                    options={Object.fromEntries($defaultVariableUnits[node.displayName]?.map((unit) => [unit, unit]) || [])}
                    bind:selectedOption={node.config.unit}
                    disabled={disabledUnit}
                    inputInvalid={!validateNodeUnit(node.displayName, node.config.type, node.config.unit, node.config.custom)}
                    enableInputInvalid={true}
                    scrollable={true}
                    maxOptions={5}
                    width="90%"
                    height="30px"
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
                    disabled={disabledUnit}
                    inputInvalid={!validateNodeUnit(node.displayName, node.config.type, node.config.unit, node.config.custom)}
                    enableInputInvalid={true}
                    inputType="STRING"
                    width="90%"
                    height="30px"
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
    <td>
        <div class="cell-content">
            {#if node.communicationID !== undefined}
                <InputField
                    disabled={node.config.calculated}
                    bind:inputValue={node.communicationID}
                    inputInvalid={!validateCommunicationID(node.communicationID, node.config.protocol)}
                    enableInputInvalid={true}
                    inputType="STRING"
                    width="90%"
                    height="30px"
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
            {:else}
                <InputField
                    disabled={node.config.calculated}
                    bind:inputValue={disabledCommIDString}
                    inputInvalid={!validateCommunicationID(node.communicationID, node.config.protocol)}
                    enableInputInvalid={true}
                    inputType="STRING"
                    width="90%"
                    height="30px"
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
    <td>
        <div class="cell-content">
            <Selector
                options={Object.fromEntries(Object.entries(NodeType).map(([key, value]) => [value, value]))}
                bind:selectedOption={node.config.type}
                inputInvalid={!validateNodeType(node.config.type, node.displayName, node.config.custom)}
                enableInputInvalid={true}
                scrollable={true}
                maxOptions={5}
                width="90%"
                height="30px"
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
    <td>
        <div class="cell-content">
            <Checkbox
                bind:checked={node.config.custom}
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
    <td>
        <div class="cell-content">
            <Checkbox
                bind:checked={publish}
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
    <td>
        <div class="cell-content">
            <Checkbox
                bind:checked={node.config.calculated}
                inputName="virtual-node"
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
    <td>
        <div class="cell-content">
            <Checkbox
                bind:checked={node.config.logging}
                inputName="log-node"
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
    <td>
        <div class="cell-content">
            <Checkbox
                bind:checked={node.config.enabled}
                inputName="enable-node"
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
    <td>
        <div class="cell-content gap-items">
            <button class="btn-delete" aria-label="Delete Node" on:click={handleOnDelete}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                    ><path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm2 2v6h1v-6h-1zm3 0v6h1v-6h-1zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    /></svg
                >
            </button>
            <button class="btn-more-options" aria-label="More Options" on:click={handleOnConfig}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    ><path
                        d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
                    /></svg
                >
            </button>
        </div>
    </td>
</tr>

<style>
    tr.edit-node {
        background-color: var(--background-color);
    }

    tr td {
        height: 30px;
        padding: 5px;
        padding-left: 0px;
        padding-right: 0px;
    }

    tr td .cell-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
    }

    tr td .cell-content.gap-items {
        gap: 15px;
    }

    button {
        background-color: transparent;
        cursor: pointer;
        border: none;
    }

    .btn-delete svg {
        fill: rgb(192, 192, 192);
    }

    .btn-delete:hover svg {
        fill: #e74c3c;
    }

    .btn-more-options svg {
        fill: rgb(192, 192, 192);
    }

    .btn-more-options:hover svg {
        fill: #2f80ed;
    }
</style>
