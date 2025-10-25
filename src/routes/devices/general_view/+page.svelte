<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { MethodPoller } from "$lib/logic/api/poller";
    import { NodePhase } from "$lib/types/nodes/base";
    import { getDeviceNodesState } from "$lib/logic/api/nodes";
    import { showToast } from "$lib/logic/view/toast";
    import { AlertType } from "$lib/stores/view/toast";
    import { nodePhaseSections } from "$lib/types/nodes/base";
    import { getAvailablePhasesFromRecordsOrStates, getNodesStateByCategory } from "$lib/logic/util/nodes";
    import { initialRealTimeCardCategoriesExpandState } from "$lib/types/view/device";
    import { assignRealTimeCardCategoriesStateToAllPhases } from "$lib/logic/view/device";
    import ContentCard from "../../../components/General/ContentCard.svelte";
    import ExpandableSection from "../../../components/General/ExpandableSection.svelte";
    import Action from "../../../components/General/Action.svelte";
    import NodeDetailSheet from "../../../components/Devices/Nodes/NodeDetailSheet.svelte";
    import ToolTipText from "../../../components/General/ToolTipText.svelte";
    import type { NodeCategory } from "$lib/types/nodes/base";
    import type { NodeState, ProcessedNodeState } from "$lib/types/nodes/realtime";
    import type { RealTimeCardCategoriesState } from "$lib/types/view/device";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { variableNameTexts } from "$lib/stores/lang/energyMeterTexts";

    // Stores
    import { loadedDone } from "$lib/stores/view/navigation";
    import { currentDeviceID } from "$lib/stores/device/current";

    // Styles
    import { RealTimeCardActionStyle } from "$lib/style/device";
    import { RealTimeCardActionToolTipStyle } from "$lib/style/device";
    import { ToolTipTextStyle } from "$lib/style/general";

    // Variables
    let nodesState: Record<string, NodeState>;
    let processedNodesState: Array<ProcessedNodeState>;
    let nodesStateByCategory: Record<NodePhase, Record<NodeCategory, Array<ProcessedNodeState>>>;
    let availablePhases: Array<NodePhase>;
    let availableCategories: Record<NodePhase, RealTimeCardCategoriesState>;
    let expandedState = assignRealTimeCardCategoriesStateToAllPhases(initialRealTimeCardCategoriesExpandState);
    let showDetailDiv = false;
    let detailedNodeState: ProcessedNodeState;

    // Reactive Statements
    $: if (nodesState && processedNodesState) {
        availablePhases = getAvailablePhasesFromRecordsOrStates(processedNodesState);
        ({ nodesStateByCategory, availableCategories } = getNodesStateByCategory(processedNodesState));
    }

    // Functions
    function expandAllOnPhaseCard(phase: NodePhase): void {
        for (const state of Object.keys(expandedState[phase]) as (keyof RealTimeCardCategoriesState)[]) {
            expandedState[phase][state] = false;
        }
    }

    function collapseAllOnPhaseCard(phase: NodePhase): void {
        for (const state of Object.keys(expandedState[phase]) as (keyof RealTimeCardCategoriesState)[]) {
            expandedState[phase][state] = true;
        }
    }

    function openDetailDiv(nodeState: ProcessedNodeState): void {
        showDetailDiv = true;
        detailedNodeState = nodeState;
    }

    onMount(() => {
        let nodesStatePoller: MethodPoller | null;
        if ($currentDeviceID) {
            nodesStatePoller = new MethodPoller(async (signal) => {
                ({ nodesState, processedNodesState } = await getDeviceNodesState($currentDeviceID));
            }, 5000);
        } else {
            showToast("errorEditDeviceParams", AlertType.ALERT);
            loadedDone.set(true);
        }

        //Clean-up logic
        return () => {
            nodesStatePoller?.stop();
            nodesStatePoller = null;
        };
    });
</script>

<div
    style="
        --tool-tip-text-color: {$ToolTipTextStyle.color};
        --tool-tip-text-weight: {$ToolTipTextStyle.weight};
    "
    class="content"
    in:fade={{ duration: 300 }}
