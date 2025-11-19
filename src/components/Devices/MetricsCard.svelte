<script lang="ts">
    import Action from "../General/Action.svelte";
    import ContentCard from "../General/ContentCard.svelte";
    import ToolTipText from "../General/ToolTipText.svelte";
    import EnergyPickers from "../General/Pickers/EnergyPickers.svelte";
    import { LogSpanPeriod } from "$lib/types/view/nodes";
    import { SelectablePhaseFilter } from "$lib/types/view/nodes";
    import { NodePhase } from "$lib/types/nodes/base";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { RealTimeCardActionStyle, RealTimeCardActionToolTipStyle, RealTimeCardButtonStyle } from "$lib/style/device";
    import { onDestroy, onMount } from "svelte";

    // Props
    export let availablePhases: Array<NodePhase>;

    // Variables
    let mobileView = false;
    let selectedElectricalPhase: SelectablePhaseFilter = SelectablePhaseFilter.TOTAL;
    let selectedTimeSpan: LogSpanPeriod = LogSpanPeriod.currentDay;
    let initialDate: Date;
    let endDate: Date;
    let usePhase: boolean = false;

    // Reactive Statements
    $: if (availablePhases) {
        usePhase = !availablePhases.includes(NodePhase.SINGLEPHASE);
    }

    // Functions
    function getNewTimeSpan(initialDate: Date, endDate: Date): void {}

    function getNewDefaultTimeSpan(timeSpan: LogSpanPeriod): void {}

    function getNewElectricalPhase(selectedPhase: SelectablePhaseFilter): void {
        selectedElectricalPhase = selectedPhase;
    }

    function getMobileView(): void {
        mobileView = !(window.innerWidth >= 450);
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
                onClick={() => {}}
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
                onClick={() => {}}
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
    <div class="slot-div content" slot="content"></div>
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
