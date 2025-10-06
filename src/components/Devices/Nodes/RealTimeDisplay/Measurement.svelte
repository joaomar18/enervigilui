<script lang="ts">
    import BaseDisplay from "./BaseDisplay.svelte";
    import Bar from "../../../General/Bar.svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { MeasurementDisplayStyle, NodesBaseDisplayStyle } from "$lib/style/nodes";

    // Props
    export let disableLabel: boolean = false;
    export let disableClick: boolean = false;
    export let labelText: string;
    export let minAlarmValue: number | null = null;
    export let maxAlarmValue: number | null = null;
    export let value: number | null;
    export let unitText: string;
    export let decimalPlaces: number | undefined;

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    export let baseDisplayStyle: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $MeasurementDisplayStyle;
    $: baseDisplayStyle = baseDisplayStyle ?? $NodesBaseDisplayStyle;

    // Layout / styling props
    export let valueTextSize: string | undefined = undefined;
    export let valueTextColor: string | undefined = undefined;
    export let valueTextSpacing: string | undefined = undefined;
    export let valueTextWeight: string | undefined = undefined;
    export let valueTextPaddingRight: string | undefined = undefined;
    export let unitTextSize: string | undefined = undefined;
    export let unitTextColor: string | undefined = undefined;
    export let unitTextWeight: string | undefined = undefined;
    export let unitTextPaddingLeft: string | undefined = undefined;
    export let barWidth: string | undefined = undefined;
    export let barHeight: string | undefined = undefined;

    $: localOverrides = {
        valueTextSize,
        valueTextColor,
        valueTextSpacing,
        valueTextWeight,
        valueTextPaddingRight,
        unitTextSize,
        unitTextColor,
        unitTextWeight,
        unitTextPaddingLeft,
        barWidth,
        barHeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let variableAlarm: boolean = false;
    let variableWarning: boolean = false;
    let valueAlarm: boolean = false;
    let valueWarning: boolean = false;
    let valueDisconnected: boolean = false;

    // Reactive Statements
    $: variableAlarm = valueAlarm;
    $: variableWarning = valueWarning;
    $: valueDisconnected = value === null;

    // Click Export Function
    export let onClick: (() => void) | null = null;
</script>

<BaseDisplay
    style={baseDisplayStyle}
    {disableLabel}
    {disableClick}
    {labelText}
    alarmState={variableAlarm}
    warningState={variableWarning}
    {valueDisconnected}
    {onClick}
>
    <div
        style="
            --value-text-size: {mergedStyle.valueTextSize};
            --value-text-color: {mergedStyle.valueTextColor};
            --value-text-spacing: {mergedStyle.valueTextSpacing};
            --value-text-weight: {mergedStyle.valueTextWeight};
            --value-text-padding-right: {mergedStyle.valueTextPaddingRight};
            --unit-text-size: {mergedStyle.unitTextSize};
            --unit-text-color: {mergedStyle.unitTextColor};
            --unit-text-weight: {mergedStyle.unitTextWeight};
            --unit-text-padding-left: {mergedStyle.unitTextPaddingLeft};
            --bar-width: {mergedStyle.barWidth};
            --bar-height: {mergedStyle.barHeight};
        "
        class="slot-content"
        slot="content"
    >
        <div class="value-div">
            {#if !valueDisconnected}
                <span class="value">{value?.toFixed(decimalPlaces || 0)}</span>
            {/if}
        </div>

        <span class="unit">{unitText}</span>

        {#if (minAlarmValue !== null || maxAlarmValue !== null) && value !== null}
            <div class="bar-value-div">
                <Bar
                    bind:alarmDetected={valueAlarm}
                    bind:warningDetected={valueWarning}
                    currentValue={value}
                    {minAlarmValue}
                    minWarningValue={minAlarmValue !== null ? minAlarmValue * 1.05 : null}
                    {maxAlarmValue}
                    maxWarningValue={maxAlarmValue !== null ? maxAlarmValue * 0.95 : null}
                />
            </div>
        {/if}
    </div>
</BaseDisplay>

<style>
    .slot-content {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .value-div {
        box-sizing: border-box;
        padding: 0;
        padding-right: var(--value-text-padding-right);
        width: 70%;
        min-width: 0;
        line-height: 1;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    .value-div .value {
        font-size: var(--value-text-size);
        color: var(--value-text-color);
        letter-spacing: var(--value-text-spacing);
        font-weight: var(--value-text-weight);
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        line-height: 1;
        font-variant-numeric: tabular-nums;
        font-feature-settings:
            "tnum" 1,
            "lnum" 1;
    }

    .unit {
        box-sizing: border-box;
        padding: 0;
        font-size: var(--unit-text-size);
        color: var(--unit-text-color);
        font-weight: var(--unit-text-weight);
        padding-left: var(--unit-text-padding-left);
        text-align: right;
        width: 30%;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
    }

    .bar-value-div {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0px;
        width: var(--bar-width);
        height: var(--bar-height);
    }
</style>
