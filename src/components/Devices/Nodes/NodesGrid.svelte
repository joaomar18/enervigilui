<script lang="ts">
    import NodeRow from "./NodeRow.svelte";
    import AddNode from "./AddNode.svelte";
    import { onMount, onDestroy } from "svelte";

    // Stores for variable definitions
    import { defaultVariables } from "$lib/stores/nodes";
    import { MeterType, Protocol, type EditableDeviceMeter } from "$lib/stores/devices";
    import { NodePrefix, NodePhase, NodeType } from "$lib/stores/nodes";

    // Types
    import type { DeviceNode, FormattedNode, NodeConfiguration, BaseNodeConfig } from "$lib/stores/nodes";
    import type { ColumnVisibilityMap } from "$lib/ts/nodes_gid";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Props
    export let deviceData: EditableDeviceMeter;
    export let nodes: Record<string, DeviceNode> = {}; // Input Nodes Configuration
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
        if (!node) return undefined;

        const protocol = node.protocol;

        if (protocol === Protocol.OPC_UA && "node_id" in node.config) {
            const nodeId = node.config.node_id;
            return nodeId;
        } else if (protocol === Protocol.MODBUS_RTU && "register" in node.config) {
            const reg = node.config.register;
            return "0x" + Number(reg).toString(16).toUpperCase().padStart(4, "0");
        }

        return undefined;
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
        };

        let newNodeConfiguration: NodeConfiguration;

        if (deviceData.protocol === Protocol.MODBUS_RTU) {
            // Modbus RTU Protocol
            newNodeConfiguration = {
                ...newBaseConfiguration,
                register: 0,
            };
        } else if (deviceData.protocol === Protocol.OPC_UA) {
            // OPC UA Protocol
            newNodeConfiguration = {
                ...newBaseConfiguration,
                node_id: "",
            };
        } else {
            throw new Error("Unsupported protocol");
        }

        const newNode: DeviceNode = {
            device_id: deviceData.id,
            name: fullNodeName,
            protocol: deviceData.protocol,
            config: newNodeConfiguration,
        };

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

    function handleResize() {
        if (containerElement) {
            currentWidth = containerElement.clientWidth;
        }
        windowWidth = window.innerWidth;
    }

    // Variables
    let initialized: boolean = false;
    let containerElement: HTMLDivElement;
    let currentWidth: number;
    let windowWidth: number;

    let columnVisibility: ColumnVisibilityMap = {
        name: { hideWidth: undefined, visible: true },
        unit: { hideWidth: 540, visible: true },
        type: { hideWidth: 975, visible: true },
        communicationID: { hideWidth: 715, visible: true },
        custom: { hideWidth: 800, visible: true },
        publish: { hideWidth: 1230, visible: true },
        virtual: { hideWidth: 1060, visible: true },
        logging: { hideWidth: 1145, visible: true },
        logging_period: { hideWidth: 1405, visible: true },
        enable_min_alarm: { hideWidth: 1490, visible: true },
        enable_max_alarm: { hideWidth: 1575, visible: true },
        min_alarm: { hideWidth: 1750, visible: true },
        max_alarm: { hideWidth: 1925, visible: true },
        enable: { hideWidth: 455, visible: true },
        actions: { hideWidth: undefined, visible: true },
    };

    // Format and sort nodes only on initial load
    $: if (!initialized && Object.keys(nodes).length > 0) {
        initialized = true;
        formattedNodes = Object.entries(nodes)
            .map(([name, node]) => {
                const formatted: FormattedNode = {
                    ...node,
                    displayName: removePrefix(name),
                    communicationID: getCommunicationID(node),
                };
                return formatted;
            })
            .sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    $: if (currentWidth) {
        for (let key of Object.keys(columnVisibility) as (keyof ColumnVisibilityMap)[]) {
            columnVisibility[key].visible = columnVisibility[key].hideWidth === undefined || currentWidth >= columnVisibility[key].hideWidth;
        }
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
        (acc: Record<NodePhase, Array<FormattedNode>>, section) => {
            acc[section.key] = formattedNodes.filter(section.filter);
            return acc;
        },
        {} as Record<NodePhase, Array<FormattedNode>>,
    );

    onMount(() => {
        handleResize();
        let resizeObserver: ResizeObserver | undefined;
        if (containerElement) {
            resizeObserver = new ResizeObserver(() => {
                handleResize();
            });
            resizeObserver.observe(containerElement);
        }
        (window as any)._nodesGridResizeObserver = resizeObserver;
    });

    onDestroy(() => {
        const resizeObserver = (window as any)._nodesGridResizeObserver as ResizeObserver | undefined;
        if (resizeObserver) {
            resizeObserver.disconnect();
            (window as any)._nodesGridResizeObserver = undefined;
        }
    });
</script>

<div
    bind:this={containerElement}
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
                    {#if columnVisibility.name.visible}
                        <th class="max-width">{$texts.variable[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.unit.visible}
                        <th class="min-width">{$texts.unit[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.communicationID.visible}
                        {#if deviceData.protocol === Protocol.OPC_UA}
                            <th class="mid-width">{$texts.opcuaID[$selectedLang]}</th>
                        {:else if deviceData.protocol === Protocol.MODBUS_RTU}
                            <th class="mid-width">{$texts.modbusRegister[$selectedLang]}</th>
                        {/if}
                    {/if}
                    {#if columnVisibility.type.visible}
                        <th class="mid-width">{$texts.type[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.logging_period.visible}
                        <th class="mid-width">{$texts.loggingPeriod[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.min_alarm.visible}
                        <th class="mid-width">{$texts.minValue[$selectedLang]} </th>
                    {/if}
                    {#if columnVisibility.max_alarm.visible}
                        <th class="mid-width">{$texts.maxValue[$selectedLang]} </th>{/if}
                    {#if columnVisibility.custom.visible}
                        <th class="min-width">{$texts.custom[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.publish.visible}
                        <th class="min-width">{$texts.publish[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.virtual.visible}
                        <th class="min-width">{$texts.virtual[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.logging.visible}
                        <th class="min-width">{$texts.logging[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.enable_min_alarm.visible}
                        <th class="min-width">{$texts.minAlarm[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.enable_max_alarm.visible}
                        <th class="min-width">{$texts.maxAlarm[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.enable.visible}
                        <th class="min-width">{$texts.enabled[$selectedLang]}</th>
                    {/if}
                    {#if columnVisibility.actions.visible}
                        {#if currentWidth > 325}
                            <th class="min-width">{$texts.actions[$selectedLang]}</th>
                        {:else}
                            <th class="super-min-width"><img src="/img/more.png" style="width:20px; height: 20px;" alt="More" /></th>
                        {/if}
                    {/if}
                </tr>
            </thead>
            <tbody>
                <!--     T H R E E     P H A S E     M E T E R S     -->
                {#if deviceData.type === MeterType.THREE_PHASE}
                    <!-- Render each node section -->
                    {#each nodeSections as section (section.key)}
                        <tr class="sub-section">
                            <td colspan="20">{$texts[section.labelKey][$selectedLang]}</td>
                        </tr>
                        {#each nodesBySection[section.key] as node, i (i)}
                            <NodeRow
                                nodePhase={section.key}
                                {node}
                                sectionNodes={nodesBySection[section.key]}
                                backgroundColor="rgba(255, 255, 255, 0.05)"
                                disabledBackgroundColor="rgba(255, 255, 255, 0.22)"
                                {windowWidth}
                                currentGridWidth={currentWidth}
                                {columnVisibility}
                                onDelete={() => deleteNode(node)}
                                onConfig={() => {}}
                                selectedProtocol={deviceData.protocol}
                                onPropertyChanged={() => {
                                    updateNode(node);
                                }}
                            />
                        {/each}
                        <AddNode {windowWidth} backgroundColor="rgba(255, 255, 255, 0.05)" onAddNode={() => addNode(section.prefix)} />
                    {/each}
                    <!--     S I N G L E     P H A S E     M E T E R S     -->
                {:else if deviceData.type === MeterType.SINGLE_PHASE}
                    {#each formattedNodes as node, i (i)}
                        <NodeRow
                            nodePhase={NodePhase.SINGLEPHASE}
                            {node}
                            sectionNodes={formattedNodes}
                            currentGridWidth={currentWidth}
                            {columnVisibility}
                            backgroundColor="rgba(255, 255, 255, 0.05)"
                            disabledBackgroundColor="rgba(255, 255, 255, 0.22)"
                            {windowWidth}
                            onDelete={() => deleteNode(node)}
                            onConfig={() => {}}
                            selectedProtocol={deviceData.protocol}
                            onPropertyChanged={() => {
                                updateNode(node);
                            }}
                        />
                    {/each}
                    <AddNode {windowWidth} backgroundColor="rgba(255, 255, 255, 0.05)" onAddNode={() => addNode(NodePrefix.SINGLEPHASE)} />
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

    table thead {
        position: sticky;
        top: 74px;
        z-index: 1;
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
        height: 40px;
    }

    table th.max-width {
        width: max-content;
        min-width: 200px;
    }

    table th.mid-width {
        width: 175px;
        min-width: 175px;
        max-width: 175px;
    }

    table th.min-width {
        width: 85px;
        min-width: 85px;
        max-width: 85px;
    }

    table th.super-min-width {
        width: 50px;
        min-width: 50px;
        max-width: 50px;
    }

    table .sub-section {
        width: 100%;
        margin: 0;
        padding: 0;
        background-color: var(--sub-section-background-color);
        color: var(--sub-section-text-color);
        border: 1px solid var(--sub-section-border-color);
        font-size: 0.9rem;
        border-left: none;
        border-right: none;
    }

    table .sub-section td {
        height: 35px;
    }

    @media (min-width: 880px) {
        tr td {
            height: 30px;
        }

        tr th {
            height: 30px;
        }

        table .sub-section td {
            height: 25px;
        }
    }
</style>
