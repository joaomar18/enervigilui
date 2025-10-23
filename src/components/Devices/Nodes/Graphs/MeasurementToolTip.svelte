<script lang="ts">
    import type { MeasurementLogPoint } from "$lib/types/nodes/logs";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { MeasurementToolTipStyle } from "$lib/style/graph";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $MeasurementToolTipStyle;

    // Props
    export let logPoint: MeasurementLogPoint | null;
    export let unit: string = "";

    // Layout / styling props
    export let rowGap: string | undefined = undefined;
    export let textSize: string | undefined = undefined;
    export let labelColor: string | undefined = undefined;
    export let labelWeight: string | undefined = undefined;
    export let valueColor: string | undefined = undefined;
    export let valueWeight: string | undefined = undefined;

    $: localOverrides = {
        rowGap,
        textSize,
        labelColor,
        labelWeight,
        valueColor,
        valueWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);
</script>

{#if logPoint}
    <div
        style="
            --row-gap: {mergedStyle.rowGap};
            --text-size: {mergedStyle.textSize};
            --label-color: {mergedStyle.labelColor};
            --label-weight: {mergedStyle.labelWeight};
            --value-color: {mergedStyle.valueColor};
            --value-weight: {mergedStyle.valueWeight};
        "
        class="container"
    >
        <div class="content">
            <div class="row">
                <span class="label">Valor máximo</span>
                <span class="value">{logPoint.max_value} {unit}</span>
            </div>
            <div class="row">
                <span class="label">Valor médio</span>
                <span class="value">{logPoint.average_value} {unit}</span>
            </div>
            <div class="row">
                <span class="label">Valor mínimo</span>
                <span class="value">{logPoint.min_value} {unit}</span>
            </div>
            <div class="row">
                <span class="label">De</span>
                <span class="value">{logPoint.start_time}</span>
            </div>
            <div class="row">
                <span class="label">Até</span>
                <span class="value">{logPoint.end_time}</span>
            </div>
        </div>
    </div>
{/if}

<style>
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

    .row {
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .label {
        text-align: left;
        font-size: var(--text-size);
        color: var(--label-color);
        font-weight: var(--label-weight);
    }

    .value {
        flex: 1;
        text-align: right;
        font-size: var(--text-size);
        color: var(--value-color);
        font-weight: var(--value-weight);
    }
</style>
