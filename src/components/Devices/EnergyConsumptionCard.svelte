<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { NodePhase } from "$lib/types/nodes/base";
    import { EnergyDirectionFilter, LogSpanPeriod, SelectablePhaseFilter } from "$lib/types/view/nodes";
    import { getTimeSpanFromLogPeriod } from "$lib/logic/util/date";
    import { getEnergyConsumption } from "$lib/logic/api/nodes";
    import ContentCard from "../General/ContentCard.svelte";
    import EnergyDirectionPicker from "../General/Pickers/EnergyDirectionPicker.svelte";
    import TimePeriodPicker from "../General/Pickers/TimePeriodPicker.svelte";
    import ElectricalPhasePicker from "../General/Pickers/ElectricalPhasePicker.svelte";
    import type { EnergyConsumptionType } from "$lib/types/device/energy";
    import type { EnergyConsumptionMetrics, ProcessedEnergyConsumptionLogPoint } from "$lib/types/nodes/logs";

    // Stores
    import { currentDeviceID } from "$lib/stores/device/current";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { RealTimeCardButtonStyle } from "$lib/style/device";

    // Props
    export let availablePhases: Array<NodePhase>;

    // Variables
    let energyLogs: EnergyConsumptionType | null = null;
    let mergedPoints: Array<ProcessedEnergyConsumptionLogPoint>;
    let mergedGlobalMetrics: EnergyConsumptionMetrics;
    let mobileView = false;
    let selectedEnergyDirection: EnergyDirectionFilter = EnergyDirectionFilter.TOTAL;
    let selectedElectricalPhase: SelectablePhaseFilter = SelectablePhaseFilter.TOTAL;
    let selectedTimeSpan: LogSpanPeriod = LogSpanPeriod.currentDay;
    let initialDate: Date;
    let endDate: Date;
    let energyConsumptionFetched: boolean = false;
    let energyConsumptionFirstFetch: boolean = false;

    // Reactive Statements
    $: if (!energyConsumptionFirstFetch) {
        getInitialEnergyConsumption();
    }

    // Functions
    function getInitialEnergyConsumption(): void {
        let { initial_date, end_date } = getTimeSpanFromLogPeriod(selectedTimeSpan);
        setDateSpan({ initial_date, end_date });
        loadEnergyConsumption();
    }

    function setDateSpan(dateSpan: { initial_date: Date; end_date: Date }): void {
        initialDate = dateSpan.initial_date;
        endDate = dateSpan.end_date;
    }

    function getNewTimeSpan(initial_date: Date, end_date: Date): void {
        setDateSpan({ initial_date, end_date });
        loadEnergyConsumption();
        selectedTimeSpan = LogSpanPeriod.customDate;
    }

    function getNewDefaultTimeSpan(timeSpan: LogSpanPeriod): void {
        let { initial_date, end_date } = getTimeSpanFromLogPeriod(timeSpan);
        setDateSpan({ initial_date, end_date });
        loadEnergyConsumption();
        selectedTimeSpan = timeSpan;
    }

    function getNewElectricalPhase(selectedPhase: SelectablePhaseFilter): void {
        selectedElectricalPhase = selectedPhase;
        loadEnergyConsumption();
    }

    function getNewEnergyDirection(selectedDirection: EnergyDirectionFilter): void {
        selectedEnergyDirection = selectedDirection;
        loadEnergyConsumption();
    }

    async function loadEnergyConsumption() {
        if (!$currentDeviceID) {
            return;
        }
        energyConsumptionFetched = false;
        ({ energyLogs, mergedPoints, mergedGlobalMetrics } = await getEnergyConsumption(
            $currentDeviceID,
            selectedElectricalPhase,
            selectedEnergyDirection,
            initialDate !== null,
            initialDate,
            endDate,
        ));
        energyConsumptionFetched = true;
        energyConsumptionFirstFetch = true;
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

<ContentCard titleText={mobileView ? $texts.energyConsumptionShort : $texts.energyConsumption}>
    <div class="slot-div header" slot="header">
        <div class="actions-div">
            <div class="picker-div">
                <EnergyDirectionPicker
                    toolTipButtonStyle={$RealTimeCardButtonStyle}
                    bind:selectedDirection={selectedEnergyDirection}
                    changeEnergyDirection={(selectedDirection: EnergyDirectionFilter) => getNewEnergyDirection(selectedDirection)}
                />
            </div>
            {#if !availablePhases.includes(NodePhase.SINGLEPHASE)}
                <div class="picker-div">
                    <ElectricalPhasePicker
                        toolTipButtonStyle={$RealTimeCardButtonStyle}
                        bind:selectedPhase={selectedElectricalPhase}
                        changePhaseFilter={(selectedPhase: SelectablePhaseFilter) => getNewElectricalPhase(selectedPhase)}
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
