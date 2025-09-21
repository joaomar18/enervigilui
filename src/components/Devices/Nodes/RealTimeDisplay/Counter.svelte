<script lang="ts">
    import Bar from "../../../General/Bar.svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { ActionStyle } from "$lib/style/general";

    // Props
    export let labelText: string = "Direção do Fator de Potência";
    export let minAlarmValue: number | null = null;
    export let maxAlarmValue: number | null = null;
    export let value: number | null = null;
    export let unitText: string = "V";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $ActionStyle;

    // Layout / styling props
    export let width: string | undefined = "100%";
    export let paddingHorizontal: string | undefined = undefined;
    export let paddingVertical: string | undefined = "10px";
    export let labelPaddingTop: string | undefined = undefined;
    export let labelPaddingBottom: string | undefined = "8px";
    export let labelPaddingLeft: string | undefined = "20px";
    export let labelPaddingRight: string | undefined = "20px";
    export let labelSize: string | undefined = "1rem";
    export let labelColor: string | undefined = "#D4D4D8";
    export let labelWeight: string | undefined = "500";
    export let displayHeight: string | undefined = "40px";
    export let displayWidth: string | undefined = "100%";
    export let displayMaxWidth: string | undefined = "300px";
    export let displayBorder: string | undefined = "1px solid #52525B";
    export let displayBackgroundColor: string | undefined = "rgba(82, 82, 91, 0.1)";
    export let displayRadius: string | undefined = "20px";
    export let valueTextSize: string | undefined = "1.0625rem";
    export let valueTextColor: string | undefined = "#E4E4E7";
    export let valueTextSpacing: string | undefined = "0.25px";
    export let valueTextWeight: string | undefined = "600";
    export let unitTextSize: string | undefined = "1.0625rem";
    export let unitTextColor: string | undefined = "#A1A1AA";
    export let unitTextWeight: string | undefined = "400";
    export let unitTextPaddingLeft: string | undefined = "10px";

    $: localOverrides = {};

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let variableAlarm: boolean = false;
    let variableWarning: boolean = false;
    let valueAlarm: boolean = false;
    let valueWarning: boolean = false;

    // Reactive Statements
    $: variableAlarm = valueAlarm;
    $: variableWarning = valueWarning;
</script>

<div
    style="
        --width: {width};
        --padding-horizontal: {paddingHorizontal};
        --padding-vertical: {paddingVertical};
        --label-padding-top: {labelPaddingTop};
        --label-padding-bottom: {labelPaddingBottom};
        --label-padding-left: {labelPaddingLeft};
        --label-padding-right: {labelPaddingRight};
        --label-size: {labelSize};
        --label-color: {labelColor};
        --label-weight: {labelWeight};
        --display-height: {displayHeight};
        --display-width: {displayWidth};
        --display-max-width: {displayMaxWidth};
        --display-border: {displayBorder};
        --display-background-color: {displayBackgroundColor};
        --display-radius: {displayRadius};
        --value-text-size: {valueTextSize};
        --value-text-color: {valueTextColor};
        --value-text-spacing: {valueTextSpacing};
        --value-text-weight: {valueTextWeight};
        --unit-text-size: {unitTextSize};
        --unit-text-color: {unitTextColor};
        --unit-text-weight: {unitTextWeight};
        --unit-text-padding-left: {unitTextPaddingLeft};
    "
    class="container"
>
    <div class="content">
        <div class="display-div">
            <div class="label-div">
                <span>{labelText}</span>
                <div class="alerts-div">
                    <div class="alert-state"></div>
                </div>
            </div>
            <div class="content">
                <span class="value">{value}</span>
                <span class="unit">{unitText}</span>

                {#if (minAlarmValue !== null || maxAlarmValue !== null) && value !== null}
                    <div class="bar-value-div">
                        <Bar
                            bind:alarmDetected={valueAlarm}
                            bind:warningDetected={valueWarning}
                            currentValue={value}
                            {minAlarmValue}
                            minWarningValue={minAlarmValue !== null ? minAlarmValue * 1.05 : null}
                            {maxAlarmValue}
                            maxWarningValue={maxAlarmValue !== null ? maxAlarmValue * 0.95 : null}
                        />
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .container {
        width: var(--width);
        height: fit-content;
        padding: 0;
        margin: 0;
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        padding-top: var(--padding-vertical);
        padding-bottom: var(--padding-vertical);
    }

    .content {
        margin: 0;
        padding: 0;
        width: 100%;
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
        padding-left: 20px;
        font-size: var(--label-size);
        color: var(--label-color);
        font-weight: var(--label-weight);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .label-div .alerts-div {
        height: fit-content;
        padding-right: 20px;
        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: space-between;
        align-items: center;
    }

    .label-div .alerts-div .alert-state {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #6b7280;
    }

    .display-div {
        margin: 0;
        padding: 0;
        height: fit-content;
        width: var(--display-width);
        max-width: var(--display-max-width);
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .display-div .content {
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
        padding: 0 20px;
        box-sizing: border-box;
        overflow: hidden;
    }

    .content .value {
        box-sizing: border-box;
        font-size: var(--value-text-size);
        color: var(--value-text-color);
        letter-spacing: var(--value-text-spacing);
        font-weight: var(--value-text-weight);
        text-align: left;
        padding: 0;
        padding-right: 20px;
        width: 70%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        line-height: 1;
        font-variant-numeric: tabular-nums;
        font-feature-settings:
            "tnum" 1,
            "lnum" 1;
    }

    .content .unit {
        box-sizing: border-box;
        font-size: var(--unit-text-size);
        color: var(--unit-text-color);
        font-weight: var(--unit-text-weight);
        padding-left: var(--unit-text-padding-left);
        text-align: right;
        padding: 0;
        padding-left: 20px;
        width: 30%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
        line-height: 1;
    }

    .content .bar-value-div {
        position: absolute;
        bottom: 0px;
        left: 20px;
        right: 20px;
        height: 3px;
    }
</style>
