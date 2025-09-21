<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { BarStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $BarStyle;

    // Props
    export let alarmDetected: boolean;
    export let warningDetected: boolean;
    export let minAlarmValue: number | null = null;
    export let maxAlarmValue: number | null = null;
    export let minWarningValue: number | null = null;
    export let maxWarningValue: number | null = null;
    export let currentValue: number;
    export let enableMinArrow: boolean = true;
    export let enableMaxArrow: boolean = true;
    export let enableArrowDefault: boolean = false;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let border: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let fillWidth: string | undefined = undefined;
    export let fillHeight: string | undefined = undefined;
    export let fillColor: string | undefined = undefined;
    export let fillMinAlarmColor: string | undefined = undefined;
    export let fillMaxAlarmColor: string | undefined = undefined;
    export let fillMinWarningColor: string | undefined = undefined;
    export let fillMaxWarningColor: string | undefined = undefined;
    export let arrowWidth: string | undefined = undefined;
    export let arrowHeight: string | undefined = undefined;
    export let arrowColor: string | undefined = undefined;
    export let arrowMinAlarmColor: string | undefined = undefined;
    export let arrowMaxAlarmColor: string | undefined = undefined;
    export let arrowMinWarningColor: string | undefined = undefined;
    export let arrowMaxWarningColor: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        backgroundColor,
        border,
        borderRadius,
        fillWidth,
        fillHeight,
        fillColor,
        fillMinAlarmColor,
        fillMaxAlarmColor,
        fillMinWarningColor,
        fillMaxWarningColor,
        arrowWidth,
        arrowHeight,
        arrowColor,
        arrowMinAlarmColor,
        arrowMaxAlarmColor,
        arrowMinWarningColor,
        arrowMaxWarningColor,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let currentValueScaled: number | null = null;
    let showArrow: boolean = false;
    let minAlarm: boolean = false;
    let minWarning: boolean = false;
    let maxAlarm: boolean = false;
    let maxWarning: boolean = false;

    // Reactive Statements
    $: showArrow =
        (enableArrowDefault && minAlarmValue !== null && maxAlarmValue !== null) || (minAlarm && enableMinArrow) || (maxAlarm && enableMaxArrow); // Show arrow

    // Current Value Scaled
    $: {
        if (minAlarm) {
            currentValueScaled = 0;
        } else if (maxAlarm) {
            currentValueScaled = 100;
        } else if (minAlarmValue !== null && maxAlarmValue !== null) {
            currentValueScaled = Math.round(((currentValue - minAlarmValue) / (maxAlarmValue - minAlarmValue)) * 100);
        } else {
            currentValueScaled = null;
        }
    }

    // Mininum Alarm and Warning
    $: {
        minAlarm = minAlarmValue !== null && minAlarmValue >= currentValue;
        minWarning = !minAlarm && minWarningValue !== null && minWarningValue >= currentValue;
    }

    // Maximum Alarm and Warning
    $: {
        maxAlarm = maxAlarmValue !== null && currentValue >= maxAlarmValue;
        maxWarning = !maxAlarm && maxWarningValue !== null && currentValue >= maxWarningValue;
    }

    // Alarm or Warning
    $: alarmDetected = minAlarm || maxAlarm;
    $: warningDetected = !alarmDetected && (minWarning || maxWarning);
</script>

<!--
    Bar Component
    
    A customizable progress bar component with alarm and warning indicators.
    Displays current value as a filled bar with optional directional arrow.
    Supports min/max alarm and warning thresholds with color-coded states.
    
    Props:
    - currentValue: The current value to display
    - minAlarmValue, maxAlarmValue: Alarm threshold values
    - minWarningValue, maxWarningValue: Warning threshold values
    - enableMinArrow, enableMaxArrow, enableArrowDefault: Control arrow display
    
    States:
    - Normal: Default fill color
    - Min/Max Warning: Warning color when thresholds exceeded
    - Min/Max Alarm: Alarm color when critical thresholds exceeded
    - Arrow: Indicates current position on the bar
-->

<div
    style="
        --width: {mergedStyle.width};
        --height: {mergedStyle.height};
        --background-color: {mergedStyle.backgroundColor};
        --border: {mergedStyle.border};
        --border-radius: {mergedStyle.borderRadius};
        --fill-width: {mergedStyle.fillWidth};
        --fill-height: {mergedStyle.fillHeight};
        --fill-color: {mergedStyle.fillColor};
        --fill-min-alarm-color: {mergedStyle.fillMinAlarmColor};
        --fill-max-alarm-color: {mergedStyle.fillMaxAlarmColor};
        --fill-min-warning-color: {mergedStyle.fillMinWarningColor};
        --fill-max-warning-color: {mergedStyle.fillMaxWarningColor};
        --scaled-value-width: {currentValueScaled !== null ? `${currentValueScaled}%` : '0%'};
        --arrow-width: {mergedStyle.arrowWidth};
        --arrow-height: {mergedStyle.arrowHeight};
        --arrow-color: {mergedStyle.arrowColor};
        --arrow-min-alarm-color: {mergedStyle.arrowMinAlarmColor};
        --arrow-max-alarm-color: {mergedStyle.arrowMaxAlarmColor};
        --arrow-min-warning-color: {mergedStyle.arrowMinWarningColor};
        --arrow-max-warning-color: {mergedStyle.arrowMaxWarningColor};
    "
    class="bar-div"
>
    <div class="content" class:min-alarm={minAlarm} class:min-warning={minWarning} class:max-alarm={maxAlarm} class:max-warning={maxWarning}>
        <div class="fill-div">
            {#if currentValueScaled !== null}
                <div class="fill-value"></div>
            {/if}
            {#if showArrow}
                <div class="arrow"></div>
            {/if}
        </div>
    </div>
</div>

<style>
    /* Main container for the bar component */
    .bar-div {
        margin: 0;
        padding: 0;
        width: var(--width);
        height: var(--height);
        background-color: var(--background-color);
        border: var(--border);
        border-radius: var(--border-radius);
    }

    /* Content wrapper - centers the fill area */
    .content {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* Container for the progress fill and arrow */
    .content .fill-div {
        margin: 0;
        padding: 0;
        position: relative;
        width: var(--fill-width);
        height: var(--fill-height);
    }

    /* Progress fill - shows current value as percentage */
    .content .fill-value {
        margin: 0;
        padding: 0;
        position: absolute;
        left: 0px;
        height: 100%;
        width: var(--scaled-value-width);
        transition: width 0.2s ease-in-out; /* Smooth width changes */
        background-color: var(--fill-color);
        border-radius: var(--border-radius);
    }

    /* Alarm state colors for progress fill */
    .content.min-alarm .fill-value {
        background-color: var(--fill-min-alarm-color);
    }

    .content.min-warning .fill-value {
        background-color: var(--fill-min-warning-color);
    }

    .content.max-alarm .fill-value {
        background-color: var(--fill-max-alarm-color);
    }

    .content.max-warning .fill-value {
        background-color: var(--fill-max-warning-color);
    }

    /* Directional arrow - points to current value position */
    .content .arrow {
        top: 0px;
        transform: translateY(-100%);
        width: 0;
        height: 0;
        left: calc(var(--scaled-value-width) - var(--arrow-width));
        position: absolute;
        border-left: var(--arrow-width) solid transparent;
        border-right: var(--arrow-width) solid transparent;
        border-top: var(--arrow-height) solid transparent;
        border-top-color: var(--arrow-color);
    }

    /* Alarm state colors for arrow */
    .content.min-alarm .arrow {
        border-top-color: var(--arrow-min-alarm-color);
    }
    .content.min-warning .arrow {
        border-top-color: var(--arrow-min-warning-color);
    }
    .content.max-alarm .arrow {
        border-top-color: var(--arrow-max-alarm-color);
    }
    .content.max-warning .arrow {
        border-top-color: var(--arrow-max-warning-color);
    }
</style>
