<script lang="ts">
    import NodeRow from "./NodeRow.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Props
    export let selectedProtocol: string;
    export let meterType: string;
    export let nodes: Object = {};

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
    let commID: string;

    // Functions

    function removePrefix(name: string) {
        return name.replace(/^(l1_|l2_|l3_|total_)/, "");
    }

    function getCommunicationID(node: any): string | undefined {
        if (selectedProtocol === "OPC_UA") {
            return node?.config?.node_id;
        }
        if (selectedProtocol === "MODBUS_RTU") {
            if (node?.config?.register !== undefined) {
                return "0x" + Number(node.config.register).toString(16).toUpperCase().padStart(4, "0");
            }
        }
        return undefined;
    }

    // Convert the nodes object to an array with the node names included
    $: nodesArray = Object.entries(nodes || {}).map(([name, node]) => ({
        name,
        displayName: removePrefix(name),
        communicationID: getCommunicationID(node),
        ...node,
    }));

    // Nodes separated by section and ordered alphabetically
    $: l1Nodes = nodesArray
        .filter(
            (node) =>
                node.name?.startsWith("l1_") &&
                !node.name?.startsWith("l1_l2") &&
                !node.name?.startsWith("l1_l3")
        )
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
    $: l2Nodes = nodesArray
        .filter(
            (node) =>
                node.name?.startsWith("l2_") &&
                !node.name?.startsWith("l2_l1") &&
                !node.name?.startsWith("l2_l3")
        )
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
    $: l3Nodes = nodesArray
        .filter(
            (node) =>
                node.name?.startsWith("l3_") &&
                !node.name?.startsWith("l3_l1") &&
                !node.name?.startsWith("l3_l2")
        )
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
    $: totalNodes = nodesArray
        .filter((node) => node.name?.startsWith("total_"))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));

    $: usedNames = new Set([
        ...l1Nodes.map((n) => n.name),
        ...l2Nodes.map((n) => n.name),
        ...l3Nodes.map((n) => n.name),
        ...totalNodes.map((n) => n.name),
    ]);

    $: generalNodes = nodesArray
        .filter((node) => !usedNames.has(node.name))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));


    $: console.log("L1 Communication IDs:", l1Nodes.map(n => n.communicationID));

    $: console.log(nodes);
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
                        <th style="width: 150px;" class="mid-width"
                            >{$texts.opcuaID[$selectedLang]}</th
                        >
                    {:else if selectedProtocol === "MODBUS_RTU"}
                        <th style="width: 150px;" class="mid-width"
                            >{$texts.modbusRegister[$selectedLang]}</th
                        >
                    {/if}
                    <th class="min-width">{$texts.custom[$selectedLang]}</th>
                    <th class="min-width">{$texts.publish[$selectedLang]}</th>
                    <th class="min-width">{$texts.virtual[$selectedLang]}</th>
                    <th class="min-width">{$texts.logging[$selectedLang]}</th>
                    <th class="min-width">{$texts.minAlarm[$selectedLang]}</th>
                    <th class="min-width">{$texts.maxAlarm[$selectedLang]}</th>
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
                        <td colspan="11">{$texts.l1Phase[$selectedLang]}</td>
                    </tr>
                    <!-- Variable Elements Definition-->
                    {#each l1Nodes as node (node.name)}
                        <NodeRow
                            bind:variableName={node.displayName}
                            bind:variableUnit={node.config.unit}
                            bind:communicationID={node.communicationID}
                            customVariable={false}
                            bind:publishVariable={node.config.publish}
                            bind:virtualVariable={node.config.calculated}
                            logVariable={node.config.logging}
                            enableMinAlarm={node.config.min_alarm}
                            enableMaxAlarm={node.config.max_alarm}
                            enable={true}
                        />
                    {/each}
                    <!--------------------------------->

                    <!--     L 2     N O D E S     -->
                    <tr class="sub-section">
                        <td colspan="11">{$texts.l2Phase[$selectedLang]}</td>
                    </tr>
                    {#each l2Nodes as node (node.name)}
                        <NodeRow
                            bind:variableName={node.displayName}
                            bind:variableUnit={node.config.unit}
                            bind:communicationID={node.communicationID}
                            customVariable={false}
                            bind:publishVariable={node.config.publish}
                            bind:virtualVariable={node.config.calculated}
                            bind:logVariable={node.config.logging}
                            bind:enableMinAlarm={node.config.min_alarm}
                            bind:enableMaxAlarm={node.config.max_alarm}
                            enable={true}
                        />
                    {/each}
                    <!--     L 3     N O D E S     -->
                    <tr class="sub-section">
                        <td colspan="11">{$texts.l3Phase[$selectedLang]}</td>
                    </tr>
                    {#each l3Nodes as node (node.name)}
                        <NodeRow
                            bind:variableName={node.displayName}
                            bind:variableUnit={node.config.unit}
                            bind:communicationID={node.communicationID}
                            customVariable={false}
                            bind:publishVariable={node.config.publish}
                            bind:virtualVariable={node.config.calculated}
                            bind:logVariable={node.config.logging}
                            bind:enableMinAlarm={node.config.min_alarm}
                            bind:enableMaxAlarm={node.config.max_alarm}
                            enable={true}
                        />
                    {/each}

                    <!--     T O T A L     N O D E S     -->
                    <tr class="sub-section">
                        <td colspan="11">{$texts.total[$selectedLang]}</td>
                    </tr>
                    {#each totalNodes as node (node.name)}
                        <NodeRow
                            bind:variableName={node.displayName}
                            bind:variableUnit={node.config.unit}
                            bind:communicationID={node.communicationID}
                            customVariable={false}
                            bind:publishVariable={node.config.publish}
                            bind:virtualVariable={node.config.calculated}
                            bind:logVariable={node.config.logging}
                            bind:enableMinAlarm={node.config.min_alarm}
                            bind:enableMaxAlarm={node.config.max_alarm}
                            enable={true}
                        />
                    {/each}

                    <!--     G E N E R A L     N O D E S     -->
                    <tr class="sub-section">
                        <td colspan="11">{$texts.general[$selectedLang]}</td>
                    </tr>
                    {#each generalNodes as node (node.name)}
                        <NodeRow
                            bind:variableName={node.displayName}
                            bind:variableUnit={node.config.unit}
                            bind:communicationID={node.communicationID}
                            customVariable={false}
                            bind:publishVariable={node.config.publish}
                            bind:virtualVariable={node.config.calculated}
                            bind:logVariable={node.config.logging}
                            bind:enableMinAlarm={node.config.min_alarm}
                            bind:enableMaxAlarm={node.config.max_alarm}
                            enable={true}
                        />
                    {/each}
                {:else if meterType === "SINGLE_PHASE"}
                    {#each nodesArray as node (node.name)}
                        <NodeRow
                            bind:variableName={node.variable}
                            bind:variableUnit={node.config.unit}
                            bind:communicationID={node.communicationID}
                            customVariable={false}
                            bind:publishVariable={node.config.publish}
                            bind:virtualVariable={node.config.calculated}
                            bind:logVariable={node.config.logging}
                            bind:enableMinAlarm={node.config.min_alarm}
                            bind:enableMaxAlarm={node.config.max_alarm}
                            enable={true}
                        />
                    {/each}
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

    table th.max-width,
    table td.max-width {
        width: max-content;
        min-width: 100px;
    }

    table th.min-width,
    table td.min-width {
        width: 90px;
    }

    table th.super-min-width,
    table td.super-min-width {
        width: 50px;
    }

    table .sub-section {
        width: 100%;
        margin:0;
        padding:0;
        height: 25px;
        background-color: var(--sub-section-background-color);
        color: var(--sub-section-text-color);
        border: 1px solid var(--sub-section-border-color);
        font-size: 0.9rem;
        border-left: none;
        border-right: none;
    }
</style>