>
    {#if nodesStateByCategory && availableCategories}
        <div class="grid">
            {#each nodePhaseSections.filter((section) => availablePhases.includes(section.phase)) as section (section.key)}
                <div class="grid-col">
                    <ContentCard titleText={section.phase !== NodePhase.SINGLEPHASE ? $texts[section.labelKey] : $texts.variables}>
                        <div class="slot-div header" slot="header">
                            <div class="phase-actions-div">
                                <Action
                                    style={$RealTimeCardActionStyle}
                                    toolTipStyle={$RealTimeCardActionToolTipStyle}
                                    imageURL="/img/collapse-all.svg"
                                    onClick={() => expandAllOnPhaseCard(section.phase)}
                                    enableToolTip={true}
                                >
                                    <div slot="tooltip"><ToolTipText text={$texts.collapseAll} /></div>
                                </Action>
                                <Action
                                    style={$RealTimeCardActionStyle}
                                    toolTipStyle={$RealTimeCardActionToolTipStyle}
                                    imageURL="/img/expand-all.svg"
                                    onClick={() => collapseAllOnPhaseCard(section.phase)}
                                    enableToolTip={true}
                                >
                                    <div slot="tooltip"><ToolTipText text={$texts.expandAll} /></div>
                                </Action>
                            </div>
                        </div>
                        <div class="slot-div content" slot="content">
                            {#each Object.entries(availableCategories[section.phase]) as [subsection, isActive] (subsection)}
                                {#if isActive}
                                    <ExpandableSection
                                        titleText={$texts[subsection.toLowerCase()]}
                                        bind:contentExpanded={expandedState[section.phase][subsection as keyof RealTimeCardCategoriesState]}
                                    >
                                        <div class="phase-subsection-div">
                                            {#each nodesStateByCategory[section.phase][subsection as keyof RealTimeCardCategoriesState] as nodeState (nodeState.name)}
                                                <svelte:component
                                                    this={nodeState.displayComponent}
                                                    nodeName={nodeState.name}
                                                    nodePhase={nodeState.phase}
                                                    labelText={$variableNameTexts[nodeState.name] || nodeState.name}
                                                    minRangeValue={nodeState.min_value_range}
                                                    maxRangeValue={nodeState.max_value_range}
                                                    minAlarmState={nodeState.min_alarm_state}
                                                    maxAlarmState={nodeState.max_alarm_state}
                                                    minWarningState={nodeState.min_warning_state}
                                                    maxWarningState={nodeState.max_warning_state}
                                                    value={nodeState.value}
                                                    unitText={nodeState.unit}
                                                    decimalPlaces={nodeState.decimal_places}
                                                    onClick={() => openDetailDiv(nodeState)}
                                                />
                                            {/each}
                                        </div>
                                    </ExpandableSection>
                                {/if}
                            {/each}
                        </div>
                    </ContentCard>
                </div>
            {/each}
            <div class="grid-col">
                <ContentCard titleText={$texts.metrics}>
                    <div class="slot-div" slot="header"></div>
                    <div class="slot-div content" slot="content"></div>
                </ContentCard>
            </div>
            <div class="grid-col span-2">
                <ContentCard titleText={$texts.energyConsumption}>
                    <div class="slot-div" slot="header"></div>
                    <div class="slot-div" slot="content"></div>
                </ContentCard>
            </div>
        </div>
    {/if}
    <NodeDetailSheet bind:showPanel={showDetailDiv} nodeState={detailedNodeState} />
</div>

<style>
    .content {
        padding: 0;
        width: 100%;
        min-height: calc(100vh - 74px - 60px);
    }

    .grid {
        margin: 0 auto;
        padding: 0;
        position: relative;
        display: grid;
        grid-template-columns: repeat(4, minmax(300px, 1fr));
        max-width: calc(4 * 400px + 1 * 20px);
        gap: 20px;
        justify-items: stretch;
        align-items: stretch;
        align-content: start;
    }

    .grid-col {
        margin: 0;
        padding: 0;
        width: 100%;
        height: calc(50vh - 74px - 5px);
        min-height: 400px;
        max-height: 800px;
    }

    .grid .grid-col.span-2 {
        grid-column: span 2;
    }

    .slot-div.content,
    .slot-div.content .phase-subsection-div {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        min-height: 0;
    }

    .slot-div.header .phase-actions-div {
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 10px;
    }

    @media (max-width: 1569px) {
        .grid {
            max-width: calc(2 * 400px + 1 * 20px);
            grid-template-columns: repeat(2, minmax(300px, 1fr));
        }
    }

    @media (max-width: 946px) {
        .grid {
            max-width: 400px;
            grid-template-columns: repeat(1, minmax(300px, 1fr));
        }
        .grid .grid-col.span-2 {
            grid-column: auto;
        }
    }
</style>
