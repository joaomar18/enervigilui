<script lang="ts">
    import { getElegantStringFromDate } from "$lib/logic/util/date";
    import type { PeakPowerType } from "$lib/types/device/energy";

    // Texts
    import { variableNameTexts } from "$lib/stores/lang/energyMeterTexts";
    import { texts } from "$lib/stores/lang/generalTexts";

    // Props
    export let metrics: PeakPowerType | undefined;

    // Layout / styling props
    export let paddingTop: string | undefined = undefined;
    export let paddingBottom: string | undefined = undefined;
    export let paddingHorizontal: string | undefined = undefined;
    export let borderBottom: string | undefined = undefined;
    export let labelColor: string | undefined = undefined;
    export let labelWeight: string | undefined = undefined;
    export let labelSize: string | undefined = undefined;
    export let labelPaddingBottom: string | undefined = undefined;
    export let labelBorderBottom: string | undefined = undefined;
    export let valueColor: string | undefined = undefined;
    export let valueWeight: string | undefined = undefined;
    export let valueSize: string | undefined = undefined;
    export let unitColor: string | undefined = undefined;
    export let unitWeight: string | undefined = undefined;
    export let unitSize: string | undefined = undefined;
    export let dateColor: string | undefined = undefined;
    export let dateWeight: string | undefined = undefined;
    export let dateSize: string | undefined = undefined;
    export let datePaddingBottom: string | undefined = undefined;
</script>

<div
    style="
        --padding-top: {paddingTop};
        --padding-bottom: {paddingBottom};
        --padding-horizontal: {paddingHorizontal};
        --border-bottom: {borderBottom};
        --label-color: {labelColor};
        --label-weight: {labelWeight};
        --label-size: {labelSize};
        --label-padding-bottom: {labelPaddingBottom};
        --label-border-bottom: {labelBorderBottom};
        --value-color: {valueColor};
        --value-weight: {valueWeight};
        --value-size: {valueSize};
        --unit-color: {unitColor};
        --unit-weight: {unitWeight};
        --unit-size: {unitSize};
        --date-color: {dateColor};
        --date-weight: {dateWeight};
        --date-size: {dateSize};
        --date-padding-bottom: {datePaddingBottom};
    "
    class="container"
>
    {#if metrics}
        <div class="row">
            <span class="label">{$variableNameTexts.apparent_power}</span>
            <div class="value-div">
                <span class="value">{metrics.apparent_power.max_value}</span>
                <span class="unit"></span>
            </div>
            {#if metrics.apparent_power.max_value_start_time && metrics.apparent_power.max_value_end_time}
                <div class="date-div">
                    <span class="date"
                        >{$texts.from.toLowerCase()}
                        {getElegantStringFromDate(new Date(metrics.apparent_power.max_value_start_time))}
                        {$texts.to.toLowerCase()}
                        {getElegantStringFromDate(new Date(metrics.apparent_power.max_value_end_time))}</span
                    >
                </div>
            {/if}
        </div>
        <div class="row">
            <span class="label">{$variableNameTexts.active_power}</span>
            <span class="value">{metrics.active_power.max_value}</span>
            <span class="unit"></span>
        </div>
        <div class="row">
            <span class="label">{$variableNameTexts.reactive_power}</span>
            <span class="value">{metrics.reactive_power.max_value}</span>
            <span class="unit"></span>
        </div>
    {/if}
</div>

<style>
</style>
