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
    export let paddingTop: string | undefined = "10px";
    export let paddingBottom: string | undefined = "20px";
    export let paddingHorizontal: string | undefined = "10px";
    export let labelSize: string | undefined = "14px";
    export let labelColor: string | undefined = "#eeeee";
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
        --padding-top: {mergedStyle.paddingTop};
        --padding-bottom: {mergedStyle.paddingBottom};
        --padding-horizontal: {mergedStyle.paddingHorizontal};
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
                </div>
                <div class="row">
                    <span class="label">Valor Mínimo para Alarme</span>
                </div>
                <div class="row">
                    <span class="label">Valor Máximo para Alarme</span>
                </div>
                <div class="row">
                    <span class="label">Valor Mínimo para Aviso</span>
                </div>
                <div class="row">
                    <span class="label">Valor Máximo para Aviso</span>
                </div>
                <div class="row">
                    <span class="label">Última Atualização</span>
                </div>
                {#if nodeDetailedState.incremental}
                    <div class="row">
                        <span class="label">Última Inicialização</span>
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
        position: relative;
        width: 100%;
        height: fit-content;
        padding-top: calc(var(--padding-top) - var(--push-top));
        padding-bottom: var(--padding-bottom);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        min-height: var(--min-height);
    }
</style>
