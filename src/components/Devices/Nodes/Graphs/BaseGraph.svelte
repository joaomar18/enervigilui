<script lang="ts">
    import Action from "../../../General/Action.svelte";
    import ToolTipText from "../../../General/ToolTipText.svelte";
    import DateRangeChecker from "../../../General/TimeDate/DateRangeChecker.svelte";
    import "uplot/dist/uPlot.min.css";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { BaseGraphStyle, GraphActionStyle } from "$lib/style/graph";
    import GraphToolTip from "./GraphToolTip.svelte";
    import type { BaseLogPoint } from "$lib/types/nodes/logs";
    import type { GraphType } from "$lib/logic/view/graph/base";
    import { getGraphToolTipDisplayComponent } from "$lib/logic/view/graph/helpers";
    import CircularLoader from "../../../General/CircularLoader.svelte";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $BaseGraphStyle;

    // Props
    export let goBackEnabled: boolean = true;
    export let gridElement: HTMLDivElement | null = null;
    export let graphType: GraphType;
    export let insideGraph: boolean;
    export let cursorPos: { x: number | undefined; y: number | undefined };
    export let graphContainer: HTMLDivElement;
    export let initialDate: Date;
    export let endDate: Date;
    export let graphCreated: boolean;
    export let dataFetched: boolean;
    export let firstFetch: boolean;
    export let graphNoData: boolean;
    export let logPoint: BaseLogPoint | null;
    export let unit: string = "";

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let headerHeight: string | undefined = undefined;
    export let headerButtonsGap: string | undefined = undefined;
    export let xAxisHeight: string | undefined = undefined;
    export let yAxisWidth: string | undefined = undefined;
    export let unitDivWidth: string | undefined = undefined;
    export let unitMaxWidth: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let paddingHorizontal: string | undefined = undefined;
    export let paddingTop: string | undefined = undefined;
    export let paddingBottom: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let boxShadow: string | undefined = undefined;
    export let graphPaddingTop: string | undefined = undefined;
    export let graphPaddingLeft: string | undefined = undefined;
    export let graphPaddingRight: string | undefined = undefined;
    export let graphPaddingBottom: string | undefined = undefined;
    export let graphTextColor: string | undefined = undefined;
    export let graphTextWeight: string | undefined = undefined;
    export let subTextColor: string | undefined = undefined;
    export let subTextWeight: string | undefined = undefined;
    export let scrollbarTrackColor: string | undefined = undefined;
    export let scrollbarThumbColor: string | undefined = undefined;
    export let loaderBackgroundBlur: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        headerHeight,
        headerButtonsGap,
        xAxisHeight,
        yAxisWidth,
        unitDivWidth,
        unitMaxWidth,
        borderRadius,
        paddingHorizontal,
        paddingTop,
        paddingBottom,
        backgroundColor,
        borderColor,
        boxShadow,
        graphPaddingTop,
        graphPaddingLeft,
        graphPaddingRight,
        graphPaddingBottom,
        graphTextColor,
        graphTextWeight,
        subTextColor,
        subTextWeight,
        scrollbarTrackColor,
        scrollbarThumbColor,
        loaderBackgroundBlur,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let showDateRange: boolean = false;
    let showLoader: boolean = false;

    // Reactive Statements
    $: if (!dataFetched && !showLoader) {
        if (firstFetch) {
            setTimeout(() => {
                showLoader = !dataFetched;
            }, 500);
        } else {
            showLoader = true;
        }
    }
    $: if (dataFetched) {
        showLoader = false;
    }

    // Export Functions
    export let goBack: () => void;
</script>

<!--
    BaseGraph Component
    
    A foundational graph component that provides common graph infrastructure and styling.
    Features header with action buttons, date range display, graph container management, and
    tooltip integration. Serves as the base for specialized graph components like MeasurementGraph,
    providing consistent layout, theming, and interaction patterns. Handles graph lifecycle,
    container binding, and provides extensible styling through comprehensive CSS custom properties.
