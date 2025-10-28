<script lang="ts">
    import InlineLoader from "../../../General/InlineLoader.svelte";
    import type { MeasurementMetrics } from "$lib/types/nodes/logs";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { GraphMetricStyle } from "$lib/style/graph";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $GraphMetricStyle;

    // Props
    export let forceColStack: boolean = false;
    export let metrics: MeasurementMetrics;
    export let unit: string = "";
    export let decimalPlaces: number | null;
    export let roundMetrics: boolean = false;

    // Layout / styling props
    export let iconSize: string | undefined = undefined;
    export let textSize: string | undefined = undefined;
    export let rowWidth: string | undefined = undefined;
    export let rowPaddingLeft: string | undefined = undefined;
    export let rowPaddingRight: string | undefined = undefined;
    export let rowBorderRight: string | undefined = undefined;
    export let labelWidth: string | undefined = undefined;
    export let labelPaddingLeft: string | undefined = undefined;
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
        iconSize,
        textSize,
        rowWidth,
        rowPaddingLeft,
        rowPaddingRight,
        rowBorderRight,
        labelWidth,
        labelPaddingLeft,
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

    // Reactive Statements
    $: if (metrics && roundMetrics && decimalPlaces !== null && decimalPlaces !== undefined) {
        if (metrics.min_value !== null) metrics.min_value = Number(metrics.min_value.toFixed(decimalPlaces));
        if (metrics.max_value !== null) metrics.max_value = Number(metrics.max_value.toFixed(decimalPlaces));
        if (metrics.average_value !== null) metrics.average_value = Number(metrics.average_value.toFixed(decimalPlaces));
    }
</script>

<!--
    MeasurementMetrics Component
    
    Displays statistical metrics (min, average, max) for measurement data with integrated 
    loading states. Features icon-enhanced layout with responsive design that switches 
    from horizontal rows to vertical stacking based on container width. Each metric row 
    includes a descriptive icon, label, numerical value with loading spinner, and unit. 
    Uses InlineLoader components to handle asynchronous data loading gracefully. Supports 
    comprehensive theming through CSS custom properties for colors, spacing, and typography. 
    Used primarily in graph headers to provide quick statistical overview of time-series data.
-->
<div
    style="
        --icon-size: {mergedStyle.iconSize};
        --text-size: {mergedStyle.textSize};
        --row-width: {mergedStyle.rowWidth};
        --row-padding-left: {mergedStyle.rowPaddingLeft};
        --row-padding-right: {mergedStyle.rowPaddingRight};
        --row-border-right: {mergedStyle.rowBorderRight};
        --label-width: {mergedStyle.labelWidth};
        --label-padding-left: {mergedStyle.labelPaddingLeft};
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
    class:force-col-stack={forceColStack}
>
    <div class="content">
        <div class="row">
            <img class="icon" src="/img/max-value.svg" alt="Max Value" />
            <span class="label">{$texts.maxValue}:</span>
            <div class="request-content">
                <InlineLoader loaded={!!metrics}>
                    <div class="loader-div">
                        {#if metrics.max_value !== null}
                            <span class="value">{metrics.max_value}</span>
                            <span class="unit">{unit}</span>
                        {:else}
                            <span class="no-data-label">{$texts.noDataAvailableShort}</span>
                        {/if}
                    </div>
                </InlineLoader>
            </div>
        </div>
        <div class="row">
            <img class="icon" src="/img/average-value.svg" alt="Mean Value" />
            <span class="label">{$texts.averageValue}:</span>
            <div class="request-content">
                <InlineLoader loaded={!!metrics}>
                    <div class="loader-div">
                        {#if metrics.average_value !== null}
                            <span class="value">{metrics.average_value}</span>
                            <span class="unit">{unit}</span>
                        {:else}
                            <span class="no-data-label">{$texts.noDataAvailableShort}</span>
                        {/if}
                    </div>
                </InlineLoader>
            </div>
        </div>
        <div class="row">
            <img class="icon" src="/img/min-value.svg" alt="Min Value" />
            <span class="label">{$texts.minValue}:</span>
            <div class="request-content">
                <InlineLoader loaded={!!metrics}>
                    <div class="loader-div">
                        {#if metrics.min_value !== null}
                            <span class="value">{metrics.min_value}</span>
                            <span class="unit">{unit}</span>
                        {:else}
                            <span class="no-data-label">{$texts.noDataAvailableShort}</span>
                        {/if}
                    </div>
                </InlineLoader>
            </div>
        </div>
    </div>
</div>

<style>
    /* Container query context - Enables responsive behavior based on container width */
    .container {
        container-type: inline-size;
    }

    
    .container.force-col-stack {
        .content {
            flex-direction: column;
            gap: 15px;
            align-items: start;
        }
        .row {
            width: 100%;
            padding: 0;
            border-right: none;
        }
    }

    /* Content wrapper - Flex container for metric rows with responsive direction */
    .content {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    /* Metric row - Individual stat display with icon, label, value, and unit */
    .row {
        box-sizing: border-box;
        margin: 0;
        width: var(--row-width);
        padding-left: var(--row-padding-left);
        padding-right: var(--row-padding-right);
        border-right: var(--row-border-right);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    /* Remove border from last row - Prevents trailing divider */
    .row:last-child {
        border-right: none;
    }

    /* Metric icon - Visual indicator for min/max/average (triangle/circle symbols) */
    .row .icon {
        width: var(--icon-size);
        height: var(--icon-size);
    }

    /* Metric label - Descriptive text with consistent spacing and typography */
    .row .label {
        text-align: left;
        padding-left: var(--label-padding-left);
        line-height: var(--icon-size);
        font-size: var(--text-size);
        width: var(--label-width);
        color: var(--label-color);
        font-weight: var(--label-weight);
    }

    /* Request content wrapper - Container for value/unit with loading state support */
    .row .request-content {
        min-width: 0;
        flex: 1;
        height: 100%;
    }

    /* Loader content layout - Flex container for value and unit with space distribution */
    .row .request-content .loader-div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    /* Metric value - Numerical data with flexible width and ellipsis overflow */
    .row .request-content .loader-div .value {
        text-align: right;
        font-size: var(--text-size);
        padding-right: var(--value-right-padding);
        line-height: var(--icon-size);
        min-width: 0;
        flex: 1;
        color: var(--value-color);
        font-weight: var(--value-weight);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Metric unit - Measurement unit display (kW, A, etc.) with constrained width */
    .row .request-content .loader-div .unit {
        text-align: right;
        font-size: var(--text-size);
        line-height: var(--icon-size);
        min-width: 0;
        width: fit-content;
        max-width: var(--unit-max-width);
        color: var(--unit-color);
        font-weight: var(--unit-weight);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* No-data indicator - Fallback text displayed when metric values are null */
    .row .request-content .loader-div .no-data-label {
        text-align: right;
        font-size: var(--text-size);
        line-height: var(--icon-size);
        width: fit-content;
        color: var(--no-data-label-color);
        font-weight: var(--no-data-label-weight);
        width: 100%;
    }

    /* Responsive stacking - Switch to vertical layout when container is too narrow */
    @container (max-width: calc(350px * 3)) {
        .content {
            flex-direction: column;
            gap: 15px;
            align-items: start;
        }
        .row {
            width: 100%;
            padding: 0;
            border-right: none;
        }
    }
</style>
