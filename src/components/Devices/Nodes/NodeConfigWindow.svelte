<script lang="ts">
    import HintInfo from "../../General/HintInfo.svelte";
    import InputField from "../../General/InputField.svelte";
    import Checkbox from "../../General/Checkbox.svelte";
    import Selector from "../../General/Selector.svelte";
    import type { EditableDeviceMeter } from "$lib/stores/devices";
    import type { FormattedNode, NodePhase } from "$lib/stores/nodes";
    import { NodeType } from "$lib/stores/nodes";
    import { Protocol } from "$lib/stores/devices";
    import ModalWindow from "../../General/ModalWindow.svelte";
    import { getNodePrefix } from "$lib/stores/nodes";
    import { nodeNameChange } from "$lib/ts/nodes";
    import { validateNodeName, validateNodeUnit, validateCommunicationID, validateNodeType, validateVirtualNode } from "$lib/ts/nodes";
    import { showAlert } from "$lib/stores/alerts";

    // Stores for variable definitions
    import { defaultVariables, defaultVariableUnits } from "$lib/stores/nodes";

    // Stores for multi-language support
    import { texts, variableNameTextsByPhase, selectedLang } from "$lib/stores/lang";

    // Props
    export let visible: boolean;
    export let deviceData: EditableDeviceMeter;
    export let node: FormattedNode;
    export let section: NodePhase;
    export let sectionNodes: Array<FormattedNode>;

    // Variables
    let langVariableName: Record<string, string>;
    let variableName: string;
    let sectionName: Record<string, string>;

    let oldVariableName: string = node.displayName;
    let oldVariableUnit: string = node.config.unit;
    let oldVariableType: NodeType = node.config.type;
    let oldCommunicationID: string | undefined = node.communicationID;

    let disabledUnit: boolean = false;
    let disabledCommIDString: string = "";
    let strloggingPeriod: string;
    let strMinAlarm: string;
    let strMaxAlarm: string;

    $: strloggingPeriod = String(node.config.logging_period);
    $: strMinAlarm = String(node.config.min_alarm_value);
    $: strMaxAlarm = String(node.config.max_alarm_value);
    $: sectionName = $texts[section.toLowerCase()];

    $: if (node) {
        if (node.config.custom) {
            variableName = node.displayName;
        } else {
            const defaultVariable = Object.values($defaultVariables).filter((variable) => variable.name === node.displayName);
            if (defaultVariable) {
                langVariableName = $variableNameTextsByPhase[section][node.displayName];
            } else {
                langVariableName = $texts.notFound;
            }
        }
    }

    // Export Funcions
    export let onPropertyChanged: () => void;

    // Functions
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
        } else if (!node.config.calculated && node.communicationID === undefined) {
            node.communicationID = oldCommunicationID ? oldCommunicationID : "";
            node.protocol = deviceData.protocol;
        }
    }
</script>

<ModalWindow
    customTitle={true}
    width="100%"
    maxWidth="750px"
    height="fit-content"
    maxHeight="1050px"
    borderRadius="10px"
    borderColor="#2a2e3a"
    backgroundColor="#14161c"
    closeWindow={() => {
        visible = false;
    }}
