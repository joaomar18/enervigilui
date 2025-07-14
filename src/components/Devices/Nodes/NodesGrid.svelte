<script lang="ts">
    import NodeRow from "./NodeRow.svelte";
    import AddNode from "./AddNode.svelte";

    // Stores for variable definitions
    import { defaultVariables } from "$lib/stores/nodes";
    import { Protocol, NodePrefix, NodePhase, NodeType } from "$lib/stores/nodes";
    import type { DeviceNode, FormattedNode, NodeConfiguration, BaseNodeConfig, OPCUAConfig, ModbusRTUConfig } from "$lib/stores/nodes";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Props
    export let selectedProtocol: Protocol;
    export let meterID: number;
    export let meterType: string;
    export let nodes: Record<string, DeviceNode> = {}; // Input Nodes Configuration
    export let nodesFetched: boolean; // Nodes were fetched from the server
    export let formattedNodes: Array<FormattedNode> = []; // Output Nodes Configuration (Formatted)

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

    function getCommunicationID(node: DeviceNode): string | undefined {
        try {
            if (!node || !node.config) return undefined;

            //console.log("Node Config: ", { ...node.config });
            //console.log("Keys:", Object.keys(node.config));
            //console.log("Protocol from config:", node.config.protocol);

            const protocol = node.config.protocol;

            if (protocol === Protocol.OPC_UA && "node_id" in node.config) {
                const nodeId = node.config.node_id;
                return nodeId;
            } else if (protocol === Protocol.MODBUS_RTU && "register" in node.config) {
                const reg = node.config.register;
                return "0x" + Number(reg).toString(16).toUpperCase().padStart(4, "0");
            }

            return undefined;
        } catch (err) {
            console.error("[getComID] ERROR", err);
            return undefined;
        }
    }

    function handleNodePropertyUpdate(node: FormattedNode, newValue: any, propertyPath: string) {
        /*
        const paths = propertyPath.split(".");
        const updatedNode: FormattedNode = { ...node };
        let current: Record<string, any> = updatedNode;

        for (let i = 0; i < paths.length - 1; i++) {
            const key = paths[i];

            if (key === "config") {
                current[key] = { ...current[key] };
            }

            if (!(key in current)) {
                throw new Error(`Invalid property path: ${propertyPath}`);
            }

            current = current[key];
        }

        const lastKey = paths[paths.length - 1];
        const oldValue = current[lastKey];

        if (newValue !== oldValue) {
            current[lastKey] = newValue;
            updateNode(updatedNode);
        }
        */
    }

    function createNodeRowProps(node: FormattedNode, phase: NodePhase, prefix: NodePrefix) {
        return {
            variablePhase: phase,
            onVariableNameChanged: (newBaseName: string) => {
                /*
                const newName = addPrefix(newBaseName, prefix);
                const oldName = node.name;
                const defaultNodeProps = Object.values($defaultVariables).find((v) => v.variable === newName);

                if (oldName !== newName) {
                    node.name = newName;
                    node.displayName = newBaseName;
                    node.config.unit = defaultNodeProps?.defaultUnit || "";
                    updateNode(node);
                }
                */
            },
            onVariableUnitChanged: (newUnit: string) => handleNodePropertyUpdate(node, newUnit, "config.unit"),
            onCommunicationIDChanged: (newID: string | undefined) => handleNodePropertyUpdate(node, newID, "communicationID"),
            onVariableTypeChanged: (newType: string) => handleNodePropertyUpdate(node, newType, "config.type"),
            onCustomVariableChanged: (newValue: boolean) => handleNodePropertyUpdate(node, newValue, "config.custom"),
            onPublishVariableChanged: (newValue: boolean) => handleNodePropertyUpdate(node, newValue, "config.logging"),
            onVirtualVariableChanged: (newValue: boolean) => handleNodePropertyUpdate(node, newValue, "config.calculated"),
            onLogVariableChanged: (newValue: boolean) => handleNodePropertyUpdate(node, newValue, "config.logging"),
            onEnableMinAlarmChanged: (newValue: boolean) => handleNodePropertyUpdate(node, newValue, "config.min_alarm"),
            onEnableMaxAlarmChanged: (newValue: boolean) => handleNodePropertyUpdate(node, newValue, "config.max_alarm"),
            onEnableChanged: (newValue: boolean) => handleNodePropertyUpdate(node, newValue, "config.enabled"),
            onProtocolChanged: (newValue: Protocol) => handleNodePropertyUpdate(node, newValue, "protocol"),
            node: node,
        };
    }

    function updateNode(node: FormattedNode) {
        const formattedNodeIndex = formattedNodes.findIndex((n) => n === node);
        if (formattedNodeIndex !== -1) {
            formattedNodes[formattedNodeIndex] = node;
            formattedNodes = [...formattedNodes];
        }
    }

    function addNode(sectionPrefix: NodePrefix) {
        const nodeBaseName = ``;
        const fullNodeName = addPrefix(nodeBaseName, sectionPrefix);

        console.log("Selected protocol in addNode:", selectedProtocol);

        const newBaseConfiguration: BaseNodeConfig = {
            calculate_increment: true,
            calculated: false,
            custom: true,
            decimal_places: 2,
            enabled: true,
            incremental_node: false,
            logging: false,
            logging_period: 15,
            max_alarm: false,
            max_alarm_value: 0.0,
            min_alarm: false,
            min_alarm_value: 0.0,
            positive_incremental: true,
            type: NodeType.FLOAT,
            unit: "",
            publish: true,
            protocol: selectedProtocol,
        };

        console.log("Base configuration:", newBaseConfiguration);
        console.log("Base configuration keys:", Object.keys(newBaseConfiguration));

        let newNodeConfiguration: NodeConfiguration;

        if (selectedProtocol === Protocol.MODBUS_RTU) {
            // Modbus RTU Protocol
            newNodeConfiguration = {
                ...newBaseConfiguration,
                register: 0,
            };
        } else if (selectedProtocol === Protocol.OPC_UA) {
            // OPC UA Protocol
            newNodeConfiguration = {
                ...newBaseConfiguration,
                node_id: "",
            };
        } else {
            throw new Error("Unsupported protocol");
        }

        //console.log("Final node configuration:", newNodeConfiguration);
        //console.log("Final node configuration keys:", Object.keys(newNodeConfiguration));

        const newNode: DeviceNode = {
            device_id: meterID,
            name: fullNodeName,
            protocol: selectedProtocol,
            config: newNodeConfiguration,
        };

        //console.log("New node before getCommunicationID:", newNode);

        const newFormattedNode: FormattedNode = {
            ...newNode,
            displayName: nodeBaseName,
            communicationID: getCommunicationID(newNode),
        };

        formattedNodes = [...formattedNodes, newFormattedNode];
    }

    function deleteNode(node: FormattedNode) {
        const formattedNodeIndex = formattedNodes.findIndex((n) => n === node);
        if (formattedNodeIndex !== -1) {
            formattedNodes = [...formattedNodes.slice(0, formattedNodeIndex), ...formattedNodes.slice(formattedNodeIndex + 1)];
        }
    }

    // Variables
    let initialized: boolean = false;

    // Format and sort nodes only on initial load
    $: if (nodesFetched && !initialized) {
        initialized = true;
        formattedNodes = Object.entries(nodes)
            .map(([name, node]) => {
                //console.log("Node ", node.name, " Keys: ", Object.keys(node.config));

                const formatted: FormattedNode = {
                    ...node,
                    displayName: removePrefix(name),
                    communicationID: getCommunicationID(node),
                };
                //console.log("Created formatted node:", formatted);
                return formatted;
            })
            .sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

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
    $: nodesBySection = nodeSections.reduce(
        (acc: Record<NodePhase, Array<any>>, section) => {
            acc[section.key] = formattedNodes.filter(section.filter);
            return acc;
        },
        {} as Record<NodePhase, Array<FormattedNode>>,
    );
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
                        {#each nodesBySection[section.key] as node, i (i)}
                            <NodeRow
                                sectionNodes={nodesBySection[section.key]}
                                backgroundColor="rgba(255, 255, 255, 0.05)"
                                onDelete={() => deleteNode(node)}
                                onConfig={() => {}}
                                {selectedProtocol}
                                {...createNodeRowProps(node, section.phase, section.prefix)}
                            />
                        {/each}
                        <AddNode backgroundColor="rgba(255, 255, 255, 0.05)" onAddNode={() => addNode(section.prefix)} />
                    {/each}
                    <!--     S I N G L E     P H A S E     M E T E R S     -->
                {:else if meterType === "SINGLE_PHASE"}
                    {#each formattedNodes as node, i (i)}
                        <NodeRow
                            sectionNodes={formattedNodes}
                            backgroundColor="rgba(255, 255, 255, 0.05)"
                            onDelete={() => deleteNode(node)}
                            onConfig={() => {}}
                            {selectedProtocol}
                            {...createNodeRowProps(node, NodePhase.SINGLEPHASE, NodePrefix.SINGLEPHASE)}
                        />
                    {/each}
                    <AddNode backgroundColor="rgba(255, 255, 255, 0.05)" onAddNode={() => addNode(NodePrefix.SINGLEPHASE)} />
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
