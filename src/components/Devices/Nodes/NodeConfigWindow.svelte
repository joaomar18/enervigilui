<script lang="ts">
    import HintInfo from "../../General/HintInfo.svelte";
    import InputField from "../../General/InputField.svelte";
    import Checkbox from "../../General/Checkbox.svelte";
    import Selector from "../../General/Selector.svelte";
    import { Protocol } from "$lib/stores/devices";
    import ModalWindow from "../../General/ModalWindow.svelte";
    import { nodeNameChange, nodeTypeChange, customNodeChange, virtualNodeChange } from "$lib/ts/nodes";
    import { showAlert } from "$lib/stores/alerts";
    import { DECIMAL_PLACES_LIM, LOGGING_PERIOD_LIM, NodeType } from "$lib/stores/nodes";

    // Types
    import type { EditableDeviceMeter, NewDeviceMeter } from "$lib/stores/devices";
    import type { EditableDeviceNode, NodeEditState } from "$lib/stores/nodes";

    // Stores for variable definitions
    import { defaultVariableUnits } from "$lib/stores/nodes";

    // Stores for multi-language support
    import { texts, variableNameTextsByPhase, selectedLang } from "$lib/stores/lang";

    // Props
    export let visible: boolean;
    export let deviceData: EditableDeviceMeter | NewDeviceMeter;
    export let node: EditableDeviceNode;
    export let nodeEditingState: NodeEditState;

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
                <span class="sub-text">
                    {#if node.display_name !== "" && node.display_name !== undefined}
                        {$variableNameTextsByPhase[node.phase][node.display_name][$selectedLang] || $texts.notFound[$selectedLang]}
                    {/if}
                </span>
            {:else}
                <span class="sub-text">{node.display_name}</span>
            {/if}
        </span>
        <span class="header-section">
            <span class="main-text">{`${$texts.section[$selectedLang]}:`}</span>
            <span class="sub-text">{$texts[node.phase.toLocaleLowerCase()][$selectedLang]}</span>
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
                                bind:inputValue={node.display_name}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                inputInvalid={!node.validation.variableName}
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
                                bind:inputValue={node.config.unit}
                                onChange={() => {
                                    onPropertyChanged();
                                }}
                                disabled={node.config.type === NodeType.STRING || node.config.type === NodeType.BOOLEAN}
                                inputInvalid={!node.validation.variableUnit}
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
        {#if node.config.type === NodeType.FLOAT}
            <div class="row">
                <span class="row-variable">
                    <span class="row-identifier">{$texts.decimalPlaces[$selectedLang]}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <InputField
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
                                    showAlert($texts.decimalPlacesError, {
                                        minValue: DECIMAL_PLACES_LIM.MIN,
                                        maxValue: DECIMAL_PLACES_LIM.MAX,
                                    });
                                }}
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
                                <span class="info-text"> {$texts.decimalPlacesInfo[$selectedLang]}</span>
                            </HintInfo>
                        </span>
                    </span>
                </span>
            </div>
        {/if}
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
                        <InputField
                            disabled={node.config.calculated}
                            bind:inputValue={node.communication_id}
                            onChange={() => {
                                onPropertyChanged();
                            }}
                            inputInvalid={!node.validation.communicationID}
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
                                nodeTypeChange(node, nodeEditingState);
                                onPropertyChanged();
                            }}
                            inputInvalid={!node.validation.variableType}
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
                                showAlert($texts.loggingPeriodError, {
                                    minValue: LOGGING_PERIOD_LIM.MIN,
                                    maxValue: LOGGING_PERIOD_LIM.MAX,
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
                            inputInvalid={!node.validation.loggingPeriod}
                            enableInputInvalid={true}
                            inputName="log-node"
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
        {#if node.config.type === NodeType.FLOAT || node.config.type == NodeType.INT}
            <div class="row">
                <span class="row-variable">
                    <span class="row-identifier">{$texts.minValue[$selectedLang]}</span>
                    <span class="row-input">
                        <span class="row-entry">
                            <InputField
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
                                inputInvalid={!node.validation.minAlarm}
                                enableInputInvalid={true}
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
                                badFormatBackgroundColor="#e74c3c"
                                badFormatBorderColor="#5a646e"
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
                                bind:inputValue={node.config.max_alarm_value}
                                inputInvalid={!node.validation.maxAlarm}
                                enableInputInvalid={true}
                                onChange={() => {
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
                                inputInvalid={!node.validation.maxAlarm}
                                enableInputInvalid={true}
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
                                badFormatBackgroundColor="#e74c3c"
                                badFormatBorderColor="#5a646e"
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
        {/if}
        <div class="row">
            <span class="row-variable no-wrap">
                <span class="row-identifier">{$texts.custom[$selectedLang]}</span>
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
                                virtualNodeChange(node, nodeEditingState, deviceData.protocol);
                                onPropertyChanged();
                            }}
                            inputInvalid={!node.validation.calculated}
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
        {#if node.config.type === NodeType.FLOAT || node.config.type === NodeType.INT}
            <div class="row">
                <span class="row-variable no-wrap">
                    <span class="row-identifier">{$texts.incrementalNode[$selectedLang]}</span>
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
        {/if}
        {#if node.config.incremental_node}
            <div class="row">
                <span class="row-variable no-wrap">
                    <span class="row-identifier">{$texts.positiveIncrement[$selectedLang]}</span>
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
                                inputInvalid={!node.validation.calculate_increment}
                                enableInputInvalid={true}
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
        color: #f5f5f5;
        font-weight: 400;
    }

    /* Sub-label text in header */
    .header .header-section .sub-text {
        padding-left: 5px;
        padding-right: 10px;
        font-size: 1rem;
        color: rgb(147, 147, 147);
        font-weight: 300;
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
        font-weight: 400;
        line-height: 1.5;
        color: white;
    }
</style>
