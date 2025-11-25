<script lang="ts">
    import InlineLoader from "../../../General/InlineLoader.svelte";
    import DateRangeChecker from "../../../General/TimeDate/DateRangeChecker.svelte";
    import type { MeasurementMetrics } from "$lib/types/nodes/logs";
    import type { PeakPowerType } from "$lib/types/device/energy";

    // Texts
    import { variableNameTexts } from "$lib/stores/lang/energyMeterTexts";
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { ToolTipDateCheckerPeakPowerStyle } from "$lib/style/device";

    // Props
    export let metrics: PeakPowerType | undefined;
    export let dataFetched: boolean;
    export let firstFetch: boolean;

    // Layout / styling props
    export let paddingTop: string | undefined = "5px";
    export let paddingBottom: string | undefined = "15px";
    export let paddingHorizontal: string | undefined = "20px";
    export let rowPaddingTop: string | undefined = "15px";
    export let rowPaddingBottom: string | undefined = "5px";
    export let rowBorderBottom: string | undefined = "1px solid rgba(255, 255, 255, 0.12)";
    export let rowBorderBottomHover: string | undefined = "1px solid rgba(255, 255, 255, 0.18)";
    export let labelColor: string | undefined = "#D4D4D8";
    export let labelWeight: string | undefined = "500";
    export let labelSize: string | undefined = "1rem";
    export let labelPaddingBottom: string | undefined = "5px";
    export let labelBorderBottom: string | undefined = "none";
    export let valuePaddingTop: string | undefined = "10px";
    export let valuePaddingRight: string | undefined = "5px";
    export let valueColor: string | undefined = "#E4E4E7";
    export let valueWeight: string | undefined = "600";
    export let valueSize: string | undefined = "1.0625rem";
    export let valueTextSpacing: string | undefined = "0.25px";
    export let unitMaxWidth: string | undefined = "150px";
    export let unitColor: string | undefined = "#A1A1AA";
    export let unitWeight: string | undefined = "400";
    export let unitSize: string | undefined = "1.0625rem";
    export let noDataLabelColor: string | undefined = "rgba(255, 255, 255, 0.4)";
    export let noDataLabelWeight: string | undefined = "400";

    // Variables
    let showLoader: boolean = false;
    let showDateCheckerActivePower: boolean = false;
    let showDateCheckerReactivePower: boolean = false;
    let showDateCheckerApparentPower: boolean = false;
    let loaderTimeout: number | null = null;
    let activePowerMetrics: MeasurementMetrics;
    let reactivePowerMetrics: MeasurementMetrics;
    let apparentPowerMetrics: MeasurementMetrics;
    let activePowerUnit: string;
    let reactivePowerUnit: string;
    let apparentPowerUnit: string;
    let activePowerDp: number | null;
    let reactivePowerDp: number | null;
    let apparentPowerDp: number | null;

    // Reactive Statements
    $: if (!dataFetched && !showLoader) {
        if (firstFetch) {
            loaderTimeout = setTimeout(() => {
                showLoader = !dataFetched;
            }, 500);
        } else {
            showLoader = true;
        }
    }
    $: if (dataFetched) {
        if (loaderTimeout) {
            clearInterval(loaderTimeout);
            loaderTimeout = null;
        }
        showLoader = false;
    }

    $: activePowerMetrics = metrics?.active_power.global_metrics as MeasurementMetrics;
    $: reactivePowerMetrics = metrics?.reactive_power.global_metrics as MeasurementMetrics;
    $: apparentPowerMetrics = metrics?.apparent_power.global_metrics as MeasurementMetrics;
    $: activePowerUnit = metrics?.active_power.unit ?? "";
    $: reactivePowerUnit = metrics?.reactive_power.unit ?? "";
    $: apparentPowerUnit = metrics?.apparent_power.unit ?? "";
    $: activePowerDp = metrics?.active_power.decimal_places ?? null;
    $: reactivePowerDp = metrics?.reactive_power.decimal_places ?? null;
    $: apparentPowerDp = metrics?.apparent_power.decimal_places ?? null;
</script>

