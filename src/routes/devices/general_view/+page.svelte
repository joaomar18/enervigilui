<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { MethodPoller } from "$lib/logic/api/poller";
    import { NodePhase } from "$lib/types/nodes/base";
    import { getDeviceNodesState } from "$lib/logic/api/nodes";
    import { showToast } from "$lib/logic/view/toast";
    import { ToastType } from "$lib/stores/view/toast";
    import { nodeSections } from "$lib/types/nodes/base";
    import { getAvailablePhasesFromNodesState, getNodesStateBySubSection } from "$lib/logic/util/nodes";
    import { initialRealTimeCardSectionsExpandState } from "$lib/types/view/device";
    import { assignRealTimeCardSectionsStateToAllPhases } from "$lib/logic/view/device";
    import type { NodeState } from "$lib/types/nodes/base";
    import type { RealTimeCardSubSections, RealTimeCardSectionsState } from "$lib/types/view/device";
    import ContentCard from "../../../components/General/ContentCard.svelte";
    import ExpandableSection from "../../../components/General/ExpandableSection.svelte";
    import Action from "../../../components/General/Action.svelte";
    import Counter from "../../../components/Devices/Nodes/RealTimeDisplay/Counter.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Stores
    import { loadedDone } from "$lib/stores/view/navigation";
    import { currentDeviceID } from "$lib/stores/device/current";

    // Styles
    import { RealTimeCardActionStyle } from "$lib/style/device";

    // Variables
    let nodesState: Record<string, NodeState>;
    let nodesStateBySubSection: Record<NodePhase, Record<RealTimeCardSubSections, Record<string, NodeState>>>;
    let availablePhases: Array<NodePhase>;
    let availableSubSections: Record<NodePhase, RealTimeCardSectionsState>;
    let expandedState = assignRealTimeCardSectionsStateToAllPhases(initialRealTimeCardSectionsExpandState);

    // Reactive Statements

    $: if (nodesState) {
        availablePhases = getAvailablePhasesFromNodesState(nodesState);
        ({ nodesStateBySubSection, availableSubSections } = getNodesStateBySubSection(nodesState));
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

    onMount(() => {
        let nodesStatePoller: MethodPoller | null;
        if ($currentDeviceID) {
            nodesStatePoller = new MethodPoller(async (signal) => {
                ({ nodesState } = await getDeviceNodesState($currentDeviceID));
            }, 5000);
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
</script>

<div class="content" in:fade={{ duration: 300 }}>
    {#if nodesStateBySubSection && availableSubSections}
        <div class="grid">
            {#each nodeSections.filter((section) => availablePhases.includes(section.phase)) as section (section.key)}
                <div class="grid-col">
                    <ContentCard titleText={section.phase !== NodePhase.SINGLEPHASE ? $texts[section.labelKey] : $texts.variables}>
                        <div class="slot-div" slot="header">
                            <div class="phase-actions-div">
                                <Action
                                    style={$RealTimeCardActionStyle}
                                    imageURL="/img/collapse-all.svg"
                                    onClick={() => expandAllOnPhaseCard(section.phase)}
                                />
                                <Action
                                    style={$RealTimeCardActionStyle}
                                    imageURL="/img/expand-all.svg"
                                    onClick={() => collapseAllOnPhaseCard(section.phase)}
                                />
                            </div>
                        </div>
                        <div class="slot-div" slot="content">
                            {#each Object.entries(availableSubSections[section.phase]) as [subsection, isActive] (subsection)}
                                {#if isActive}
                                    <ExpandableSection
                                        titleText={$texts[subsection.toLowerCase()]}
                                        bind:contentExpanded={expandedState[section.phase][subsection as keyof RealTimeCardSectionsState]}
                                    >
                                        <Counter labelText="Potência Ativa" valueText="3.53" unitText="kW" />
                                        <Counter />
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
                    <div class="slot-div" slot="content"></div>
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
        max-width: calc(4 * 540px + 1 * 20px);
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
    }

    .grid .grid-col.span-2 {
        grid-column: span 2;
    }

    .slot-div {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .slot-div .phase-actions-div {
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 10px;
    }

    @media (max-width: 1569px) {
        .grid {
            max-width: calc(2 * 540px + 1 * 20px);
            grid-template-columns: repeat(2, minmax(300px, 1fr));
        }
        .grid-col {
            max-height: 680px;
        }
    }

    @media (max-width: 946px) {
        .grid {
            max-width: 540px;
            grid-template-columns: repeat(1, minmax(300px, 1fr));
        }
        .grid .grid-col.span-2 {
            grid-column: auto;
        }
    }
</style>
