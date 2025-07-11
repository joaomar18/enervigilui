<script lang="ts">
    import Selector from "../../General/Selector.svelte";
    import InputField from "../../General/InputField.svelte";
    import Checkbox from "../../General/Checkbox.svelte";
    import { validateNodeName, validateNodeUnit, validateCommunicationID } from "$lib/ts/nodes";

    import { Protocol, NodeType, NodePhase } from "$lib/stores/nodes";
    import { defaultVariableUnits } from "$lib/stores/nodes";

    // Stores for multi-language support
    import { variableNameTexts, variableNameTextsByPhase } from "$lib/stores/lang";

    // Props
    export let variablePhase: NodePhase;
    export let variableName: string;
    export let variableUnit: string;
    export let variableProtocol: Protocol;
    export let communicationID: string;
    export let variableType: NodeType;
    export let customVariable: boolean;
    export let publishVariable: boolean;
    export let virtualVariable: boolean;
    export let logVariable: boolean;
    export let enableMinAlarm: boolean;
    export let enableMaxAlarm: boolean;
    export let enable: boolean;

    // Variables
    let oldVariableName: string = variableName;
    let oldVariableUnit: string = variableUnit;
    let customVariableChanged: boolean = customVariable;

    let disabledUnit: boolean = false;

    // Export Funcions
    export let onVariableNameChanged: (variableName: string) => void = () => {};
    export let onVariableUnitChanged: (variableUnit: string) => void = () => {};
    export let onVariableTypeChanged: (variableType: NodeType) => void = () => {};
    export let onCommunicationIDChanged: (communicationID: string) => void = () => {};
    export let onCustomVariableChanged: (customVariable: boolean) => void = () => {};
    export let onPublishVariableChanged: (publishVariable: boolean) => void = () => {};
    export let onVirtualVariableChanged: (virtualVariable: boolean) => void = () => {};
    export let onLogVariableChanged: (logVariable: boolean) => void = () => {};
    export let onEnableMinAlarmChanged: (enableMinAlarm: boolean) => void = () => {};
    export let onEnableMaxAlarmChanged: (enableMaxAlarm: boolean) => void = () => {};
    export let onEnableChanged: (enable: boolean) => void = () => {};

    // Reactive statements
    $: onVariableNameChanged(variableName);
    $: onVariableUnitChanged(variableUnit);
    $: {
        if (variableType === NodeType.FLOAT || variableType === NodeType.INT) {
            if ($defaultVariableUnits[variableName]) {
                variableUnit = $defaultVariableUnits[variableName][0];
            } else {
                variableUnit = "";
                disabledUnit = false;
            }
        } else if (variableType === NodeType.STRING || variableType === NodeType.BOOLEAN) {
            variableUnit = "";
            disabledUnit = true;
        }
    }
    $: onVariableTypeChanged(variableType);
    $: onCommunicationIDChanged(communicationID);
    $: {
        if (customVariable && !customVariableChanged) {
            oldVariableName = variableName;
            oldVariableUnit = variableUnit;
            variableName = "";
            variableUnit = "";
            customVariableChanged = true;
        } else if (!customVariable && customVariableChanged) {
            variableName = oldVariableName;
            variableUnit = oldVariableUnit;
            customVariableChanged = false;
        }
        onCustomVariableChanged(customVariable);
    }
    $: onPublishVariableChanged(publishVariable);
    $: {
        if (virtualVariable) {
            communicationID = "";
        }
        onVirtualVariableChanged(virtualVariable);
    }
    $: onLogVariableChanged(logVariable);
    $: onEnableMinAlarmChanged(enableMinAlarm);
    $: onEnableMaxAlarmChanged(enableMaxAlarm);
    $: onEnableChanged(enable);
</script>

<tr class="editing">
    <td>
        <div class="cell-content">
            {#if !customVariable}
                <Selector
                    useLang={true}
                    options={$variableNameTextsByPhase[variablePhase]}
                    bind:selectedOption={variableName}
                    inputBadFormat={!validateNodeName(variableName, customVariable)}
                    firstSubmission={true}
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
                    bind:inputValue={variableName}
                    inputBadFormat={!validateNodeName(variableName, customVariable)}
                    firstSubmission={true}
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
            {#if !customVariable}
                <Selector
                    options={Object.fromEntries($defaultVariableUnits[variableName]?.map((unit) => [unit, unit]) || [])}
                    bind:selectedOption={variableUnit}
                    inputBadFormat={!validateNodeUnit(variableName, variableType, variableUnit, customVariable)}
                    firstSubmission={true}
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
                    bind:inputValue={variableUnit}
                    disabled={disabledUnit}
                    inputBadFormat={!validateNodeUnit(variableName, variableType, variableUnit, customVariable)}
                    firstSubmission={true}
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
            <InputField
                disabled={virtualVariable}
                bind:inputValue={communicationID}
                inputBadFormat={!validateCommunicationID(communicationID, variableProtocol)}
                firstSubmission={true}
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
        </div>
    </td>
    <td>
        <div class="cell-content">
            <Checkbox
                bind:checked={customVariable}
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
                bind:checked={publishVariable}
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
                bind:checked={virtualVariable}
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
                bind:checked={logVariable}
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
                bind:checked={enableMinAlarm}
                inputName="minimum-alarm-enabled"
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
                bind:checked={enableMaxAlarm}
                inputName="maximum-alarm-enable"
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
                bind:checked={enable}
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
        <div class="cell-content">
            <button class="btn-more-options" aria-label="More Options">
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
    tr.editing {
        background-color: rgba(255, 255, 255, 0.05);
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

    .btn-more-options {
        background-color: transparent;
        cursor: pointer;
        border: none;
    }

    .btn-more-options svg {
        fill: rgb(192, 192, 192);
    }

    .btn-more-options:hover svg {
        fill: rgb(255, 255, 255);
    }
</style>