<div
    style="
        --padding-top: {paddingTop};
        --padding-bottom: {paddingBottom};
        --padding-horizontal: {paddingHorizontal};
        --row-padding-top: {rowPaddingTop};
        --row-padding-bottom: {rowPaddingBottom};
        --row-border-bottom: {rowBorderBottom};
        --row-border-bottom-hover: {rowBorderBottomHover};
        --label-color: {labelColor};
        --label-weight: {labelWeight};
        --label-size: {labelSize};
        --label-padding-bottom: {labelPaddingBottom};
        --label-border-bottom: {labelBorderBottom};
        --value-padding-top: {valuePaddingTop};
        --value-padding-right: {valuePaddingRight};
        --value-color: {valueColor};
        --value-weight: {valueWeight};
        --value-size: {valueSize};
        --value-text-spacing: {valueTextSpacing};
        --unit-max-width: {unitMaxWidth};
        --unit-color: {unitColor};
        --unit-weight: {unitWeight};
        --unit-size: {unitSize};
        --no-data-label-weight: {noDataLabelWeight};
        --no-data-label-color: {noDataLabelColor};
    "
    class="container"
>
    <div class="content">
        <div class="row" class:active={apparentPowerMetrics?.max_value_start_time && apparentPowerMetrics?.max_value_end_time}>
            <div class="label-div">
                <span class="label">{$variableNameTexts.apparent_power}</span>
                {#if apparentPowerMetrics?.max_value_start_time && apparentPowerMetrics?.max_value_end_time}
                    <img class="period-check" src="/img/calendar-icon.svg" alt="Period check" />
                    <img class="period-check-hovered" src="/img/calendar-icon-hovered.svg" alt="Period check hovered" />
                {/if}
            </div>
            <InlineLoader loaded={!showLoader}>
                <div class="value-div">
                    {#if apparentPowerMetrics?.max_value !== null && apparentPowerMetrics?.max_value !== undefined}
                        <span class="value"
                            >{apparentPowerDp ? apparentPowerMetrics?.max_value.toFixed(apparentPowerDp) : apparentPowerMetrics?.max_value}</span
                        >
                        <span class="unit">{apparentPowerUnit}</span>
                    {:else}
                        <span class="no-data-label">{$texts.noDataAvailableShort}</span>
                    {/if}
                </div>
            </InlineLoader>
            {#if apparentPowerMetrics?.max_value_start_time && apparentPowerMetrics?.max_value_end_time}
                <button
                    aria-label="Show date range"
                    on:click={() => {
                        showDateCheckerApparentPower = !showDateCheckerApparentPower;
                    }}
                ></button>
                <DateRangeChecker
                    toolTipStyle={$ToolTipDateCheckerPeakPowerStyle}
                    bind:showToolTip={showDateCheckerApparentPower}
                    initialDate={new Date(apparentPowerMetrics?.max_value_start_time)}
                    endDate={new Date(apparentPowerMetrics?.max_value_end_time)}
                />
            {/if}
        </div>
        <div class="row" class:active={activePowerMetrics?.max_value_start_time && activePowerMetrics?.max_value_end_time}>
            <div class="label-div">
                <span class="label">{$variableNameTexts.active_power}</span>
                {#if activePowerMetrics?.max_value_start_time && activePowerMetrics?.max_value_end_time}
                    <img class="period-check" src="/img/calendar-icon.svg" alt="Period check" />
                    <img class="period-check-hovered" src="/img/calendar-icon-hovered.svg" alt="Period check hovered" />
                {/if}
            </div>
            <InlineLoader loaded={!showLoader}>
                <div class="value-div">
                    {#if activePowerMetrics?.max_value !== null && activePowerMetrics?.max_value !== undefined}
                        <span class="value">{activePowerDp ? activePowerMetrics?.max_value.toFixed(activePowerDp) : activePowerMetrics?.max_value}</span>
                        <span class="unit">{activePowerUnit}</span>
                    {:else}
                        <span class="no-data-label">{$texts.noDataAvailableShort}</span>
                    {/if}
                </div>
            </InlineLoader>
            {#if activePowerMetrics?.max_value_start_time && activePowerMetrics?.max_value_end_time}
                <button
                    aria-label="Show date range"
                    on:click={() => {
                        showDateCheckerActivePower = !showDateCheckerActivePower;
                    }}
                ></button>
                <DateRangeChecker
                    toolTipStyle={$ToolTipDateCheckerPeakPowerStyle}
                    bind:showToolTip={showDateCheckerActivePower}
                    initialDate={new Date(activePowerMetrics?.max_value_start_time)}
                    endDate={new Date(activePowerMetrics?.max_value_end_time)}
                />
            {/if}
        </div>
        <div class="row" class:active={reactivePowerMetrics?.max_value_start_time && reactivePowerMetrics?.max_value_end_time}>
            <div class="label-div">
                <span class="label">{$variableNameTexts.reactive_power}</span>
                {#if reactivePowerMetrics?.max_value_start_time && reactivePowerMetrics?.max_value_end_time}
                    <img class="period-check" src="/img/calendar-icon.svg" alt="Period check" />
                    <img class="period-check-hovered" src="/img/calendar-icon-hovered.svg" alt="Period check hovered" />
                {/if}
            </div>
            <InlineLoader loaded={!showLoader}>
                <div class="value-div">
                    {#if reactivePowerMetrics?.max_value !== null && reactivePowerMetrics?.max_value !== undefined}
                        <span class="value"
                            >{reactivePowerDp ? reactivePowerMetrics?.max_value.toFixed(reactivePowerDp) : reactivePowerMetrics?.max_value}</span
                        >
                        <span class="unit">{reactivePowerUnit}</span>
                    {:else}
                        <span class="no-data-label">{$texts.noDataAvailableShort}</span>
                    {/if}
                </div>
            </InlineLoader>
            {#if reactivePowerMetrics?.max_value_start_time && reactivePowerMetrics?.max_value_end_time}
                <button
                    aria-label="Show date range"
                    on:click={() => {
                        showDateCheckerReactivePower = !showDateCheckerReactivePower;
                    }}
                ></button>
                <DateRangeChecker
                    toolTipStyle={$ToolTipDateCheckerPeakPowerStyle}
                    bind:showToolTip={showDateCheckerReactivePower}
                    initialDate={new Date(reactivePowerMetrics?.max_value_start_time)}
                    endDate={new Date(reactivePowerMetrics?.max_value_end_time)}
                />
            {/if}
        </div>
    </div>
</div>

<style>
    .container {
        box-sizing: border-box;
        margin: 0;
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        width: 100%;
        height: fit-content;
    }

    .content {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: fit-content;
    }

    .content .row {
        padding: 0;
        margin: 0;
        position: relative;
        padding-top: var(--row-padding-top);
        padding-bottom: var(--row-padding-bottom);
        border-bottom: var(--row-border-bottom);
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }

    .content .row.active:hover {
        border-bottom: var(--row-border-bottom-hover);
    }

    .label-div {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .label {
        text-align: left;
        color: var(--label-color);
        font-weight: var(--label-weight);
        font-size: var(--label-size);
        padding-bottom: var(--label-padding-bottom);
        border-bottom: var(--label-border-bottom);
        flex: 1;
        line-height: 24px;
    }

    .period-check,
    .period-check-hovered {
        width: 24px;
        height: 24px;
    }

    .period-check-hovered {
        display: none;
    }

    .content .row:hover .period-check {
        display: none;
    }

    .content .row:hover .period-check-hovered {
        display: block;
    }

    .value-div {
        padding: 0;
        padding-top: var(--value-padding-top);
        display: flex;
        flex-direction: row;
        align-items: baseline;
        justify-content: end;
    }

    .value {
        padding: 0;
        padding-right: var(--value-padding-right);
        color: var(--value-color);
        font-size: var(--value-size);
        font-weight: var(--value-weight);
        letter-spacing: var(--value-text-spacing);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        text-align: right;
        min-width: 0;
        line-height: 1;
        font-variant-numeric: tabular-nums;
        font-feature-settings:
            "tnum" 1,
            "lnum" 1;
    }

    .no-data-label {
        padding: 0;
        padding-right: var(--value-padding-right);
        color: var(--no-data-label-color);
        font-size: var(--value-size);
        font-weight: var(--no-data-label-weight);
        letter-spacing: var(--value-text-spacing);
        flex: 1;
        text-align: right;
        line-height: 1;
    }

    .unit {
        padding: 0;
        width: fit-content;
        max-width: var(--unit-max-width);
        color: var(--unit-color);
        font-size: var(--unit-size);
        font-weight: var(--unit-weight);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    button {
        position: absolute;
        inset: 0;
        border: none;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
</style>
