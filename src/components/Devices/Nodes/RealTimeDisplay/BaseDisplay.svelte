<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { NodesBaseDisplayStyle } from "$lib/style/nodes";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $NodesBaseDisplayStyle;

    // Props
    export let labelText: string;
    export let alarmState: boolean = false;
    export let warningState: boolean = false;
    export let valueDisconnected: boolean;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let paddingHorizontal: string | undefined = undefined;
    export let paddingVertical: string | undefined = undefined;
    export let labelPaddingTop: string | undefined = undefined;
    export let labelPaddingBottom: string | undefined = undefined;
    export let labelPaddingRight: string | undefined = undefined;
    export let labelSize: string | undefined = undefined;
    export let labelColor: string | undefined = undefined;
    export let labelWeight: string | undefined = undefined;
    export let displayHeight: string | undefined = undefined;
    export let displayWidth: string | undefined = undefined;
    export let displayMaxWidth: string | undefined = undefined;
    export let displayBorder: string | undefined = undefined;
    export let displayBackgroundColor: string | undefined = undefined;
    export let displayDisconnectedBorder: string | undefined = undefined;
    export let displayDisconnectedBackgroundColor: string | undefined = undefined;
    export let displayRadius: string | undefined = undefined;
    export let displayPaddingHorizontal: string | undefined = undefined;
    export let alertsDivItemGap: string | undefined = undefined;
    export let stateCircleDiameter: string | undefined = undefined;
    export let stateCircleAlarmColor: string | undefined = undefined;
    export let stateCircleWarningColor: string | undefined = undefined;
    export let disconnectedImageWidth: string | undefined = undefined;
    export let disconnectedImageHeight: string | undefined = undefined;

    $: localOverrides = {
        width,
        paddingHorizontal,
        paddingVertical,
        labelPaddingTop,
        labelPaddingBottom,
        labelPaddingRight,
        labelSize,
        labelColor,
        labelWeight,
        displayHeight,
        displayWidth,
        displayMaxWidth,
        displayBorder,
        displayBackgroundColor,
        displayDisconnectedBorder,
        displayDisconnectedBackgroundColor,
        displayRadius,
        displayPaddingHorizontal,
        alertsDivItemGap,
        stateCircleDiameter,
        stateCircleAlarmColor,
        stateCircleWarningColor,
        disconnectedImageWidth,
        disconnectedImageHeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);
</script>

<div
    style="
        --width: {mergedStyle.width};
        --padding-horizontal: {mergedStyle.paddingHorizontal};
        --padding-vertical: {mergedStyle.paddingVertical};
        --label-padding-top: {mergedStyle.labelPaddingTop};
        --label-padding-bottom: {mergedStyle.labelPaddingBottom};
        --label-padding-right: {mergedStyle.labelPaddingRight};
        --label-size: {mergedStyle.labelSize};
        --label-color: {mergedStyle.labelColor};
        --label-weight: {mergedStyle.labelWeight};
        --display-height: {mergedStyle.displayHeight};
        --display-width: {mergedStyle.displayWidth};
        --display-max-width: {mergedStyle.displayMaxWidth};
        --display-border: {mergedStyle.displayBorder};
        --display-background-color: {mergedStyle.displayBackgroundColor};
        --display-disconnected-border: {mergedStyle.displayDisconnectedBorder};
        --display-disconnected-background-color: {mergedStyle.displayBackgroundColor};
        --display-radius: {mergedStyle.displayRadius};
        --display-padding-horizontal: {mergedStyle.displayPaddingHorizontal};
        --alerts-div-item-gap: {mergedStyle.alertsDivItemGap};
        --state-circle-diameter: {mergedStyle.stateCircleDiameter};
        --state-circle-alarm-color: {mergedStyle.stateCircleAlarmColor};
        --state-circle-warning-color: {mergedStyle.stateCircleWarningColor};
        --disconnected-image-width: {mergedStyle.disconnectedImageWidth};
        --disconnected-image-height: {mergedStyle.disconnectedImageHeight};
    "
    class="container"
>
    <div class="content">
        <div class="label-div">
            <span>{labelText}</span>
            {#if alarmState || warningState}
                <div class="alerts-div" class:alarm={alarmState} class:warning={warningState && !alarmState}>
                    <div class="alert-state"></div>
                </div>
            {/if}
        </div>
        <div class="display-content" class:disconnected={valueDisconnected}>
            <img src="/img/disconnected.svg" alt="disconnected" />
            <slot name="content" />
        </div>
    </div>
</div>

<style>
    .container {
        padding: 0;
        margin: 0;
        width: var(--width);
        height: fit-content;
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        padding-top: var(--padding-vertical);
        padding-bottom: var(--padding-vertical);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content {
        margin: 0;
        padding: 0;
        width: var(--display-width);
        max-width: var(--display-max-width);
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .label-div {
        margin: 0;
        padding: 0;
        padding-top: var(--label-padding-top);
        padding-bottom: var(--label-padding-bottom);
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .label-div span {
        margin: 0;
        padding: 0;
        flex: 1;
        min-width: 0;
        text-align: left;
        padding-left: var(--display-padding-horizontal);
        padding-right: var(--label-padding-right);
        font-size: var(--label-size);
        color: var(--label-color);
        font-weight: var(--label-weight);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .label-div .alerts-div {
        height: fit-content;
        padding-right: var(--display-padding-horizontal);
        display: flex;
        flex-direction: row;
        gap: var(--alerts-div-item-gap);
        justify-content: space-between;
        align-items: center;
    }

    .label-div .alerts-div .alert-state {
        width: var(--state-circle-diameter);
        height: var(--state-circle-diameter);
        border-radius: 50%;
    }

    .label-div .alerts-div.alarm .alert-state {
        background-color: var(--state-circle-alarm-color);
    }

    .label-div .alerts-div.warning .alert-state {
        background-color: var(--state-circle-warning-color);
    }

    .display-content {
        margin: 0;
        padding: 0;
        position: relative;
        height: var(--display-height);
        width: 100%;
        background-color: var(--display-background-color);
        border: var(--display-border);
        border-radius: var(--display-radius);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 var(--display-padding-horizontal);
        box-sizing: border-box;
        overflow: hidden;
    }

    .display-content.disconnected {
        background-color: var(--display-disconnected-background-color);
        border: var(--display-disconnected-border);
    }

    .display-content img {
        display: none;
        width: var(--disconnected-image-width);
        height: var(--disconnected-image-height);
    }

    .display-content.disconnected img {
        display: block;
    }
</style>
