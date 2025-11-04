<script lang="ts">
    import { onDestroy } from "svelte";
    import { LogSpanPeriod } from "$lib/types/view/nodes";
    import Button from "../../../General/Button.svelte";
    import ToolTip from "../../../General/ToolTip.svelte";
    import ToolTipText from "../../../General/ToolTipText.svelte";
    import DateRangePicker from "../../../General/TimeDate/DateRangePicker.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { GraphPerSelStyle } from "$lib/style/graph";
    import { GraphButtonStyle } from "$lib/style/graph";
    import { GraphPeriodButtonStyle } from "$lib/style/graph";
    import { CustomDateButtonStyle } from "$lib/style/graph";
    import { SelectedCustomDateButtonStyle } from "$lib/style/graph";

    // Props
    export let useToolTip: boolean = true;
    export let selectedTimeSpan: LogSpanPeriod;
    export let initialDate: Date;
    export let endDate: Date;

    // Variables
    let containerDiv: HTMLDivElement;
    let clickEventListenerDefined: boolean = false;
    let showCustomDatePicker: boolean = false;
    let showSelectionToolTip: boolean = false;

    // Reactive Statements
    $: if (!showSelectionToolTip && clickEventListenerDefined) {
        window.removeEventListener("click", handleClickOutside);
        clickEventListenerDefined = false;
    }
    $: if (showSelectionToolTip && !clickEventListenerDefined) {
        requestAnimationFrame(() => {
            window.addEventListener("click", handleClickOutside);
            clickEventListenerDefined = true;
        });
    }

    // Export Functions
    export let loadNodeLogsWithSpanPeriod: (timeSpan: LogSpanPeriod) => void;
    export let loadNodeLogsWithCustomPeriod: (initial_date: Date, end_date: Date) => void;

    // Functions
    function handleClickOutside(event: MouseEvent): void {
        if (showSelectionToolTip && containerDiv && !containerDiv.contains(event.target as Node)) {
            showSelectionToolTip = false;
        }
    }

    onDestroy(() => {
        if (clickEventListenerDefined) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

<!--
    GraphPeriodSelection Component
    
    A comprehensive time period selection interface for graph data filtering with predefined
    quick-select buttons and custom date range picker capabilities. Features tooltip-based
    and inline display modes, click-outside detection for modal behavior, and reactive
    button selection states. Provides preset time periods (1h, 1d, 7d, 1M, 1Y) with
    internationalized labels and tooltips, plus custom date range selection via integrated
    DateRangePicker. Handles event delegation for window interactions and automatic cleanup.
    Supports both compact button trigger mode and expanded inline selection interface.
-->
<div bind:this={containerDiv}>
    {#if useToolTip}
        <ToolTip style={$GraphPerSelStyle} maxWidth="auto" zIndex={198} showToolTip={showSelectionToolTip} autoPositionContinuous={true}>
            <div class="period-selection-div">
                <Button
                    enableToolTip={true}
                    style={$GraphPeriodButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.currentHour}
                    buttonText={$texts._1h}
                    onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.currentHour)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.currentHour} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$GraphPeriodButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.currentDay}
                    buttonText={$texts._1d}
                    onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.currentDay)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.currentDay} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$GraphPeriodButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.current7Days}
                    buttonText={$texts._7d}
                    onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.current7Days)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.currentWeek} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$GraphPeriodButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.currentMonth}
                    buttonText={$texts._1M}
                    onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.currentMonth)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.currentMonth} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$GraphPeriodButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.currentYear}
                    buttonText={$texts._1Y}
                    onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.currentYear)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.currentYear} /></div>
                </Button>
                <div class="custom-date-div">
                    <Button
                        enableToolTip={true}
                        selected={showCustomDatePicker}
                        style={selectedTimeSpan === LogSpanPeriod.customDate ? $SelectedCustomDateButtonStyle : $CustomDateButtonStyle}
                        buttonText=""
                        imageURL="/img/custom-date.svg"
                        onClick={() => {
                            showCustomDatePicker = !showCustomDatePicker;
                        }}
                    >
                        <div slot="tooltip"><ToolTipText text={$texts.customPeriod} /></div>
                    </Button>
                    <DateRangePicker
                        bind:initialDate
                        bind:endDate
                        bind:showToolTip={showCustomDatePicker}
                        requestCustomPeriod={(initial_date: Date, end_date: Date) => loadNodeLogsWithCustomPeriod(initial_date, end_date)}
                    />
                </div>
            </div>
        </ToolTip>

        <Button
            style={$GraphButtonStyle}
            selected={showSelectionToolTip}
            buttonText=""
            imageURL={"/img/custom-date.svg"}
            enableToolTip={true}
            onClick={() => {
                showSelectionToolTip = !showSelectionToolTip;
            }}
        >
            <div slot="tooltip"><ToolTipText text={$texts.periodSelection} /></div>
        </Button>
    {:else}
        <div class="period-selection-div">
            <Button
                enableToolTip={true}
                style={$GraphPeriodButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.currentHour}
                buttonText={$texts._1h}
                onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.currentHour)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.currentHour} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$GraphPeriodButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.currentDay}
                buttonText={$texts._1d}
                onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.currentDay)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.currentDay} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$GraphPeriodButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.current7Days}
                buttonText={$texts._7d}
                onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.current7Days)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.currentWeek} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$GraphPeriodButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.currentMonth}
                buttonText={$texts._1M}
                onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.currentMonth)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.currentMonth} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$GraphPeriodButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.currentYear}
                buttonText={$texts._1Y}
                onClick={() => loadNodeLogsWithSpanPeriod(LogSpanPeriod.currentYear)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.currentYear} /></div>
            </Button>
            <div class="custom-date-div">
                <Button
                    enableToolTip={true}
                    selected={showCustomDatePicker}
                    style={selectedTimeSpan === LogSpanPeriod.customDate ? $SelectedCustomDateButtonStyle : $CustomDateButtonStyle}
                    buttonText=""
                    imageURL="/img/custom-date.svg"
                    onClick={() => {
                        showCustomDatePicker = !showCustomDatePicker;
                    }}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.customPeriod} /></div>
                </Button>
                <DateRangePicker
                    bind:initialDate
                    bind:endDate
                    bind:showToolTip={showCustomDatePicker}
                    requestCustomPeriod={(initial_date: Date, end_date: Date) => loadNodeLogsWithCustomPeriod(initial_date, end_date)}
                />
            </div>
        </div>
    {/if}
</div>

<style>
    .period-selection-div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        width: fit-content;
        height: fit-content;
    }

    .custom-date-div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
