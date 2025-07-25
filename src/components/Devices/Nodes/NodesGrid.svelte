<script lang="ts">
    import NodeRow from "./NodeRow.svelte";
    import AddNode from "./AddNode.svelte";
    import { onMount, onDestroy } from "svelte";
    import { addNode, getNodeIndex } from "$lib/ts/nodes";
    import { nodeSections } from "$lib/stores/nodes";

    // Stores for variable definitions
    import { MeterType, Protocol } from "$lib/stores/devices";
    import { NodePrefix, NodePhase } from "$lib/stores/nodes";

    // Types
    import type { EditableDeviceMeter, NewDeviceMeter } from "$lib/stores/devices";
    import type { EditableDeviceNode, NodeEditState } from "$lib/stores/nodes";
    import type { ColumnVisibilityMap } from "$lib/ts/nodes_gid";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Props
    export let deviceData: EditableDeviceMeter | NewDeviceMeter;
    export let nodesInitialized: boolean; // Nodes are initialized
    export let nodes: Array<EditableDeviceNode> = []; // Nodes Configuration (Formatted)
    export let nodesBySection: Record<NodePhase, Array<EditableDeviceNode>>; // Nodes Configuration by Section

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

    // Export Functions
    export let onPropertyChanged: (node: EditableDeviceNode) => void;
    export let onShowConfigPopup: (node: EditableDeviceNode, nodeEditingState: NodeEditState) => void;

    // Functions
    function handleResize() {
        if (containerElement) {
            currentWidth = containerElement.clientWidth;
        }
        windowWidth = window.innerWidth;
    }

    // Variables
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

    $: if (currentWidth) {
        for (let key of Object.keys(columnVisibility) as (keyof ColumnVisibilityMap)[]) {
            columnVisibility[key].visible = columnVisibility[key].hideWidth === undefined || currentWidth >= columnVisibility[key].hideWidth;
        }
    }

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

<!-- NodesGrid Component: displays a responsive table of device nodes, grouped by section for three-phase meters. 
Supports dynamic column visibility, node editing, configuration popups, and node addition/removal. 
Includes multi-language headers and adapts layout to container size. -->
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
        <div class="loader-overlay" class:close={nodesInitialized}>
            <div class="spinner"></div>
        </div>
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
                {#if deviceData.type === MeterType.THREE_PHASE && nodesBySection}
                    <!-- Render each node section -->
                    {#each nodeSections as section (section.key)}
                        <tr class="sub-section">
                            <td colspan="20">{$texts[section.labelKey][$selectedLang]}</td>
                        </tr>
                        {#each nodesBySection[section.key] as node, i (i)}
                            <NodeRow
                                {node}
                                sectionNodes={nodesBySection[section.key]}
                                backgroundColor="rgba(255, 255, 255, 0.05)"
                                disabledBackgroundColor="rgba(255, 255, 255, 0.22)"
                                {windowWidth}
                                currentGridWidth={currentWidth}
                                {columnVisibility}
                                onDelete={() => {
                                    let deletedNodeIndex = getNodeIndex(node, nodes);
                                    if (deletedNodeIndex !== -1) {
                                        nodes = [...nodes.slice(0, deletedNodeIndex), ...nodes.slice(deletedNodeIndex + 1)];
                                    }
                                }}
                                onConfig={(nodeEditingState: NodeEditState) => {
                                    onShowConfigPopup(node, nodeEditingState);
                                }}
                                {deviceData}
                                onPropertyChanged={() => {
                                    onPropertyChanged(node);
                                }}
                            />
                        {/each}
                        <AddNode
                            {windowWidth}
                            backgroundColor="rgba(255, 255, 255, 0.05)"
                            onAddNode={() => {
                                nodes = [...nodes, addNode(section.prefix, deviceData)];
                            }}
                        />
                    {/each}
                    <!--     S I N G L E     P H A S E     M E T E R S     -->
                {:else if deviceData.type === MeterType.SINGLE_PHASE}
                    {#each nodes as node, i (i)}
                        <NodeRow
                            {node}
                            sectionNodes={nodes}
                            currentGridWidth={currentWidth}
                            {columnVisibility}
                            backgroundColor="rgba(255, 255, 255, 0.05)"
                            disabledBackgroundColor="rgba(255, 255, 255, 0.22)"
                            {windowWidth}
                            onDelete={() => {
                                let deletedNodeIndex = getNodeIndex(node, nodes);
                                if (deletedNodeIndex !== -1) {
                                    nodes = [...nodes.slice(0, deletedNodeIndex), ...nodes.slice(deletedNodeIndex + 1)];
                                }
                            }}
                            onConfig={(nodeEditingState: NodeEditState) => {
                                onShowConfigPopup(node, nodeEditingState);
                            }}
                            {deviceData}
                            onPropertyChanged={() => {
                                onPropertyChanged(node);
                            }}
                        />
                    {/each}
                    <AddNode
                        {windowWidth}
                        backgroundColor="rgba(255, 255, 255, 0.05)"
                        onAddNode={() => {
                            nodes = [...nodes, addNode(NodePrefix.SINGLEPHASE, deviceData)];
                        }}
                    />
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style>
    /* Main container for the nodes grid table */
    .container {
        width: var(--width);
        height: var(--height);
        border-radius: var(--border-radius);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
    }

    /* Content wrapper for table and sections */
    .content {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }

    /* Overlay when nodes are not yet initialized */
    .content .loader-overlay {
        margin: 0;
        padding: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: rgba(24, 29, 35, 0.25);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 2;
    }

    /* Close overlay and loader when content is initialized */
    .content .loader-overlay.close {
        display: none;
    }

    /* Spinner for loading visualization of nodes grid */
    .content .loader-overlay .spinner {
        width: 128px;
        height: 128px;
        border: 4px solid rgba(255, 255, 255, 0.2);
        border-top-color: #fff;
        border-radius: 50%;
        animation: content-spin 1s linear infinite;
    }

    /* Spin animation: full rotation */
    @keyframes content-spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Table layout for nodes grid */
    table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }

    /* Sticky table header for scrolling */
    table thead {
        position: sticky;
        top: 74px;
        z-index: 1;
    }

    /* Header row styling */
    table thead .header {
        background-color: var(--header-background-color);
        height: 40px;
        color: var(--header-text-color);
    }

    /* Header cell styling */
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

    /* Rounded corners for first and last header cells */
    table thead .header th:first-child {
        border-top-left-radius: var(--border-radius);
    }

    table thead .header th:last-child {
        border-top-right-radius: var(--border-radius);
        border-right: none;
    }

    /* Table cell height for node rows */
    table tr td {
        height: 40px;
    }

    /* Column width classes for header cells */
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

    /* Sub-section row styling for grouped nodes */
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

    /* Sub-section cell height */
    table .sub-section td {
        height: 35px;
    }

    /* Responsive: reduce row and header height on wide screens */
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
