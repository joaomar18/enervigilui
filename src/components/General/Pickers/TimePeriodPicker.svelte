<script lang="ts">
    import { onDestroy } from "svelte";
    import { LogSpanPeriod } from "$lib/types/view/nodes";
    import Button from "../Button.svelte";
    import ToolTip from "../ToolTip.svelte";
    import ToolTipText from "../ToolTipText.svelte";
    import DateRangePicker from "../TimeDate/DateRangePicker.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { PickerToolTipStyle } from "$lib/style/general";
    import { PickerToolTipButtonStyle } from "$lib/style/general";
    import { PickerButtonStyle } from "$lib/style/general";
    import { CustomDateButtonStyle } from "$lib/style/general";
    import { SelectedCustomDateButtonStyle } from "$lib/style/general";

    // Style object (from theme)
    export let toolTipButtonStyle: { [property: string]: string | number } | null = null;
    $: effectiveToolTipButtonStyle = toolTipButtonStyle ?? $PickerToolTipButtonStyle;

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
    export let changeSpanPeriod: (timeSpan: LogSpanPeriod) => void;
    export let changeSpanPeriodCustom: (initial_date: Date, end_date: Date) => void;

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
    TimePeriodPicker Component
    
    A versatile time period selection interface with dual presentation modes for filtering
    temporal data ranges. Features both tooltip-based popup and inline display modes,
    offering predefined quick-select periods (1h, 1d, 7d, 1M, 1Y) with internationalized
    labels and comprehensive tooltips. Integrates custom date range picker with calendar
    selection capabilities and maintains reactive state synchronization between selection
    modes. Implements click-outside detection for modal behavior, automatic event listener
    cleanup, and right-aligned tooltip positioning for optimal UI placement.
    
    The component supports both compact trigger button mode (useToolTip=true) and expanded
    inline selection interface (useToolTip=false), handles window event delegation for
    responsive interactions, and provides callback functions for period selection events.
    Maintains visual selection states across all time period options and seamlessly
    integrates DateRangePicker for custom date range functionality with proper binding
    and state management.
-->
<div bind:this={containerDiv}>
    {#if useToolTip}
        <ToolTip
            style={$PickerToolTipStyle}
            maxWidth="auto"
            zIndex={198}
            forceShowMobile={true}
            showToolTip={showSelectionToolTip}
            autoPositionContinuous={true}
            alignType="right"
        >
            <div class="period-selection-div">
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.currentHour}
                    buttonText={$texts._1h}
                    onClick={() => changeSpanPeriod(LogSpanPeriod.currentHour)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.currentHour} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.currentDay}
                    buttonText={$texts._1d}
                    onClick={() => changeSpanPeriod(LogSpanPeriod.currentDay)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.currentDay} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.current7Days}
                    buttonText={$texts._7d}
                    onClick={() => changeSpanPeriod(LogSpanPeriod.current7Days)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.currentWeek} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.currentMonth}
                    buttonText={$texts._1M}
                    onClick={() => changeSpanPeriod(LogSpanPeriod.currentMonth)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.currentMonth} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedTimeSpan === LogSpanPeriod.currentYear}
                    buttonText={$texts._1Y}
                    onClick={() => changeSpanPeriod(LogSpanPeriod.currentYear)}
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
                        requestCustomPeriod={(initial_date: Date, end_date: Date) => changeSpanPeriodCustom(initial_date, end_date)}
                    />
                </div>
            </div>
        </ToolTip>

        <Button
            style={effectiveToolTipButtonStyle}
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
                style={$PickerButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.currentHour}
                buttonText={$texts._1h}
                onClick={() => changeSpanPeriod(LogSpanPeriod.currentHour)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.currentHour} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.currentDay}
                buttonText={$texts._1d}
                onClick={() => changeSpanPeriod(LogSpanPeriod.currentDay)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.currentDay} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.current7Days}
                buttonText={$texts._7d}
                onClick={() => changeSpanPeriod(LogSpanPeriod.current7Days)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.currentWeek} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.currentMonth}
                buttonText={$texts._1M}
                onClick={() => changeSpanPeriod(LogSpanPeriod.currentMonth)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.currentMonth} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedTimeSpan === LogSpanPeriod.currentYear}
                buttonText={$texts._1Y}
                onClick={() => changeSpanPeriod(LogSpanPeriod.currentYear)}
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
                    requestCustomPeriod={(initial_date: Date, end_date: Date) => changeSpanPeriodCustom(initial_date, end_date)}
                />
            </div>
        </div>
    {/if}
</div>

<style>
    /* Period selection container - Horizontal layout for time period buttons and custom date picker */
    .period-selection-div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        width: fit-content;
        height: fit-content;
    }

    /* Custom date section - Wrapper for custom date button and integrated DateRangePicker component */
    .custom-date-div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
