<script lang="ts">
    import type { NodeDetailedState } from "$lib/types/nodes/base";
    import CircularLoader from "../../../General/CircularLoader.svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { CounterDisplayStyle } from "$lib/style/nodes";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $CounterDisplayStyle;

    // Props
    export let nodeDetailedState: NodeDetailedState | null;

    // Variables
    let disconnected: boolean;
    let minAlarm: boolean;
    let maxAlarm: boolean;
    let minWarning: boolean;
    let maxWarning: boolean;

    // Reactive Statements
    $: disconnected = nodeDetailedState?.value === null;
    $: minAlarm =
        nodeDetailedState !== null &&
        !isNaN(Number(nodeDetailedState.min_alarm_value)) &&
        !isNaN(Number(nodeDetailedState.value)) &&
        Number(nodeDetailedState.min_alarm_value) >= Number(nodeDetailedState.value);
    $: maxAlarm =
        nodeDetailedState !== null &&
        !isNaN(Number(nodeDetailedState.min_alarm_value)) &&
        !isNaN(Number(nodeDetailedState.value)) &&
        Number(nodeDetailedState.value) >= Number(nodeDetailedState.max_alarm_value);
    $: minWarning =
        nodeDetailedState !== null &&
        !minAlarm &&
        nodeDetailedState.min_alarm_value !== undefined &&
        nodeDetailedState.value !== undefined &&
        !isNaN(Number(nodeDetailedState.min_alarm_value)) &&
        !isNaN(Number(nodeDetailedState.value)) &&
        Number(nodeDetailedState.min_alarm_value * 1.05) >= Number(nodeDetailedState.value);
    $: maxWarning =
        nodeDetailedState !== null &&
        !maxAlarm &&
        nodeDetailedState.max_alarm_value !== undefined &&
        nodeDetailedState.value !== undefined &&
        !isNaN(Number(nodeDetailedState.min_alarm_value)) &&
        !isNaN(Number(nodeDetailedState.value)) &&
        Number(nodeDetailedState.value) >= Number(nodeDetailedState.max_alarm_value * 0.95);

    // Layout / styling props
    export let minHeight: string | undefined = "150px";
    export let backgroundColor: string | undefined = "#0f1015";
    export let border: string | undefined = "1px solid rgba(255, 255, 255, 0.1)";
    export let pushTopPx: string | undefined = "20px";
    export let borderRadius: string | undefined = "20px";
    export let paddingTop: string | undefined = "15px";
    export let paddingBottom: string | undefined = "15px";
    export let paddingHorizontal: string | undefined = "20px";
    export let rowHeight: string | undefined = "30px";
    export let titleSize: string | undefined = "13px";
    export let titleColor: string | undefined = "#9CA3AF";
    export let titleWeight: string | undefined = "400";
    export let titleSpacing: string | undefined = "0.5px";
    export let titleTextTransform: string | undefined = "uppercase";
    export let labelSize: string | undefined = "14px";
    export let labelColor: string | undefined = "white";
    export let labelWeight: string | undefined = "400";

    $: localOverrides = {
        minHeight,
        backgroundColor,
        border,
        pushTopPx,
        borderRadius,
        paddingTop,
        paddingBottom,
        paddingHorizontal,
        rowHeight,
        titleSize,
        titleColor,
        titleWeight,
        titleSpacing,
        titleTextTransform,
        labelSize,
        labelColor,
        labelWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);
</script>

<div
    style="
        --min-height: {mergedStyle.minHeight};
        --background-color: {mergedStyle.backgroundColor};
        --border: {mergedStyle.border};
        --push-top: {`${-parseInt(String(mergedStyle.pushTopPx))}px`};
        --border-radius: {mergedStyle.borderRadius};
        --padding-top: {`${parseInt(String(mergedStyle.pushTopPx)) + parseInt(String(mergedStyle.paddingTop))}px`};
        --padding-bottom: {mergedStyle.paddingBottom};
        --padding-horizontal: {mergedStyle.paddingHorizontal};
        --row-height: {mergedStyle.rowHeight};
        --title-size: {mergedStyle.titleSize};
        --title-color: {mergedStyle.titleColor};
        --title-weight: {mergedStyle.titleWeight};
        --title-spacing: {mergedStyle.titleSpacing};
        --title-text-transform: {mergedStyle.titleTextTransform};
        --label-size: {mergedStyle.labelSize};
        --label-color: {mergedStyle.labelColor};
        --label-weight: {mergedStyle.labelWeight};
    "
    class="detailed-info-div"
>
    <div class="content">
        {#if nodeDetailedState}
            <div class="state-div">
                <div class="row">
                    <span class="label">Estado</span>
                    <div class="row-content"></div>
                </div>
                <div class="header">
                    <h3>Alarmes</h3>
                </div>
                <div class="row">
                    <span class="label">Valor Mínimo</span>
                    <div class="row-content"></div>
                </div>
                <div class="row">
                    <span class="label">Valor Máximo</span>
                    <div class="row-content"></div>
                </div>
                <div class="header">
                    <h3>AVISOS</h3>
                </div>
                <div class="row">
                    <span class="label">Valor Mínimo</span>
                    <div class="row-content"></div>
                </div>
                <div class="row">
                    <span class="label">Valor Máximo</span>
                    <div class="row-content"></div>
                </div>
                <div class="header">
                    <h3>AVISOS</h3>
                </div>
                <div class="row">
                    <span class="label">Última Atualização</span>
                    <div class="row-content"></div>
                </div>
                {#if nodeDetailedState.incremental}
                    <div class="row">
                        <span class="label">Última Inicialização</span>
                        <div class="row-content"></div>
                    </div>
                {/if}
            </div>
        {:else}
            <CircularLoader loaderTopPos={`${parseInt(String(pushTopPx)) / 2}px`} />
        {/if}
    </div>
</div>

<style>
    .detailed-info-div {
        margin: 0;
        padding: 0;
        margin-top: var(--push-top);
        width: 100%;
        height: fit-content;
        min-height: 0;
        background-color: var(--background-color);
        border: var(--border);
        overflow: hidden;
        border-radius: var(--border-radius);
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
    }

    .content {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: fit-content;
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        min-height: var(--min-height);
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 200px;
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
        scrollbar-gutter: stable both-edges;
    }

    .content .state-div {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 10px;
    }

    .content .state-div .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: var(--row-height);
    }

    .header {
        width: 100%;
        border-bottom: var(--border);
    }

    .header h3 {
        margin: 0;
        padding: 0;
        font-size: var(--title-size);
        color: var(--title-color);
        font-weight: var(--title-weight);
        letter-spacing: var(--title-spacing);
        text-transform: var(--title-text-transform);
    }

    .label {
        font-size: var(--label-size);
        color: var(--label-color);
        font-weight: var(--label-weight);
    }

    .row-content {
        flex-grow: 1;
        min-width: 0;
        display: flex;
        height: 100%;
    }
</style>
