<script lang="ts">
    import type { CounterLogPoint } from "$lib/types/nodes/logs";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { GraphDataToolTipStyle } from "$lib/style/graph";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $GraphDataToolTipStyle;

    // Props
    export let logPoint: CounterLogPoint | null;
    export let unit: string = "";

    // Layout / styling props
    export let rowGap: string | undefined = undefined;
    export let textSize: string | undefined = undefined;
    export let labelWidth: string | undefined = undefined;
    export let labelColor: string | undefined = undefined;
    export let labelWeight: string | undefined = undefined;
    export let valueRightPadding: string | undefined = undefined;
    export let valueColor: string | undefined = undefined;
    export let valueWeight: string | undefined = undefined;
    export let unitMaxWidth: string | undefined = undefined;
    export let unitColor: string | undefined = undefined;
    export let unitWeight: string | undefined = undefined;
    export let noDataLabelColor: string | undefined = undefined;
    export let noDataLabelWeight: string | undefined = undefined;

    $: localOverrides = {
        rowGap,
        textSize,
        labelWidth,
        labelColor,
        labelWeight,
        valueRightPadding,
        valueColor,
        valueWeight,
        unitMaxWidth,
        unitColor,
        unitWeight,
        noDataLabelColor,
        noDataLabelWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);
</script>

<!--
    CounterToolTip Component
    
    Interactive tooltip for counter graph data points displaying accumulated values and 
    time range information. Shows the total accumulated value for counter nodes over 
    the selected time period, along with start and end timestamps. Features null-safe 
    rendering with fallback "No Data Available" state when counter values are missing.
    Supports comprehensive theming through CSS custom properties and uses the shared 
    GraphDataToolTipStyle for consistent appearance across graph tooltips. Designed 
    specifically for counter/accumulator data visualization in time-series graphs.
-->
{#if logPoint}
    <div
        style="
            --row-gap: {mergedStyle.rowGap};
            --text-size: {mergedStyle.textSize};
            --label-width: {mergedStyle.labelWidth};
            --label-color: {mergedStyle.labelColor};
            --label-weight: {mergedStyle.labelWeight};
            --value-right-padding: {mergedStyle.valueRightPadding};
            --value-color: {mergedStyle.valueColor};
            --value-weight: {mergedStyle.valueWeight};
            --unit-max-width: {mergedStyle.unitMaxWidth};
            --unit-color: {mergedStyle.unitColor};
            --unit-weight: {mergedStyle.unitWeight};
            --no-data-label-color: {mergedStyle.noDataLabelColor};
            --no-data-label-weight: {mergedStyle.noDataLabelWeight};
        "
        class="container"
    >
        <div class="content">
            {#if logPoint.value !== null}
                <div class="row">
                    <span class="label">{$texts.total}</span>
                    <span class="value">{logPoint.value}</span>
                    <span class="unit">{unit}</span>
                </div>
            {:else}
                <div class="row">
                    <span class="value no-data-label center">{$texts.noDataAvailableShort}</span>
                </div>
            {/if}
            <div class="row">
                <span class="label">{$texts.fromDate}</span>
                <span class="value no-padding">{logPoint.start_time}</span>
            </div>
            <div class="row">
                <span class="label">{$texts.toDate}</span>
                <span class="value no-padding">{logPoint.end_time}</span>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Content container - Vertical flexbox layout for measurement data rows */
    .content {
        margin: 0;
        padding: 0;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: var(--row-gap);
    }

    /* Data row - Horizontal layout for label, value, and unit triplets */
    .row {
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* Measurement label - Fixed width area for abbreviated labels (Máx, Méd, Mín) */
    .label {
        text-align: left;
        width: var(--label-width);
        font-size: var(--text-size);
        color: var(--label-color);
        font-weight: var(--label-weight);
    }

    /* Measurement value - Flexible area for numeric data with ellipsis overflow */
    .value {
        min-width: 0;
        padding: 0;
        padding-right: var(--value-right-padding);
        flex: 1;
        text-align: right;
        font-size: var(--text-size);
        color: var(--value-color);
        font-weight: var(--value-weight);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* No-data state modifier - Applied when measurement values are null */
    .value.no-data-label {
        color: var(--no-data-label-color);
        font-weight: var(--no-data-label-weight);
    }

    /* Center alignment modifier - Used for special cases like time ranges */
    .value.center {
        text-align: center;
    }

    /* No padding modifier - Removes right padding for specific layouts */
    .value.no-padding {
        padding: 0;
    }

    /* Unit display - Right-aligned area for measurement units with ellipsis overflow */
    .unit {
        width: fit-content;
        max-width: var(--unit-max-width);
        text-align: right;
        font-size: var(--text-size);
        color: var(--unit-color);
        font-weight: var(--unit-weight);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
