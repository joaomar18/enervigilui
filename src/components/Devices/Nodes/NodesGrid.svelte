<script lang="ts">
    import NodeRow from "./NodeRow.svelte";
    import AddNode from "./AddNode.svelte";

    // Stores for variable definitions
    import { defaultVariables } from "$lib/stores/nodes";
    import { Protocol, NodePrefix, NodePhase } from "$lib/stores/nodes";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Props
    export let selectedProtocol: Protocol;
    export let meterType: string;
    export let nodes: Record<string, any> = {};

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

    // Functions
    function removePrefix(name: string): string {
        const prefixes = Object.values(NodePrefix).sort((a, b) => b.length - a.length);

        for (const prefix of prefixes) {
            if (name.startsWith(prefix)) {
                if (name.startsWith(NodePrefix.L1) && !name.startsWith(NodePrefix.L1_L2) && !name.startsWith(NodePrefix.L1_L3)) {
                    return name.slice(prefix.length);
                } else if (name.startsWith(NodePrefix.L2) && !name.startsWith(NodePrefix.L2_L1) && !name.startsWith(NodePrefix.L2_L3)) {
                    return name.slice(prefix.length);
                } else if (name.startsWith(NodePrefix.L3) && !name.startsWith(NodePrefix.L3_L1) && !name.startsWith(NodePrefix.L3_L2)) {
                    return name.slice(prefix.length);
                } else if (
                    name.startsWith(NodePrefix.L1_L2) ||
                    name.startsWith(NodePrefix.L1_L3) ||
                    name.startsWith(NodePrefix.L2_L1) ||
                    name.startsWith(NodePrefix.L2_L3) ||
                    name.startsWith(NodePrefix.L3_L1) ||
                    name.startsWith(NodePrefix.L3_L2)
                ) {
                    return name;
                } else {
                    return name.slice(prefix.length);
                }
            }
        }

        return name;
    }

    function addPrefix(name: string, prefix: string): string {
        return prefix + name;
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

    function createNodeRowProps(node: any, phase: NodePhase, prefix: NodePrefix) {
        return {
            variablePhase: phase,
            onVariableNameChanged: (newName: string) => {
                node.name = addPrefix(newName, prefix);
                node.displayName = newName;
                const defaultNodeProps = Object.values($defaultVariables).find((v) => v.variable === newName);
                node.config.unit = defaultNodeProps?.defaultUnit || "";
            },
            variableName: node.displayName,
            onVariableUnitChanged: (newUnit: string) => {
                node.config.unit = newUnit;
            },
            variableUnit: node.config.unit,
            onCommunicationIDChanged: (newID: string) => {
                node.communicationID = newID;
            },
            variableType: node.config.type,
            onVariableTypeChanged: (newType: string) => {
                node.config.type = newType;
            },
            communicationID: node.communicationID,
            onCustomVariableChanged: (newValue: boolean) => {
                node.config.custom = newValue;
            },
            customVariable: node.config.custom,
            onPublishVariableChanged: (newValue: boolean) => {
                node.config.publish = newValue;
            },
            publishVariable: node.config.publish,
            onVirtualVariableChanged: (newValue: boolean) => {
                node.config.calculated = newValue;
            },
            virtualVariable: node.config.calculated,
            onLogVariableChanged: (newValue: boolean) => {
                node.config.logging = newValue;
            },
            logVariable: node.config.logging,
            onEnableMinAlarmChanged: (newValue: boolean) => {
                node.config.min_alarm = newValue;
            },
            enableMinAlarm: node.config.min_alarm,
            onEnableMaxAlarmChanged: (newValue: boolean) => {
                node.config.max_alarm = newValue;
            },
            enableMaxAlarm: node.config.max_alarm,
            onEnableChanged: (newValue: boolean) => {
                node.config.enabled = newValue;
            },
            enable: node.config.enabled,
            variableProtocol: node.protocol,
        };
    }

    function addNodeToSection(sectionPrefix: NodePrefix) {
        // Generate a unique node name for the new empty node
        const timestamp = Date.now();
        const nodeBaseName = `new_node_${timestamp}`;
        const fullNodeName = addPrefix(nodeBaseName, sectionPrefix);

        // Create a new empty node with default configuration
        const newNode = {
            config: {
                type: "FLOAT",
                unit: "",
                custom: false,
                publish: true,
                calculated: false,
                logging: false,
                enabled: true,
                min_alarm: false,
                max_alarm: false,
            },
            protocol: selectedProtocol,
            name: fullNodeName,
            displayName: nodeBaseName,
            communicationID: "",
        };

        // Add the new node to the nodes object
        nodes = {
            ...nodes,
            [fullNodeName]: newNode,
        };
    }

    function deleteNode(nodeName: string) {
        // Create a new nodes object without the deleted node
        const { [nodeName]: deletedNode, ...remainingNodes } = nodes;
        nodes = remainingNodes;
    }

    // Variables

    // Nodes organized in an array and with processed display name and communication id
    $: nodesArray = Object.entries(nodes || {}).map(([name, node]) => ({
        name,
        displayName: removePrefix(name),
        communicationID: getCommunicationID(node),
        ...node,
    }));

    // Nodes sections for 3F meters (L1, L2, L3, Total, General)
    const nodeSections = [
        {
            key: NodePhase.L1,
            phase: NodePhase.L1,
            prefix: NodePrefix.L1,
            labelKey: "l1Phase",
            filter: (node: any) =>
                node.name?.startsWith(NodePrefix.L1) && !node.name?.startsWith(NodePrefix.L1_L2) && !node.name?.startsWith(NodePrefix.L1_L3),
        },
        {
            key: NodePhase.L2,
            phase: NodePhase.L2,
            prefix: NodePrefix.L2,
            labelKey: "l2Phase",
            filter: (node: any) =>
                node.name?.startsWith(NodePrefix.L2) && !node.name?.startsWith(NodePrefix.L2_L1) && !node.name?.startsWith(NodePrefix.L2_L3),
        },
        {
            key: NodePhase.L3,
            phase: NodePhase.L3,
            prefix: NodePrefix.L3,
            labelKey: "l3Phase",
            filter: (node: any) =>
                node.name?.startsWith(NodePrefix.L3) && !node.name?.startsWith(NodePrefix.L3_L1) && !node.name?.startsWith(NodePrefix.L3_L2),
        },
        {
            key: NodePhase.TOTAL,
            phase: NodePhase.TOTAL,
            prefix: NodePrefix.TOTAL,
            labelKey: "total",
            filter: (node: any) => node.name?.startsWith(NodePrefix.TOTAL),
        },
        {
            key: NodePhase.GENERAL,
            phase: NodePhase.GENERAL,
            prefix: NodePrefix.GENERAL,
            labelKey: "general",
            filter: (node: any) => {
                // General nodes are those that don't match any of the specific patterns above
                const isL1 =
                    node.name?.startsWith(NodePrefix.L1) && !node.name?.startsWith(NodePrefix.L1_L2) && !node.name?.startsWith(NodePrefix.L1_L3);
                const isL2 =
                    node.name?.startsWith(NodePrefix.L2) && !node.name?.startsWith(NodePrefix.L2_L1) && !node.name?.startsWith(NodePrefix.L2_L3);
                const isL3 =
                    node.name?.startsWith(NodePrefix.L3) && !node.name?.startsWith(NodePrefix.L3_L1) && !node.name?.startsWith(NodePrefix.L3_L2);
                const isTotal = node.name?.startsWith(NodePrefix.TOTAL);

                return !isL1 && !isL2 && !isL3 && !isTotal;
            },
        },
    ];

    // Get nodes from the original nodes array by section
    $: nodesBySection = nodeSections.reduce((acc: Record<string, any[]>, section) => {
        acc[section.key] = nodesArray.filter(section.filter).sort((a, b) => {
            // Check if either node is a newly created node (starts with "new_node_")
            const aIsNew = a.displayName.startsWith("new_node_");
            const bIsNew = b.displayName.startsWith("new_node_");

            // If one is new and the other isn't, put the new one at the end
            if (aIsNew && !bIsNew) return 1;
            if (!aIsNew && bIsNew) return -1;

            // If both are new, sort by creation time (timestamp in the name)
            if (aIsNew && bIsNew) {
                const aTimestamp = a.displayName.split("_").pop();
                const bTimestamp = b.displayName.split("_").pop();
                return parseInt(aTimestamp || "0") - parseInt(bTimestamp || "0");
            }

            // Otherwise, sort alphabetically
            return a.displayName.localeCompare(b.displayName);
        });
        return acc;
    }, {});
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
                        <th style="width: 150px;" class="mid-width">{$texts.opcuaID[$selectedLang]}</th>
                    {:else if selectedProtocol === "MODBUS_RTU"}
                        <th style="width: 150px;" class="mid-width">{$texts.modbusRegister[$selectedLang]}</th>
                    {/if}
                    <th style="width: 150px;" class="mid-width">{$texts.type[$selectedLang]}</th>
                    <th class="min-width">{$texts.custom[$selectedLang]}</th>
                    <th class="min-width">{$texts.publish[$selectedLang]}</th>
                    <th class="min-width">{$texts.virtual[$selectedLang]}</th>
                    <th class="min-width">{$texts.logging[$selectedLang]}</th>
                    <th class="min-width">{$texts.enabled[$selectedLang]}</th>
                    <th class="min-width">{$texts.actions[$selectedLang]}</th>
                </tr>
            </thead>
            <tbody>
                <!--     T H R E E     P H A S E     M E T E R S     -->
                {#if meterType === "THREE_PHASE"}
                    <!-- Render each node section -->
                    {#each nodeSections as section (section.key)}
                        <tr class="sub-section">
                            <td colspan="10">{$texts[section.labelKey][$selectedLang]}</td>
                        </tr>
                        {#each nodesBySection[section.key] as node (node.name)}
                            <NodeRow
                                backgroundColor="rgba(255, 255, 255, 0.05)"
                                onDelete={() => deleteNode(node.name)}
                                onConfig={() => {}}
                                {selectedProtocol}
                                {...createNodeRowProps(node, section.phase, section.prefix)}
                            />
                        {/each}
                        <AddNode backgroundColor="rgba(255, 255, 255, 0.05)" onAddNode={() => addNodeToSection(section.prefix)} />
                    {/each}
                    <!--     S I N G L E     P H A S E     M E T E R S     -->
                {:else if meterType === "SINGLE_PHASE"}
                    {#each nodesArray as node (node.name)}
                        <NodeRow
                            backgroundColor="rgba(255, 255, 255, 0.05)"
                            onDelete={() => deleteNode(node.name)}
                            onConfig={() => {}}
                            {selectedProtocol}
                            {...createNodeRowProps(node, NodePhase.SINGLEPHASE, NodePrefix.SINGLEPHASE)}
                        />
                    {/each}
                    <AddNode backgroundColor="rgba(255, 255, 255, 0.05)" onAddNode={() => addNodeToSection(NodePrefix.SINGLEPHASE)} />
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

    table tr td {
        height: 30px;
    }

    table th.max-width {
        width: max-content;
        min-width: 100px;
    }

    table th.mid-width {
        width: 150px;
        min-width: 150px;
        max-width: 150px;
    }

    table th.min-width {
        width: 85px;
        min-width: 85px;
        max-width: 85px;
    }

    table .sub-section {
        width: 100%;
        margin: 0;
        padding: 0;
        height: 25px;
        background-color: var(--sub-section-background-color);
        color: var(--sub-section-text-color);
        border: 1px solid var(--sub-section-border-color);
        font-size: 0.9rem;
        border-left: none;
        border-right: none;
    }
</style>
