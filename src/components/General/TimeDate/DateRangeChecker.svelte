<script lang="ts">
    import { onDestroy } from "svelte";
    import { getElegantStringFromDate } from "$lib/logic/util/date";
    import ToolTip from "../ToolTip.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { DateRangeCheckerStyle, ToolTipDateCheckerStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $DateRangeCheckerStyle;

    // Props
    export let showToolTip: boolean;
    export let initialDate: Date;
    export let endDate: Date;

    // Layout / styling props
    export let paddingHorizontal: string | undefined = undefined;
    export let paddingTop: string | undefined = undefined;
    export let paddingBottom: string | undefined = undefined;
    export let textSize: string | undefined = undefined;
    export let labelWidth: string | undefined = undefined;
    export let labelColor: string | undefined = undefined;
    export let labelWeight: string | undefined = undefined;
    export let valueColor: string | undefined = undefined;
    export let valueWeight: string | undefined = undefined;
    export let rowGap: string | undefined = undefined;

    $: localOverrides = {
        paddingHorizontal,
        paddingTop,
        paddingBottom,
        textSize,
        labelWidth,
        labelColor,
        labelWeight,
        valueColor,
        valueWeight,
        rowGap,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let containerDiv: HTMLDivElement;
    let clickEventListenerDefined: boolean = false;
    let initialDateString: string;
    let endDateString: string;

    // Reactive Statements
    $: initialDateString = getElegantStringFromDate(initialDate);
    $: endDateString = getElegantStringFromDate(endDate);

    $: if (!showToolTip && clickEventListenerDefined) {
        window.removeEventListener("click", handleClickOutside);
        clickEventListenerDefined = false;
    }
    $: if (showToolTip && !clickEventListenerDefined) {
        requestAnimationFrame(() => {
            window.addEventListener("click", handleClickOutside);
            clickEventListenerDefined = true;
        });
    }

    // Functions
    function handleClickOutside(event: MouseEvent): void {
        if (showToolTip && containerDiv && !containerDiv.contains(event.target as Node)) {
            showToolTip = false;
        }
    }

    onDestroy(() => {
        if (clickEventListenerDefined) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

<ToolTip style={$ToolTipDateCheckerStyle} autoPositionContinuous={true} zIndex={198} {showToolTip}>
    <div
        style="
            --padding-horizontal: {mergedStyle.paddingHorizontal};
            --padding-top: {mergedStyle.paddingTop};
            --padding-bottom: {mergedStyle.paddingBottom};
            --text-size: {mergedStyle.textSize};
            --label-width: {mergedStyle.labelWidth};
            --label-color: {mergedStyle.labelColor};
            --label-weight: {mergedStyle.labelWeight};
            --value-color: {mergedStyle.valueColor};
            --value-weight: {mergedStyle.valueWeight};
            --row-gap: {mergedStyle.rowGap};
        "
        bind:this={containerDiv}
        class="date-checker-div"
    >
        <div class="content">
            <div class="row">
                <div class="label-div">
                    <span class="label">{$texts.fromDate}</span>
                </div>
                <div class="value-div">
                    <span class="value">{initialDateString}</span>
                </div>
            </div>
            <div class="row">
                <div class="label-div">
                    <span class="label">{$texts.toDate}</span>
                </div>
                <div class="value-div">
                    <span class="value">{endDateString}</span>
                </div>
            </div>
        </div>
    </div>
</ToolTip>

<style>
    .date-checker-div {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        container-type: inline-size;
    }

    .content {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: var(--row-gap);
    }

    .row {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    .label-div {
        width: var(--label-width);
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    .label {
        font-size: var(--text-size);
        font-weight: var(--label-weight);
        color: var(--label-color);
    }

    .value-div {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
    }

    .value {
        font-size: var(--text-size);
        font-weight: var(--value-weight);
        color: var(--value-color);
    }
</style>