>
    <span slot="header" class="header">
        <span class="header-section">
            <span class="main-text">{`${$texts.variable[$selectedLang]}:`}</span>
            {#if !node.config.custom}
                <span class="sub-text">{langVariableName[$selectedLang]}</span>
            {:else}
                <span class="sub-text">{variableName}</span>
            {/if}
        </span>
        <span class="header-section">
            <span class="main-text">{`${$texts.section[$selectedLang]}:`}</span>
            <span class="sub-text">{sectionName[$selectedLang]}</span>
        </span>
        <span class="header-section">
            <span class="main-text">{`${$texts.protocol[$selectedLang]}:`}</span>
            <span class="sub-text">{node.protocol}</span>
        </span>
    </span>
    <div class="node-config-div">
        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.variable[$selectedLang]}</span>
                <span class="row-input">
                    <span class="row-entry">
                        {#if !node.config.custom}
                            <Selector
                                useLang={true}
                                options={$variableNameTextsByPhase[section]}
                                bind:selectedOption={node.displayName}
                                onChange={() => {
                                    nodeNameChange(node, section);
                                    onPropertyChanged();
                                }}
                                inputInvalid={!validateNodeName(node.displayName, node.config.custom, sectionNodes)}
                                enableInputInvalid={true}
                                scrollable={true}
                                maxOptions={5}
                                width="100%"
                                height="40px"
                                optionHeight="40px"
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
                                width="100%"
                                height="40px"
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
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">
                                {#if !node.config.custom}
                                    {$texts.variableInfo[$selectedLang]}
                                {:else}
                                    {$texts.variableCustomInfo[$selectedLang]}
                                {/if}
                            </span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>

        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.unit[$selectedLang]}</span>
                <span class="row-input">
                    <span class="row-entry">
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
                                width="100%"
                                height="40px"
                                optionHeight="40px"
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
                                bind:inputValue={node.displayName}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputInvalid={!validateNodeName(node.displayName, node.config.custom, sectionNodes)}
                                enableInputInvalid={true}
                                inputType="STRING"
                                width="100%"
                                height="40px"
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
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">
                                {#if !node.config.custom}
                                    {$texts.unitInfo[$selectedLang]}
                                {:else}
                                    {$texts.unitCustomInfo[$selectedLang]}
                                {/if}</span
                            >
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>

        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">
                    {#if deviceData.protocol === Protocol.OPC_UA}
                        {$texts.opcuaID[$selectedLang]}
                    {:else if deviceData.protocol === Protocol.MODBUS_RTU}
                        {$texts.modbusRegister[$selectedLang]}
                    {/if}</span
                >
                <span class="row-input">
                    <span class="row-entry">
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
                                width="100%"
                                height="40px"
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
                                inputType="STRING"
                                width="100%"
                                height="40px"
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
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">
                                {#if deviceData.protocol === Protocol.OPC_UA}
                                    {$texts.nodespaceInfo[$selectedLang]}
                                {:else if deviceData.protocol === Protocol.MODBUS_RTU}
                                    {$texts.registerInfo[$selectedLang]}
                                {:else}
                                    {$texts.nocommInfo[$selectedLang]}
                                {/if}
                            </span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.type[$selectedLang]}</span>
                <span class="row-input">
                    <span class="row-entry">
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
                            width="100%"
                            height="40px"
                            optionHeight="40px"
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
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.typeInfo[$selectedLang]}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.loggingPeriod[$selectedLang]}</span>
                <span class="row-input">
                    <span class="row-entry">
                        <InputField
                            disabled={!node.config.logging}
                            bind:inputValue={strloggingPeriod}
                            onChange={() => {
                                node.config.logging_period = Number(strloggingPeriod);
                                onPropertyChanged();
                            }}
                            inputType="POSITIVE_INT"
                            minValue={1}
                            maxValue={1440}
                            limitsPassed={() => {
                                showAlert($texts.loggingPeriodError, {
                                    minValue: 1,
                                    maxValue: 1440,
                                });
                            }}
                            inputUnit="min."
                            width="100%"
                            height="40px"
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
                        <Checkbox
                            bind:checked={node.config.logging}
                            onChange={() => {
                                onPropertyChanged();
                            }}
                            inputName="log-node"
                            width="38px"
                            height="38px"
                            checkMarkWidth={24}
                            checkMarkHeight={24}
                            enabledbgColor="#2f80ed"
                            enabledBorderColor="#5a646e"
                            disabledbgColor="#42505f"
                            disabledBorderColor="#5a646e"
                        />
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.loggingInfo[$selectedLang]}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.minValue[$selectedLang]}</span>
                <span class="row-input">
                    <span class="row-entry">
                        <InputField
                            disabled={(node.config.type !== NodeType.FLOAT && node.config.type !== NodeType.INT) || !node.config.min_alarm}
                            bind:inputValue={strMinAlarm}
                            onChange={() => {
                                node.config.min_alarm_value = Number(strMinAlarm);
                                onPropertyChanged();
                            }}
                            inputType={node.config.type}
                            inputUnit={node.config.unit}
                            width="100%"
                            height="40px"
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
                        <Checkbox
                            bind:checked={node.config.min_alarm}
                            onChange={() => {
                                onPropertyChanged();
                            }}
                            inputName="node-min-alarm"
                            width="38px"
                            height="38px"
                            checkMarkWidth={24}
                            checkMarkHeight={24}
                            enabledbgColor="#2f80ed"
                            enabledBorderColor="#5a646e"
                            disabledbgColor="#42505f"
                            disabledBorderColor="#5a646e"
                        />
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.minValueInfo[$selectedLang]}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable">
                <span class="row-identifier">{$texts.maxValue[$selectedLang]}</span>
                <span class="row-input">
                    <span class="row-entry">
                        <InputField
                            disabled={(node.config.type !== NodeType.FLOAT && node.config.type !== NodeType.INT) || !node.config.max_alarm}
                            bind:inputValue={strMaxAlarm}
                            onChange={() => {
                                node.config.max_alarm_value = Number(strMaxAlarm);
                                onPropertyChanged();
                            }}
                            inputType={node.config.type}
                            inputUnit={node.config.unit}
                            width="100%"
                            height="40px"
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
                        <Checkbox
                            bind:checked={node.config.max_alarm}
                            onChange={() => {
                                onPropertyChanged();
                            }}
                            inputName="node-max-alarm"
                            width="38px"
                            height="38px"
                            checkMarkWidth={24}
                            checkMarkHeight={24}
                            enabledbgColor="#2f80ed"
                            enabledBorderColor="#5a646e"
                            disabledbgColor="#42505f"
                            disabledBorderColor="#5a646e"
                        />
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.maxValueInfo[$selectedLang]}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.custom[$selectedLang]}</span>
                <span class="row-input">
                    <span class="row-entry">
                        <Checkbox
                            bind:checked={node.config.custom}
                            onChange={() => {
                                customNodeChange();
                                onPropertyChanged();
                            }}
                            inputName="custom-node"
                            width="38px"
                            height="38px"
                            checkMarkWidth={24}
                            checkMarkHeight={24}
                            enabledbgColor="#2f80ed"
                            enabledBorderColor="#5a646e"
                            disabledbgColor="#42505f"
                            disabledBorderColor="#5a646e"
                        />
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.customInfo[$selectedLang]}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.publish[$selectedLang]}</span>
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
                            checkMarkWidth={24}
                            checkMarkHeight={24}
                            enabledbgColor="#2f80ed"
                            enabledBorderColor="#5a646e"
                            disabledbgColor="#42505f"
                            disabledBorderColor="#5a646e"
                        />
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.publishInfo[$selectedLang]}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.virtual[$selectedLang]}</span>
                <span class="row-input">
                    <span class="row-entry">
                        <Checkbox
                            bind:checked={node.config.calculated}
                            onChange={() => {
                                virtualNodeChange();
                                onPropertyChanged();
                            }}
                            inputInvalid={!validateVirtualNode(node.displayName, node.config.custom)}
                            enableInputInvalid={true}
                            inputName="virtual-node"
                            width="38px"
                            height="38px"
                            checkMarkWidth={24}
                            checkMarkHeight={24}
                            enabledbgColor="#2f80ed"
                            enabledBorderColor="#5a646e"
                            disabledbgColor="#42505f"
                            disabledBorderColor="#5a646e"
                            badFormatBackgroundColor="#e74c3c"
                            badFormatBorderColor="#5a646e"
                        />
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            openInverted={true}
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.virtualInfo[$selectedLang]}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.incrementalNode[$selectedLang]}</span>
                <span class="row-input">
                    <span class="row-entry">
                        <Checkbox
                            bind:checked={node.config.incremental_node}
                            onChange={() => {
                                onPropertyChanged();
                            }}
                            inputName="incremental-node"
                            width="38px"
                            height="38px"
                            checkMarkWidth={24}
                            checkMarkHeight={24}
                            enabledbgColor="#2f80ed"
                            enabledBorderColor="#5a646e"
                            disabledbgColor="#42505f"
                            disabledBorderColor="#5a646e"
                            badFormatBackgroundColor="#e74c3c"
                            badFormatBorderColor="#5a646e"
                        />
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            openInverted={true}
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.incrementalNodeInfo[$selectedLang]}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
        {#if node.config.incremental_node}
            <div class="row">
                <span class="row-variable no-wrap">
                    <span class="row-identifier">{$texts.positiveIncrement[$selectedLang]}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <Checkbox
                                bind:checked={node.config.positive_incremental}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputName="positive-increment-node"
                                width="38px"
                                height="38px"
                                checkMarkWidth={24}
                                checkMarkHeight={24}
                                enabledbgColor="#2f80ed"
                                enabledBorderColor="#5a646e"
                                disabledbgColor="#42505f"
                                disabledBorderColor="#5a646e"
                                badFormatBackgroundColor="#e74c3c"
                                badFormatBorderColor="#5a646e"
                            />
                        </span>
                        <span class="row-hint">
                            <HintInfo
                                openInverted={true}
                                labelText=""
                                hintWidth="250px"
                                hintHeight="fit-content"
                                hintBackgroundColor="#1e242b"
                                hintBorderColor="#2c343d"
                                hintBorderRadius="10px"
                                textColor="#f5f5f5"
                                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                                openStrokeColor="#cccccc"
                                openHoverStrokeColor="#eeeeee"
                                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                                closeStrokeColor="white"
                                closeHoverStrokeColor="#eeeeee"
                            >
                                <span class="info-text">{$texts.positiveIncrementInfo[$selectedLang]}</span>
                            </HintInfo>
                        </span>
                    </span>
                </span>
            </div>
            <div class="row">
                <span class="row-variable no-wrap">
                    <span class="row-identifier">{$texts.calculateIncrement[$selectedLang]}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <Checkbox
                                bind:checked={node.config.calculate_increment}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputName="calculate-increment-node"
                                width="38px"
                                height="38px"
                                checkMarkWidth={24}
                                checkMarkHeight={24}
                                enabledbgColor="#2f80ed"
                                enabledBorderColor="#5a646e"
                                disabledbgColor="#42505f"
                                disabledBorderColor="#5a646e"
                                badFormatBackgroundColor="#e74c3c"
                                badFormatBorderColor="#5a646e"
                            />
                        </span>
                        <span class="row-hint">
                            <HintInfo
                                openInverted={true}
                                labelText=""
                                hintWidth="250px"
                                hintHeight="fit-content"
                                hintBackgroundColor="#1e242b"
                                hintBorderColor="#2c343d"
                                hintBorderRadius="10px"
                                textColor="#f5f5f5"
                                openBackgroundColor="rgba(255, 255, 255, 0.05)"
                                openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                                openStrokeColor="#cccccc"
                                openHoverStrokeColor="#eeeeee"
                                closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                                closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                                closeStrokeColor="white"
                                closeHoverStrokeColor="#eeeeee"
                            >
                                <span class="info-text">{$texts.calculateIncrementInfo[$selectedLang]}</span>
                            </HintInfo>
                        </span>
                    </span>
                </span>
            </div>
        {/if}
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.enabled[$selectedLang]}</span>
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
                            checkMarkWidth={24}
                            checkMarkHeight={24}
                            enabledbgColor="#2f80ed"
                            enabledBorderColor="#5a646e"
                            disabledbgColor="#42505f"
                            disabledBorderColor="#5a646e"
                        />
                    </span>
                    <span class="row-hint">
                        <HintInfo
                            openInverted={true}
                            labelText=""
                            hintWidth="250px"
                            hintHeight="fit-content"
                            hintBackgroundColor="#1e242b"
                            hintBorderColor="#2c343d"
                            hintBorderRadius="10px"
                            textColor="#f5f5f5"
                            openBackgroundColor="rgba(255, 255, 255, 0.05)"
                            openHoverBackgroundColor="rgba(255, 255, 255, 0.1)"
                            openStrokeColor="#cccccc"
                            openHoverStrokeColor="#eeeeee"
                            closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                            closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                            closeStrokeColor="white"
                            closeHoverStrokeColor="#eeeeee"
                        >
                            <span class="info-text">{$texts.enabledInfo[$selectedLang]}</span>
                        </HintInfo>
                    </span>
                </span>
            </span>
        </div>
    </div>