-->
<div
    style="
        --width: {mergedStyle.width};
        --height: {mergedStyle.height};
        --header-height: {mergedStyle.headerHeight};
        --header-buttons-gap: {mergedStyle.headerButtonsGap};
        --x-axis-height: {mergedStyle.xAxisHeight};
        --y-axis-width: {mergedStyle.yAxisWidth};
        --unit-div-width: {mergedStyle.unitDivWidth};
        --unit-max-width: {mergedStyle.unitMaxWidth};
        --border-radius: {mergedStyle.borderRadius};
        --padding-horizontal: {mergedStyle.paddingHorizontal};
        --padding-top: {mergedStyle.paddingTop};
        --padding-bottom: {mergedStyle.paddingBottom};
        --background-color: {mergedStyle.backgroundColor};
        --border-color: {mergedStyle.borderColor};
        --box-shadow: {mergedStyle.boxShadow};
        --graph-padding-top: {mergedStyle.graphPaddingTop};
        --graph-padding-left: {mergedStyle.graphPaddingTop};
        --graph-padding-right: {mergedStyle.graphPaddingRight};
        --graph-padding-bottom: {mergedStyle.graphPaddingBottom};
        --scrollbar-track-color: {mergedStyle.scrollbarTrackColor};
        --scrollbar-thumb-color: {mergedStyle.scrollbarThumbColor};
        --graph-text-color: {mergedStyle.graphTextColor};
        --graph-text-weight: {mergedStyle.graphTextWeight};
        --sub-text-color: {mergedStyle.subTextColor};
        --sub-text-weight: {mergedStyle.subTextWeight};
        --loader-background-blur: {mergedStyle.loaderBackgroundBlur};
    "
    class="graph-div-wrapper"
