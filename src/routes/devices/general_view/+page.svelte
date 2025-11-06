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
    import NodeDetailSheet from "../../../components/Devices/Nodes/NodeDetailSheet.svelte";
    import EnergyConsumptionCard from "../../../components/Devices/EnergyConsumptionCard.svelte";
    import type { NodeCategory } from "$lib/types/nodes/base";
    import type { NodeState, ProcessedNodeState } from "$lib/types/nodes/realtime";
    import type { RealTimeCardCategoriesState } from "$lib/types/view/device";

    // Stores
    import { loadedDone } from "$lib/stores/view/navigation";
    import { currentDeviceID } from "$lib/stores/device/current";

    // Styles
    import { ToolTipTextStyle } from "$lib/style/general";
    import RealTimeCard from "../../../components/Devices/RealTimeCard.svelte";
    import MetricsCard from "../../../components/Devices/MetricsCard.svelte";

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
                    <RealTimeCard {section} {availableCategories} {nodesStateByCategory} bind:expandedState bind:detailedNodeState bind:showDetailDiv />
                </div>
            {/each}
            <div class="grid-col">
                <MetricsCard {availablePhases} />
            </div>
            <div class="grid-col span-2">
                <EnergyConsumptionCard {availablePhases} />
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