</ModalWindow>

<style>
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

    .header .header-section {
        padding: 0;
        margin: 0;
    }

    .header .header-section .main-text {
        font-size: 1rem;
        color: #f5f5f5;
        font-weight: 400;
    }

    .header .header-section .sub-text {
        padding-left: 5px;
        padding-right: 10px;
        font-size: 1rem;
        color: rgb(147, 147, 147);
        font-weight: 300;
    }

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

    .row .row-variable.no-wrap {
        flex-direction: row;
        padding-top: 10px;
        padding-bottom: 10px;
        min-width: 250px;
    }

    .row .row-variable .row-identifier {
        font-size: 1rem;
        color: #f5f5f5;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        padding: 0;
        margin: 0;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 100%;
    }

    .row .row-variable.no-wrap .row-identifier {
        padding-bottom: 0px;
        padding-top: 0px;
        text-align: left;
    }

    .row .row-variable .row-input {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        min-width: 250px;
    }

    .row .row-variable.no-wrap .row-input {
        width: fit-content;
        min-width: auto;
    }

    .row .row-variable .row-input .row-entry {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 10px;
        width: 100%;
    }

    .row .row-variable.no-wrap .row-input .row-entry {
        width: 100%;
        min-width: auto;
        justify-content: end;
        gap: 0px;
    }

    @media (min-width: 880px) {
        .row {
            flex-direction: row;
        }

        .row .row-variable .row-input .row-hint {
            padding-left: 20px;
        }
    }

    .row-hint .info-text {
        padding: 10px;
        padding-right: 40px;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: white;
    }
</style>
