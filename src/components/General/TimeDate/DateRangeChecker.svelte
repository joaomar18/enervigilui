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
    export let fullWidth: boolean = false;
    export let showToolTip: boolean = true;
    export let initialDate: Date;
    export let endDate: Date;

    // Layout / styling props
    export let paddingHorizontal: string | undefined = undefined;
    export let paddingTop: string | undefined = undefined;
    export let paddingBottom: string | undefined = undefined;
    export let fsTextSize: string | undefined = undefined;
    export let textSize: string | undefined = undefined;
    export let labelWidth: string | undefined = undefined;
    export let fsLabelWidth: string | undefined = undefined;
    export let labelColor: string | undefined = undefined;
    export let labelWeight: string | undefined = undefined;
    export let valueColor: string | undefined = undefined;
    export let valueWeight: string | undefined = undefined;
    export let rowGap: string | undefined = undefined;
    export let fsRowPaddingHorizontal: string | undefined = undefined;
    export let fsBorderRight: string | undefined = undefined;

    $: localOverrides = {
        paddingHorizontal,
        paddingTop,
        paddingBottom,
        fsTextSize,
        textSize,
        labelWidth,
        fsLabelWidth,
        labelColor,
        labelWeight,
        valueColor,
        valueWeight,
        rowGap,
        fsRowPaddingHorizontal,
        fsBorderRight,
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

{#if fullWidth}
    <div
        style="
            --fs-text-size: {mergedStyle.fsTextSize};
            --fs-label-width: {mergedStyle.fsLabelWidth};
            --label-color: {mergedStyle.labelColor};
            --label-weight: {mergedStyle.labelWeight};
            --value-color: {mergedStyle.valueColor};
            --value-weight: {mergedStyle.valueWeight};
            --fs-row-padding-horizontal: {mergedStyle.fsRowPaddingHorizontal};
            --fs-border-right: {mergedStyle.fsBorderRight};
        "
        class="content"
        class:full-width={fullWidth}
    >
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
{:else}
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
            <div class="content" class:full-width={fullWidth}>
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
{/if}

<style>
    /* Main container - Full tooltip content area with configurable padding */
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

    /* Content wrapper - Flexbox container for date range rows */
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

    .content.full-width {
        flex-direction: row;
        gap: 0px;
    }

    /* Individual date row - Horizontal layout for label and value pairs */
    .content .row {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    .content.full-width .row {
        padding-left: var(--fs-row-padding-horizontal);
        padding-right: var(--fs-row-padding-horizontal);
        border-right: var(--fs-border-right);
        height: 100%;
    }

    .content.full-width .row:first-child {
        padding-left: 0;
    }

    .content.full-width .row:last-child {
        border-right: none;
    }

    /* Label container - Fixed width area for "From/To" labels */
    .content .row .label-div {
        width: var(--label-width);
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    .content.full-width .row .label-div {
        width: var(--fs-label-width);
    }

    /* Date label text - Styled "From Date" and "To Date" labels */
    .content .row .label-div .label {
        font-size: var(--text-size);
        font-weight: var(--label-weight);
        color: var(--label-color);
    }

    .content.full-width .row .label-div .label {
        font-size: var(--fs-text-size);
    }

    /* Value container - Flexible area for formatted date values */
    .value-div {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
    }

    /* Date value text - Styled formatted date strings */
    .content .row .value-div .value {
        font-size: var(--text-size);
        font-weight: var(--value-weight);
        color: var(--value-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .content.full-width .row .value-div .value {
        font-size: var(--fs-text-size);
    }
</style>
