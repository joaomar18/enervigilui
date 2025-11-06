<script lang="ts">
    import Action from "../General/Action.svelte";
    import ContentCard from "../General/ContentCard.svelte";
    import TimePeriodPicker from "../General/Pickers/TimePeriodPicker.svelte";
    import ToolTipText from "../General/ToolTipText.svelte";
    import ElectricalPhasePicker from "../General/Pickers/ElectricalPhasePicker.svelte";
    import { LogSpanPeriod } from "$lib/types/view/nodes";
    import { SlidingWindow } from "$lib/logic/util/classes/SlidingWindow";
    import { SelectablePhaseFilter } from "$lib/types/view/nodes";
    import { NodePhase } from "$lib/types/nodes/base";
    import type { NodeTimeSpan } from "$lib/types/view/nodes";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { RealTimeCardActionStyle, RealTimeCardActionToolTipStyle, RealTimeCardButtonStyle } from "$lib/style/device";

    // Props
    export let availablePhases: Array<NodePhase>;

    // Variables
    let selectedElectricalPhase: SelectablePhaseFilter = SelectablePhaseFilter.TOTAL;
    let selectedTimeSpan: LogSpanPeriod = LogSpanPeriod.currentDay;
    let initialDate: Date;
    let endDate: Date;
    let timeSpans: SlidingWindow<NodeTimeSpan> = new SlidingWindow(10);
    let enableGoBack: boolean = false;

    // Functions
    function getNewTimeSpan(initialDate: Date, endDate: Date): void {}

    function getNewDefaultTimeSpan(timeSpan: LogSpanPeriod): void {}
</script>

<ContentCard titleText={$texts.metrics}>
    <div class="slot-div header" slot="header">
        <div class="actions-div">
            <Action
                style={$RealTimeCardActionStyle}
                toolTipStyle={$RealTimeCardActionToolTipStyle}
                imageURL="/img/collapse-all.svg"
                onClick={() => {}}
                enableToolTip={true}
            >
                <div slot="tooltip"><ToolTipText text={$texts.collapseAll} /></div>
            </Action>
            <Action
                style={$RealTimeCardActionStyle}
                toolTipStyle={$RealTimeCardActionToolTipStyle}
                imageURL="/img/expand-all.svg"
                onClick={() => {}}
                enableToolTip={true}
            >
                <div slot="tooltip"><ToolTipText text={$texts.expandAll} /></div>
            </Action>
            {#if !availablePhases.includes(NodePhase.SINGLEPHASE)}
                <div class="picker-div">
                    <ElectricalPhasePicker
                        toolTipButtonStyle={$RealTimeCardButtonStyle}
                        bind:selectedPhase={selectedElectricalPhase}
                        changePhaseFilter={(selectedPhase: SelectablePhaseFilter) => {}}
                    />
                </div>
            {/if}
            <div class="picker-div">
                <TimePeriodPicker
                    toolTipButtonStyle={$RealTimeCardButtonStyle}
                    bind:selectedTimeSpan
                    bind:initialDate
                    bind:endDate
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
