<script lang="ts">
    import BaseDisplay from "./BaseDisplay.svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { CounterDisplayStyle } from "$lib/style/nodes";

    // Props
    export let labelText: string;
    export let value: number | null;
    export let unitText: string;

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $CounterDisplayStyle;

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
    let valueDisconnected: boolean = false;

    // Reactive Statements
    $: valueDisconnected = value === null;
</script>

<BaseDisplay {labelText} {valueDisconnected}>
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
                <span class="value">{value}</span>
            {/if}
        </div>

        <span class="unit">{unitText}</span>
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
</style>
