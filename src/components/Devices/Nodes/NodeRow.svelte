<script lang="ts">
    import Selector from "../../General/Selector.svelte";
    import InputField from "../../General/InputField.svelte";
    import Checkbox from "../../General/Checkbox.svelte";
    import { validateNodeName, validateNodeUnit, validateCommunicationID, validateNodeType } from "$lib/ts/nodes";
    import { Protocol } from "$lib/stores/devices";
    import { NodeType, NodePhase } from "$lib/stores/nodes";
    import type { FormattedNode, NodePrefix } from "$lib/stores/nodes";
    import { defaultVariables, defaultVariableUnits } from "$lib/stores/nodes";

    // Stores for multi-language support
    import { variableNameTexts, variableNameTextsByPhase } from "$lib/stores/lang";

    // Props
    export let sectionNodes: Array<FormattedNode>;
    export let selectedProtocol: Protocol;
    export let nodePhase: NodePhase;
    export let nodePrefix: NodePrefix;
    export let node: FormattedNode;

    // Layout / styling props
    export let backgroundColor: string;
    export let disabledBackgroundColor: string = backgroundColor;

    // Variables
    let oldVariableName: string = node.displayName;
    let oldVariableUnit: string = node.config.unit;
    let oldVariableType: NodeType = node.config.type;
    let oldCommunicationID: string | undefined = node.communicationID;

    let disabledUnit: boolean = false;
    let disabledCommIDString: string = "";

    // Export Funcions
    export let onPropertyChanged: () => void;
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

    function nodeNameChange(): void {
        const newName = nodePrefix + node.displayName;
        node.name = newName;
        if (!node.config.custom) {
            const defaultNodeProps = Object.values($defaultVariables).find((v) => v.name === node.displayName);
            node.config.unit = defaultNodeProps?.defaultUnit || "";
        }
    }

    function nodeTypeChange(): void {
        if (!node.config.custom && oldVariableType !== node.config.type) {
            if (node.config.type === NodeType.FLOAT || node.config.type === NodeType.INT) {
                const defaultNodeProps = Object.values($defaultVariables).find((v) => v.name === node.displayName);
                node.config.unit = defaultNodeProps?.defaultUnit || "";
                disabledUnit = false;
            } else if (node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN) {
                node.config.unit = "";
                disabledUnit = true;
            }
            oldVariableType = node.config.type;
        }
    }

    function customNodeChange(): void {
        if (node.config.custom) {
            oldVariableName = node.displayName;
            oldVariableUnit = node.config.unit;
            node.displayName = "";
            node.config.unit = "";
        } else {
            node.displayName = oldVariableName;
            node.config.unit = oldVariableUnit;
        }
    }

    function virtualNodeChange(): void {
        if (node.config.calculated && node.communicationID !== undefined) {
            oldCommunicationID = node.communicationID;
            node.communicationID = undefined;
            node.protocol = Protocol.NONE;
        } else if (node.communicationID === undefined) {
            node.communicationID = oldCommunicationID;
            node.protocol = selectedProtocol;
        }
    }
</script>

<tr
    style="
        --background-color: {backgroundColor};
        --disabled-background-color: {disabledBackgroundColor};
    "
    class="edit-node"
    class:disabled={!node.config.enabled}
>
    <td>
        <div class="cell-content">
            {#if !node.config.custom}
                <Selector
                    useLang={true}
                    options={$variableNameTextsByPhase[nodePhase]}
                    bind:selectedOption={node.displayName}
                    onChange={() => {
                        nodeNameChange();
                        onPropertyChanged();
                    }}
                    inputInvalid={!validateNodeName(node.displayName, node.config.custom, sectionNodes)}
                    enableInputInvalid={true}
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
                    onChange={() => {
                        onPropertyChanged();
                    }}
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
                    onChange={() => {
                        onPropertyChanged();
                    }}
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
                    onChange={() => {
                        onPropertyChanged();
                    }}
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
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputInvalid={!validateCommunicationID(node.communicationID, node.protocol)}
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
                    onChange={() => {
                        onPropertyChanged();
                    }}
                    inputInvalid={!validateCommunicationID(node.communicationID, node.protocol)}
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
                onChange={() => {
                    nodeTypeChange();
                    onPropertyChanged();
                }}
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
                onChange={() => {
                    customNodeChange();
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
    <td>
        <div class="cell-content">
            <Checkbox
                bind:checked={node.config.calculated}
                onChange={() => {
                    virtualNodeChange();
                    onPropertyChanged();
                }}
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
                onChange={() => {
                    onPropertyChanged();
                }}
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
                onChange={() => {
                    onPropertyChanged();
                }}
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

    tr.edit-node.disabled {
        background-color: var(--disabled-background-color);
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
