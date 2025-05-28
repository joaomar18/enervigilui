<script lang="ts">
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

    $: console.log(`Meter Type: ${meterType}, Selected Protocol: ${selectedProtocol}`);
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
                    <tr>
                        <td></td>
                    </tr>

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

    table th.max-width,
    table td.max-width {
        width: max-content;
        min-width: 100px;
    }

    table th.min-width,
    table td.min-width {
        width: 70px;
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
        border-left: none;
        border-right: none;
    }
</style>