>
    <div class="header">
        <div class="header-content">
            <div class="left-actions-div">
                <Action
                    style={$GraphActionStyle}
                    imageURL="/img/previous.svg"
                    disabledImageURL="/img/previous-disabled.svg"
                    onClick={() => goBack()}
                    enableToolTip={true}
                    disabled={!goBackEnabled}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.goBack} /></div>
                </Action>
            </div>
            <div class="actions-div">
                <div class="date-checker-div">
                    <Action
                        style={$GraphActionStyle}
                        imageURL="/img/calendar-check.svg"
                        onClick={() => {
                            showDateRange = !showDateRange;
                        }}
                        enableToolTip={true}
                    >
                        <div slot="tooltip"><ToolTipText text={$texts.selectedPeriod} /></div>
                    </Action>
                    <DateRangeChecker bind:showToolTip={showDateRange} {initialDate} {endDate} />
                </div>
                <Action style={$GraphActionStyle} imageURL="/img/fullscreen.svg" onClick={() => {}} enableToolTip={true}>
                    <div slot="tooltip"><ToolTipText text={$texts.fullscreen} /></div>
                </Action>
            </div>
        </div>
        <div class="metrics-section">
            <slot name="metrics" />
        </div>
    </div>
    <div class="main">
        <div class="loader" class:close={!showLoader}>
            <CircularLoader wrapperTopLeftRadius="0px" wrapperTopRightRadius="0px" wrapperBottomLeftRadius="0px" wrapperBottomRightRadius="0px" />
        </div>
        <div class="graph-main">
            <div class="unit-div">
                <div class="unit-content">
                    <div class="unit-wrapper">
                        {#if graphCreated && !graphNoData}
                            <span class="unit-label">{unit}</span>
                        {/if}
                    </div>
                </div>
            </div>
            <div class="graph-div" bind:this={graphContainer}>
                <div class="y-axis-inner-div">
                    <div class="y-axis-inner-content">
                        {#if graphCreated && graphNoData}
                            <span class="no-data-label">{$texts.noDataAvailable}</span>
                        {/if}
                    </div>
                </div>
                {#if graphType && gridElement}
                    <GraphToolTip {gridElement} {insideGraph} {cursorPos}>
                        <svelte:component this={getGraphToolTipDisplayComponent(graphType)} {logPoint} {unit} />
                    </GraphToolTip>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    /* Main graph container - Card-style wrapper with theming and vertical layout */
    .graph-div-wrapper {
        box-sizing: border-box;
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        margin: 0;
        width: var(--width);
        height: fit-content;
        border-radius: var(--border-radius);
        background: var(--background-color);
        border: 1px solid var(--border-color);
        box-shadow: var(--box-shadow);
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }

    /* Graph header - Container for action buttons and controls */
    .header {
        margin: 0;
        padding: 0;
        padding-bottom: var(--padding-top);
        position: relative;
        width: 100%;
        height: var(--header-height);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    /* Header content wrapper - Flexible layout for header elements */
    .header-content {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }

    /* Action buttons container - Right-aligned controls with configurable spacing */
    .header-content .actions-div {
        width: fit-content;
        height: 100%;
        display: flex;
        justify-content: end;
        align-items: center;
        gap: var(--header-buttons-gap);
    }

    /* Left action buttons container - Left-aligned controls (e.g., back/previous button) */
    .header-content .left-actions-div {
        width: fit-content;
        height: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        gap: var(--header-buttons-gap);
    }

    /* Date checker container - Houses the date range display tooltip */
    .header-content .actions-div .date-checker-div {
        margin: 0;
        padding: 0;
        position: relative;
        width: fit-content;
        height: 100%;
    }

    /* Metrics section - Container for graph metric displays below header actions */
    .metrics-section {
        margin: 0;
        padding: 0;
        width: 100%;
        height: fit-content;
        padding-top: var(--padding-top);
    }

    /* Main content area - Horizontal scrollable container for unit label and graph */
    .main {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: calc(100% - var(--header-height));
    }

    /* Graph main content - Horizontal flex container with styled scrollbar for graph overflow */
    .main .graph-main {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-track-color) var(--scrollbar-thumb-color);
        scrollbar-gutter: stable;
    }

    /* Loader overlay - Blurred loading state indicating data unavailability */
    .loader {
        position: absolute;
        inset: 0;
        backdrop-filter: var(--loader-background-blur);
        -webkit-backdrop-filter: var(--loader-background-blur);
        transition: opacity 0.3s ease-in-out;
        z-index: 1;
    }

    /* Close Loader - Fades out and moves to background layer */
    .loader.close {
        opacity: 0;
        z-index: -1;
    }

    /* Unit label section - Left sidebar for measurement unit display */
    .unit-div {
        width: var(--unit-div-width);
        height: var(--height);
    }

    /* Unit content container - Sized to match graph plotting area */
    .unit-content {
        width: 100%;
        height: calc(100% - var(--graph-padding-top) - var(--graph-padding-bottom) - var(--x-axis-height));
        padding-top: var(--graph-padding-top);
        padding-bottom: calc(var(--x-axis-height) + var(--graph-padding-bottom));
    }

    /* Unit wrapper - Relative container for absolutely positioned unit label */
    .unit-wrapper {
        padding: 0;
        margin: 0;
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* Unit label text - Vertically rotated measurement unit (e.g., "kW", "A") */
    .unit-label {
        position: absolute;
        top: 50%;
        left: 50%;
        color: var(--sub-text-color);
        font-weight: var(--sub-text-weight);
        font-size: 13px;
        letter-spacing: 0.5px;
        text-align: center;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        max-width: var(--unit-max-width);
        transform: translate(-50%, -50%) rotate(-90deg);
    }

    /* Graph container - Main plotting area where uPlot charts are rendered */
    .graph-div {
        padding: 0;
        margin: 0;
        position: relative;
        width: calc(100% - var(--unit-div-width));
        height: var(--height);
    }

    /* Y-axis overlay area - Positioned over uPlot's y-axis for custom content */
    .y-axis-inner-div {
        position: absolute;
        left: 0;
        top: 0;
        width: var(--y-axis-width);
        height: calc(var(--height) - var(--graph-padding-top) - var(--graph-padding-bottom) - var(--x-axis-height));
        padding-top: var(--graph-padding-top);
        padding-bottom: calc(var(--x-axis-height) + var(--graph-padding-bottom));
    }

    /* Y-axis content wrapper - Container for y-axis overlay elements */
    .y-axis-inner-content {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        position: relative;
    }

    /* No-data indicator - Rotated text displayed when graph has no data */
    .no-data-label {
        position: absolute;
        top: 50%;
        left: 50%;
        color: var(--sub-text-color);
        font-weight: var(--sub-text-weight);
        font-size: 13px;
        letter-spacing: 0.5px;
        word-spacing: 0.15em;
        opacity: 0.7;
        text-align: center;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
        transform: translate(-50%, -50%) rotate(-90deg);
    }
</style>
