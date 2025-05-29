<script lang="ts">
    import Selector from "../../General/Selector.svelte";
    import InputField from "../../General/InputField.svelte";
    import Checkbox from "../../General/Checkbox.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Props
    export let selectedProtocol: string;
    export let meterType: string;

    // Layout / styling props
    export let width: string;
    export let height: string;
    export let borderRadius: string = "";
    export let backgroundColor: string;
    export let borderColor: string = backgroundColor;
    export let headerBackgroundColor: string = backgroundColor;
    export let headerTextColor: string;
    export let subSectionBackgroundColor: string = backgroundColor;
    export let subSectionTextColor: string = headerTextColor;
    export let subSectionBorderColor: string = borderColor;

    // Variables
    let nodeIDDummy = "dummyNodeID"; // Dummy node ID for testing
    let dummyChecked01 = false;
</script>

<div
    style="
        --width: {width};
        --height: {height};
        --border-radius: {borderRadius};
        --background-color: {backgroundColor};
        --border-color: {borderColor};
        --header-background-color: {headerBackgroundColor};
        --header-text-color: {headerTextColor};
        --sub-section-background-color: {subSectionBackgroundColor};
        --sub-section-text-color: {subSectionTextColor};
        --sub-section-border-color: {subSectionBorderColor};
    "
    class="container"
>
    <div class="content">
        <table>
            <thead>
                <tr class="header">
                    <th class="max-width">{$texts.variable[$selectedLang]}</th>
                    <th class="min-width">{$texts.unit[$selectedLang]}</th>
                    {#if selectedProtocol === "OPC_UA"}
                        <th class="max-width">{$texts.opcuaID[$selectedLang]}</th>
                    {:else if selectedProtocol === "MODBUS_RTU"}
                        <th class="max-width">{$texts.modbusRegister[$selectedLang]}</th>
                    {/if}
                    <th class="min-width">{$texts.custom[$selectedLang]}</th>
                    <th class="min-width">{$texts.publish[$selectedLang]}</th>
                    <th class="min-width">{$texts.virtual[$selectedLang]}</th>
                    <th class="min-width">{$texts.enabled[$selectedLang]}</th>
                    <th class="super-min-width"
                        ><img src="/img/more.png" alt="More options" class="more-img" /></th
                    >
                </tr>
            </thead>
            <tbody>
                {#if meterType === "THREE_PHASE"}
                    <!--     L 1     N O D E S     -->
                    <tr class="sub-section">
                        <td colspan="8">{$texts.l1Phase[$selectedLang]}</td>
                    </tr>
                    <!-- Variable Elements Definition-->
                    <tr>
                        <td>
                            <div class="cell-content">
                                <Selector
                                    options={[]}
                                    selectedOption={null}
                                    width="90%"
                                    height="90%"
                                    borderRadius="5px"
                                    backgroundColor="#1a2027"
                                    selectedColor="#14566b"
                                    optionsBackgroundColor="#1e242b"
                                    optionsBorderColor="#323a45"
                                    fontSize="0.9rem"
                                    letterSpacing="0.5px"
                                    wordSpacing="1px"
                                    arrowWidth="16px"
                                    arrowHeight="16px"
                                    arrowRightPos="5px"
                                />
                            </div>
                        </td>
                        <td>
                            <div class="cell-content">
                                <Selector
                                    options={{ V: "V" }}
                                    selectedOption={"V"}
                                    width="90%"
                                    height="90%"
                                    borderRadius="5px"
                                    backgroundColor="#1a2027"
                                    selectedColor="#14566b"
                                    optionsBackgroundColor="#1e242b"
                                    optionsBorderColor="#323a45"
                                    letterSpacing="0.5px"
                                    fontSize="0.9rem"
                                    wordSpacing="1px"
                                    arrowWidth="16px"
                                    arrowHeight="16px"
                                    arrowRightPos="5px"
                                />
                            </div>
                        </td>
                        <td>
                            <div class="cell-content">
                                <InputField
                                    bind:inputValue={nodeIDDummy}
                                    inputType="STRING"
                                    width="90%"
                                    height="90%"
                                    borderRadius="5px"
                                    backgroundColor="#1a2027"
                                    selectedBackgroundColor="#1a2027"
                                    selectedBorderColor="#2F80ED"
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
                                    bind:checked={dummyChecked01}
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
                                    bind:checked={dummyChecked01}
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
                                    bind:checked={dummyChecked01}
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
                                    bind:checked={dummyChecked01}
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
                    </tr>
                    <!--------------------------------->

                    <!--     L 2     N O D E S     -->
                    <tr class="sub-section">
                        <td colspan="8">{$texts.l2Phase[$selectedLang]}</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>

                    <!--     L 3     N O D E S     -->
                    <tr class="sub-section">
                        <td colspan="8">{$texts.l3Phase[$selectedLang]}</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>

                    <!--     T O T A L     N O D E S     -->
                    <tr class="sub-section">
                        <td colspan="8">{$texts.total[$selectedLang]}</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>

                    <!--     G E N E R A L     N O D E S     -->
                    <tr class="sub-section">
                        <td colspan="8">{$texts.general[$selectedLang]}</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                {:else if meterType === "SINGLE_PHASE"}
                    <tr>
                        <td></td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style>
    .container {
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
    }

    .content {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }

    table thead .header {
        background-color: var(--header-background-color);
        height: 40px;
        color: var(--header-text-color);
    }

    table thead th {
        padding: 10px;
        padding-left: 0px;
        padding-right: 0px;
        box-sizing: border-box;
        color: var(--header-text-color);
        font-weight: 500;
        font-size: 1rem;
        white-space: nowrap;
        border-right: 1px solid var(--border-color);
    }

    table thead .header th:first-child {
        border-top-left-radius: var(--border-radius);
    }

    table thead .header th:last-child {
        border-top-right-radius: var(--border-radius);
        border-right: none;
    }

    table thead th .more-img {
        width: 16px;
        height: 16px;
    }

    table tr td {
        height: 30px;
    }

    table tr td .cell-content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
    }

    table th.max-width,
    table td.max-width {
        width: max-content;
        min-width: 100px;
    }

    table th.min-width,
    table td.min-width {
        width: 80px;
    }

    table th.super-min-width,
    table td.super-min-width {
        width: 50px;
    }

    table .sub-section {
        width: 100%;
        height: 25px;
        background-color: var(--sub-section-background-color);
        color: var(--sub-section-text-color);
        border: 1px solid var(--sub-section-border-color);
        font-size: 0.9rem;
        border-left: none;
        border-right: none;
    }
</style>
