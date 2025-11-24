<script lang="ts">
    import Action from "../General/Action.svelte";
    import ContentCard from "../General/ContentCard.svelte";
    import ToolTipText from "../General/ToolTipText.svelte";
    import EnergyPickers from "../General/Pickers/EnergyPickers.svelte";
    import ExpandableSection from "../General/ExpandableSection.svelte";
    import { mapMetricAPI } from "$lib/logic/api/nodes";
    import { getTimeSpanFromLogPeriod } from "$lib/logic/util/date";
    import { LogSpanPeriod } from "$lib/types/view/nodes";
    import { SelectablePhaseFilter } from "$lib/types/view/nodes";
    import { NodePhase } from "$lib/types/nodes/base";

    // Stores
    import { currentDeviceID } from "$lib/stores/device/current";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { RealTimeCardActionStyle, RealTimeCardActionToolTipStyle, RealTimeCardButtonStyle } from "$lib/style/device";
    import { onDestroy, onMount } from "svelte";
    import PeakPowerMetrics from "./Nodes/Metrics/PeakPowerMetrics.svelte";

    // Props
    export let availablePhases: Array<NodePhase>;
    export let expandedState: Record<string, boolean>;

    // Variables
    let mobileView = false;
    let selectedElectricalPhase: SelectablePhaseFilter = SelectablePhaseFilter.TOTAL;
    let selectedTimeSpan: LogSpanPeriod = LogSpanPeriod.currentDay;
    let initialDate: Date;
    let endDate: Date;
    let metricsFetched: boolean = false;
    let metricsData: Record<string, any> = {};
    let metricsFirstFetch: boolean = false;
    let usePhase: boolean = false;

    // Reactive Statements
    $: if (!metricsFirstFetch) {
        getInitialMetrics();
    }

    $: if (availablePhases) {
        usePhase = !availablePhases.includes(NodePhase.SINGLEPHASE);
    }

    // Functions
    function getInitialMetrics(): void {
        let { initial_date, end_date } = getTimeSpanFromLogPeriod(selectedTimeSpan);
        setDateSpan({ initial_date, end_date });
        loadMetrics();
    }

    function setDateSpan(dateSpan: { initial_date: Date; end_date: Date }): void {
        initialDate = dateSpan.initial_date;
        endDate = dateSpan.end_date;
    }

    function getNewTimeSpan(initial_date: Date, end_date: Date): void {
        setDateSpan({ initial_date, end_date });
        loadMetrics();
        selectedTimeSpan = LogSpanPeriod.customDate;
    }

    function getNewDefaultTimeSpan(timeSpan: LogSpanPeriod): void {
        let { initial_date, end_date } = getTimeSpanFromLogPeriod(timeSpan);
        setDateSpan({ initial_date, end_date });
        loadMetrics();
        selectedTimeSpan = timeSpan;
    }

    function getNewElectricalPhase(selectedPhase: SelectablePhaseFilter): void {
        selectedElectricalPhase = selectedPhase;
        loadMetrics();
    }

    async function loadMetrics() {
        if (!$currentDeviceID) {
            return;
        }
        metricsFetched = false;
        for (const metric of Object.keys(expandedState)) {
            metricsData[metric] = await mapMetricAPI(metric, $currentDeviceID, selectedElectricalPhase, initialDate, endDate);
        }
        metricsFetched = true;
        metricsFirstFetch = true;
    }

    function getMobileView(): void {
        mobileView = !(window.innerWidth >= 450);
    }

    function expandAll(): void {
        for (const metric of Object.keys(expandedState)) {
            expandedState[metric] = true;
        }
    }

    function collapseAll(): void {
        for (const metric of Object.keys(expandedState)) {
            expandedState[metric] = false;
        }
    }

    onMount(() => {
        window.addEventListener("resize", getMobileView);
    });

    onDestroy(() => {
        window.removeEventListener("resize", getMobileView);
    });
</script>

<ContentCard titleText={mobileView ? $texts.metricsShort : $texts.metrics}>
    <div class="slot-div header" slot="header">
        <div class="actions-div">
            <Action
                style={$RealTimeCardActionStyle}
                toolTipStyle={$RealTimeCardActionToolTipStyle}
                imageWidth="24px"
                imageHeight="24px"
                imageURL="/img/collapse-all.svg"
                onClick={collapseAll}
                enableToolTip={true}
            >
                <div slot="tooltip"><ToolTipText text={$texts.collapseAll} /></div>
            </Action>
            <Action
                style={$RealTimeCardActionStyle}
                toolTipStyle={$RealTimeCardActionToolTipStyle}
                imageWidth="24px"
                imageHeight="24px"
                imageURL="/img/expand-all.svg"
                onClick={expandAll}
                enableToolTip={true}
            >
                <div slot="tooltip"><ToolTipText text={$texts.expandAll} /></div>
            </Action>
            <div class="picker-div">
                <EnergyPickers
                    toolTipButtonStyle={$RealTimeCardButtonStyle}
                    bind:selectedPhase={selectedElectricalPhase}
                    bind:selectedTimeSpan
                    bind:initialDate
                    bind:endDate
                    {usePhase}
                    useDirection={false}
                    changePhase={(selectedPhase: SelectablePhaseFilter) => getNewElectricalPhase(selectedPhase)}
                    changeSpanPeriodCustom={(initial_date: Date, end_date: Date) => getNewTimeSpan(initial_date, end_date)}
                    changeSpanPeriod={(timeSpan: LogSpanPeriod) => getNewDefaultTimeSpan(timeSpan)}
                />
            </div>
        </div>
    </div>
    <div class="slot-div content" slot="content">
        {#if "peakPower" in expandedState}
            <ExpandableSection titleText={$texts.peakPower} bind:contentExpanded={expandedState.peakPower}>
                <PeakPowerMetrics metrics={metricsData.peakPower} />
            </ExpandableSection>
        {/if}
        {#if usePhase && "phaseBalance" in expandedState}
            <ExpandableSection titleText={$texts.phaseBalance} bind:contentExpanded={expandedState.phaseBalance}></ExpandableSection>
        {/if}
    </div>
</ContentCard>

<style>
    .slot-div.header {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
    }

    .slot-div.header .actions-div {
        display: flex;
        height: 100%;
        justify-content: end;
        align-items: center;
        gap: 10px;
    }

    .picker-div {
        margin: 0;
        padding: 0;
        position: relative;
    }

    .slot-div.content {
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
</style>
