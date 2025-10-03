<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { MethodPoller } from "$lib/logic/api/poller";
    import { MethodRetrier } from "$lib/logic/api/retrier";
    import { NodePhase } from "$lib/types/nodes/base";
    import { getDeviceNodesState, getNodeLogs } from "$lib/logic/api/nodes";
    import { showToast } from "$lib/logic/view/toast";
    import { ToastType } from "$lib/stores/view/toast";
    import { nodeSections } from "$lib/types/nodes/base";
    import { getAvailablePhasesFromRecordsOrStates, getNodesStateBySubSection } from "$lib/logic/util/nodes";
    import { initialRealTimeCardSectionsExpandState } from "$lib/types/view/device";
    import { assignRealTimeCardSectionsStateToAllPhases } from "$lib/logic/view/device";
    import type { NodeState, ProcessedNodeState } from "$lib/types/nodes/base";
    import type { RealTimeCardSubSections, RealTimeCardSectionsState } from "$lib/types/view/device";
    import ContentCard from "../../../components/General/ContentCard.svelte";
    import ExpandableSection from "../../../components/General/ExpandableSection.svelte";
    import Action from "../../../components/General/Action.svelte";
    import ToolTipText from "../../../components/General/ToolTipText.svelte";
    import NodeDetailSheet from "../../../components/Devices/Nodes/RealTimeDisplay/NodeDetailSheet.svelte";

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
    let nodeLogs: any;
    let nodesState: Record<string, NodeState>;
    let processedNodesState: Array<ProcessedNodeState>;
    let nodesStateBySubSection: Record<NodePhase, Record<RealTimeCardSubSections, Array<ProcessedNodeState>>>;
    let availablePhases: Array<NodePhase>;
    let availableSubSections: Record<NodePhase, RealTimeCardSectionsState>;
    let expandedState = assignRealTimeCardSectionsStateToAllPhases(initialRealTimeCardSectionsExpandState);
    let showDetailDiv = false;

    // Reactive Statements

    $: if (nodesState && processedNodesState) {
        availablePhases = getAvailablePhasesFromRecordsOrStates(processedNodesState);
        ({ nodesStateBySubSection, availableSubSections } = getNodesStateBySubSection(processedNodesState));
    }

    // Functions
    function expandAllOnPhaseCard(phase: NodePhase): void {
        for (const state of Object.keys(expandedState[phase]) as (keyof RealTimeCardSectionsState)[]) {
            expandedState[phase][state] = false;
        }
    }

    function collapseAllOnPhaseCard(phase: NodePhase): void {
        for (const state of Object.keys(expandedState[phase]) as (keyof RealTimeCardSectionsState)[]) {
            expandedState[phase][state] = true;
        }
    }

    function openDetailDiv(): void {
        showDetailDiv = true;
    }

    onMount(() => {
        let nodesStatePoller: MethodPoller | null;
        let nodeLogsTest: MethodRetrier | null;
        if ($currentDeviceID) {
            nodesStatePoller = new MethodPoller(async (signal) => {
                ({ nodesState, processedNodesState } = await getDeviceNodesState($currentDeviceID));
            }, 5000);
            nodeLogsTest = new MethodRetrier(async (signal) => {
                let initial_date = new Date();
                initial_date.setHours(initial_date.getHours() - 1);
                let end_date = new Date();

                ({ nodeLogs } = await getNodeLogs($currentDeviceID, "voltage", NodePhase.L1, true, initial_date, end_date));
            }, 20000);
        } else {
            showToast("errorEditDeviceParams", ToastType.ALERT);
            loadedDone.set(true);
        }

        //Clean-up logic
        return () => {
            nodesStatePoller?.stop();
            nodesStatePoller = null;
        };
    });

    $: console.log(nodeLogs);
</script>

<div
    style="
        --tool-tip-text-color: {$ToolTipTextStyle.color};
        --tool-tip-text-weight: {$ToolTipTextStyle.weight};
    "
    class="content"
    in:fade={{ duration: 300 }}
>
    {#if nodesStateBySubSection && availableSubSections}
        <div class="grid">
            {#each nodeSections.filter((section) => availablePhases.includes(section.phase)) as section (section.key)}
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
                            {#each Object.entries(availableSubSections[section.phase]) as [subsection, isActive] (subsection)}
                                {#if isActive}
                                    <ExpandableSection
                                        titleText={$texts[subsection.toLowerCase()]}
                                        bind:contentExpanded={expandedState[section.phase][subsection as keyof RealTimeCardSectionsState]}
                                    >
                                        <div class="phase-subsection-div">
                                            {#each nodesStateBySubSection[section.phase][subsection as keyof RealTimeCardSectionsState] as nodeState (nodeState.name)}
                                                <svelte:component
                                                    this={nodeState.displayComponent}
                                                    nodeName={nodeState.name}
                                                    nodePhase={nodeState.phase}
                                                    labelText={$variableNameTexts[nodeState.name] || nodeState.name}
                                                    value={nodeState.value}
                                                    minAlarmValue={nodeState.min_alarm_value}
                                                    maxAlarmValue={nodeState.max_alarm_value}
                                                    unitText={nodeState.unit}
                                                    onClick={openDetailDiv}
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
    <NodeDetailSheet bind:showPanel={showDetailDiv} />
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
