<script lang="ts">
    import RightPanelSheet from "../../../General/RightPanelSheet.svelte";
    import Button from "../../../General/Button.svelte";
    import ToolTipText from "../../../General/ToolTipText.svelte";
    import InlineLoader from "../../../General/InlineLoader.svelte";
    import DateRangePicker from "../../../General/TimeDate/DateRangePicker.svelte";
    import { LogSpanPeriod } from "$lib/types/view/nodes";
    import { getNodePhaseSection, getCommunicationID, isNumeric } from "$lib/logic/util/nodes";
    import { getNodeAdditionalInfo, getNodeLogs } from "$lib/logic/api/nodes";
    import { getTimeSpanFromLogPeriod, getDateFromField } from "$lib/logic/util/date";
    import type { BaseNodeAdditionalInfo, ProcessedNodeState } from "$lib/types/nodes/realtime";
    import type { ProcessedNodeLogs } from "$lib/types/nodes/logs";

    // Stores
    import { currentDeviceID } from "$lib/stores/device/current";
    import { protocolPlugins } from "$lib/stores/device/protocol";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";
    import { variableNameTextsByPhase } from "$lib/stores/lang/energyMeterTexts";
    import { protocolTexts } from "$lib/stores/lang/energyMeterTexts";
    import { pluginTexts } from "$lib/stores/lang/protocolPlugin";

    // Styles
    import {
        NodesBaseDisplayDetailStyle,
        NodeDetailPickerButtonStyle,
        CustomDatePickerButtonStyle,
        SelectedCustomDatePickerButtonStyle,
    } from "$lib/style/nodes";

    // Props
    export let nodeState: ProcessedNodeState;
    export let showPanel: boolean;

    // Layout / styling props
    export let stateDimColor: string | undefined = "#374151";
    export let stateAlarmColor: string | undefined = "#ef4444";
    export let stateWarningColor: string | undefined = "#f59e0b";
    export let stateOKColor: string | undefined = "#22c55e";
    export let stateDisconnectedColor: string | undefined = "#6b7280";
    export let titleSize: string | undefined = "1.25rem";
    export let titleColor: string | undefined = "rgba(255, 255, 255, 0.8)";
    export let titleWeight: string | undefined = "500";
    export let titleItemGap: string | undefined = "10px";
    export let titleImageWidth: string | undefined = "32px";
    export let titleImageHeight: string | undefined = "32px";
    export let headerRowHeigth: string | undefined = "25px";
    export let headerStateDivWidth: string | undefined = "25px";
    export let headerRowGap: string | undefined = "10px";
    export let headerColGap: string | undefined = "10px";
    export let headerLabelWidth: string | undefined = "100px";
    export let headerLabelSize: string | undefined = "1rem";
    export let headerLabelColor: string | undefined = "rgba(255, 255, 255, 0.6)";
    export let headerLabelWeight: string | undefined = "400";
    export let headerValueSize: string | undefined = "1rem";
    export let headerValueColor: string | undefined = "rgba(255, 255, 255, 0.8)";
    export let headerValueWeight: string | undefined = "600";
    export let contentTitleSize: string | undefined = "13px";
    export let contentTitleColor: string | undefined = "rgba(255, 255, 255, 0.4)";
    export let contentTitleWeight: string | undefined = "500";
    export let contentTitlePaddingLeft: string | undefined = "5px";
    export let contentTitlePaddingBottom: string | undefined = "8px";
    export let contentTitleBorderBottom: string | undefined = "1px solid rgba(255, 255, 255, 0.08)";
    export let contentTitleSpacing: string | undefined = "1px";
    export let contentTitleTransform: string | undefined = "uppercase";
    export let contentInnerPaddingTop: string | undefined = "20px";
    export let contentInnerPaddingBottom: string | undefined = "20px";
    export let contentInnerPaddingHorizontal: string | undefined = "10px";
    export let contentRowHeight: string | undefined = "25px";
    export let contentStateDivWidth: string | undefined = "25px";
    export let contentRowGap: string | undefined = "10px";
    export let contentColGap: string | undefined = "10px";
    export let contentLabelWidth: string | undefined = "100px";
    export let contentLabelSize: string | undefined = "1rem";
    export let contentLabelColor: string | undefined = "rgba(255,255,255, 0.6)";
    export let contentLabelWeight: string | undefined = "400";
    export let contentValueSize: string | undefined = "1rem";
    export let contentValueColor: string | undefined = "rgba(255,255,255, 0.8)";
    export let contentValueWeight: string | undefined = "600";
    export let historyButtonPickerGap: string | undefined = "10px";

    // Variables
    let state: "alarmState" | "warningState" | "okState" | "disconnectedState";
    let nodeAdditionalInfo: BaseNodeAdditionalInfo;
    let nodeLogs: ProcessedNodeLogs;
    let selectedHistoryTimeSpan: LogSpanPeriod = LogSpanPeriod.currentDay;

    let showCustomDatePicker: boolean = false;

    // Reactive Statements

    // Node Change
    $: if (!showPanel) {
        selectedHistoryTimeSpan = LogSpanPeriod.currentDay; // Default Period
    }

    $: if (nodeState) {
        showCustomDatePicker = false;
        loadNodeAdditionalInfo();
        if (isNumeric(nodeState)) {
            let { initial_date, end_date } = loadDateSpan();
            loadNodeLogs(initial_date, end_date);
        }
    }

    $: if (nodeState) {
        if (nodeState.value === null) {
            state = "disconnectedState";
        } else if (nodeState.min_alarm_state || nodeState.max_alarm_state) {
            state = "alarmState";
        } else if (nodeState.min_warning_state || nodeState.max_warning_state) {
            state = "warningState";
        } else {
            state = "okState";
        }
    }

    $: console.log(nodeLogs);

    // Functions
    async function loadNodeAdditionalInfo() {
        if (!$currentDeviceID || !nodeState) {
            return;
        }
        ({ nodeAdditionalInfo } = await getNodeAdditionalInfo($currentDeviceID, nodeState.name, nodeState.phase));
    }

    function loadDateSpan(): { initial_date: Date; end_date: Date } {
        return getTimeSpanFromLogPeriod(selectedHistoryTimeSpan);
    }

    async function loadNodeLogs(initial_date: Date | null = null, end_date: Date | null = null) {
        if (!$currentDeviceID || !nodeState) {
            return;
        }
        ({ nodeLogs } = await getNodeLogs($currentDeviceID, nodeState.name, nodeState.phase, initial_date !== null, initial_date, end_date));
    }

    // Sample chart data for testing
    const sampleChartData = [
        { 1696118400: 220.551 }, // 2023-10-01 00:00:00 - 230.5V
        { 1696118460: 231.212 }, // 00:01:00 - 231.2V
        { 1696118520: 229.812 }, // 00:02:00 - 229.8V
        { 1696118580: 230.912 }, // 00:03:00 - 230.9V
        { 1696118640: 232.143 }, // 00:04:00 - 232.1V
        { 1696118700: 229.454 }, // 00:05:00 - 229.4V
        { 1696118760: 230.723 }, // 00:06:00 - 230.7V
        { 1696118820: 231.511 }, // 00:07:00 - 231.5V
        { 1696118880: 230.242 }, // 00:08:00 - 230.2V
        { 1696118940: 231.808 }, // 00:09:00 - 231.8V
    ] as any; // Temporary fix for TypeScript

    const sampleColors = ["#3B82F6"]; // Blue color matching your theme
    const sampleLabels = ["Voltage L1 (V)"];
</script>

<div
    class="variable-panel"
    style="
            --title-size: {titleSize};
            --title-color: {titleColor};
            --title-weight: {titleWeight};
            --title-item-gap: {titleItemGap};
            --title-image-width: {titleImageWidth};
            --title-image-height: {titleImageHeight};
            --state-dim-color: {stateDimColor};
            --state-alarm-color: {stateAlarmColor};
            --state-warning-color: {stateWarningColor};
            --state-ok-color: {stateOKColor};
            --state-disconnected-color: {stateDisconnectedColor};
            --header-row-height: {headerRowHeigth};
            --header-state-div-width: {headerStateDivWidth};
            --header-row-gap: {headerRowGap};
            --header-col-gap: {headerColGap};
            --header-label-width: {headerLabelWidth};
            --header-label-size: {headerLabelSize};
            --header-label-color: {headerLabelColor};
            --header-label-weight: {headerLabelWeight};
            --header-value-size: {headerValueSize};
            --header-value-color: {headerValueColor};
            --header-value-weight: {headerValueWeight};
            --content-state-div-width: {contentStateDivWidth};
            --content-title-size: {contentTitleSize};
            --content-title-color: {contentTitleColor};
            --content-title-weight: {contentTitleWeight};
            --content-title-padding-left: {contentTitlePaddingLeft};
            --content-title-padding-bottom: {contentTitlePaddingBottom};
            --content-title-border-bottom: {contentTitleBorderBottom};
            --content-title-spacing: {contentTitleSpacing};
            --content-title-transform: {contentTitleTransform};
            --content-inner-padding-top: {contentInnerPaddingTop};
            --content-inner-padding-bottom: {contentInnerPaddingBottom};
            --content-inner-padding-horizontal: {contentInnerPaddingHorizontal};
            --content-row-height: {contentRowHeight};
            --content-row-gap: {contentRowGap};
            --content-col-gap: {contentColGap};
            --content-label-width: {contentLabelWidth};
            --content-label-size: {contentLabelSize};
            --content-label-color: {contentLabelColor};
            --content-label-weight: {contentLabelWeight};
            --content-value-size: {contentValueSize};
            --content-value-color: {contentValueColor};
            --content-value-weight: {contentValueWeight};
            --history-btn-picker-gap: {historyButtonPickerGap};
        "
>
    <RightPanelSheet useMask={false} bind:showPanel>
        <header slot="title" class="title-div">
            <img src="/img/variable.svg" alt="Estado da variável" />
            <h3>{$texts.variableDetails}</h3>
        </header>

        <section slot="header" class="header-div" aria-labelledby="hdr-title">
            {#if nodeState}
                <div class="row">
                    <span class="label">{$texts.name}</span>
                    <span class="value">
                        {$variableNameTextsByPhase[nodeState.phase][nodeState.name] || nodeState.name}
                    </span>
                </div>
                <div class="row">
                    <span class="label">{$texts.section}</span>
                    <span class="value">{$texts[getNodePhaseSection(nodeState.phase).labelKey] || $texts.variables}</span>
                </div>
                <div class="row">
                    <span class="label">{$texts.state}</span>
                    <span class="value with-adornment">
                        <span class="value">{$texts[state]}</span>
                        <div class="dot-state-div">
                            <div class="dot-state" data-state={state}></div>
                        </div>
                    </span>
                </div>
            {/if}
        </section>

        <main slot="content" class="content-div">
            {#if nodeState}
                <div class="section-title"><h3>{$texts.currentState}</h3></div>
                <div class="inner-content-div">
                    <div class="row fit-height">
                        <span class="label">{$texts.value}</span>
                        <span class="value">
                            <svelte:component
                                this={nodeState.displayComponent}
                                baseDisplayStyle={$NodesBaseDisplayDetailStyle}
                                disableLabel
                                disableClick
                                labelText=""
                                nodeName={nodeState.name}
                                nodePhase={nodeState.phase}
                                minRangeValue={nodeState.min_value_range}
                                maxRangeValue={nodeState.max_value_range}
                                minAlarmState={nodeState.min_alarm_state}
                                maxAlarmState={nodeState.max_alarm_state}
                                minWarningState={nodeState.min_warning_state}
                                maxWarningState={nodeState.max_warning_state}
                                value={nodeState.value}
                                unitText={nodeState.unit}
                                decimalPlaces={nodeState.decimal_places}
                            />
                        </span>
                    </div>
                    <div class="row">
                        <span class="label">{$texts.updated}</span>
                        <InlineLoader loaded={nodeAdditionalInfo !== undefined}>
                            <span class="value align-right">à 7 segundos</span>
                        </InlineLoader>
                    </div>
                    <div class="row">
                        <dt class="label">{$texts.restarted}</dt>
                        <InlineLoader loaded={nodeAdditionalInfo !== undefined}>
                            <span class="value align-right">à 13 minutos</span>
                        </InlineLoader>
                    </div>
                </div>

                {#if nodeState.min_alarm_state !== undefined || nodeState.max_alarm_state !== undefined}
                    <div class="section-title"><h3>{$texts.alarms}</h3></div>
                    <div class="inner-content-div">
                        {#if nodeState.min_alarm_state !== undefined}
                            <div class="row">
                                <span class="label">{$texts.lowerLimit}</span>
                                <InlineLoader loaded={nodeAdditionalInfo?.min_alarm_value !== undefined}>
                                    <span class="value with-adornment align-right">
                                        <span class="value"
                                            >{nodeAdditionalInfo?.min_alarm_value?.toFixed(nodeState.decimal_places || 0)} {nodeState.unit}</span
                                        >
                                        <div class="dot-state-div"><div class="dot-state" data-state="dim"></div></div>
                                    </span>
                                </InlineLoader>
                            </div>
                        {/if}
                        {#if nodeState.max_alarm_state !== undefined}
                            <div class="row">
                                <span class="label">{$texts.upperLimit}</span>
                                <InlineLoader loaded={nodeAdditionalInfo?.max_alarm_value !== undefined}>
                                    <span class="value with-adornment align-right">
                                        <span class="value"
                                            >{nodeAdditionalInfo?.max_alarm_value?.toFixed(nodeState.decimal_places || 0)} {nodeState.unit}</span
                                        >
                                        <div class="dot-state-div"><div class="dot-state" data-state="dim"></div></div>
                                    </span>
                                </InlineLoader>
                            </div>
                        {/if}
                    </div>
                {/if}

                {#if nodeState.min_alarm_state !== undefined || nodeState.max_alarm_state !== undefined}
                    <div class="section-title"><h3>{$texts.warnings}</h3></div>
                    <div class="inner-content-div">
                        {#if nodeState.min_alarm_state !== undefined}
                            <div class="row">
                                <span class="label">{$texts.lowerLimit}</span>
                                <InlineLoader loaded={nodeAdditionalInfo?.min_warning_value !== undefined}>
                                    <span class="value with-adornment align-right">
                                        <span class="value"
                                            >{nodeAdditionalInfo?.min_warning_value?.toFixed(nodeState.decimal_places || 0)} {nodeState.unit}</span
                                        >
                                        <div class="dot-state-div"><div class="dot-state" data-state="dim"></div></div>
                                    </span>
                                </InlineLoader>
                            </div>
                        {/if}
                        {#if nodeState.max_alarm_state !== undefined}
                            <div class="row">
                                <span class="label">{$texts.upperLimit}</span>
                                <InlineLoader loaded={nodeAdditionalInfo?.max_warning_value !== undefined}>
                                    <span class="value with-adornment align-right">
                                        <span class="value"
                                            >{nodeAdditionalInfo?.max_warning_value?.toFixed(nodeState.decimal_places || 0)} {nodeState.unit}</span
                                        >
                                        <div class="dot-state-div"><div class="dot-state" data-state="dim"></div></div>
                                    </span>
                                </InlineLoader>
                            </div>
                        {/if}
                    </div>
                {/if}

                {#if isNumeric(nodeState)}
                    <div class="section-title"><h3>{$texts.history}</h3></div>
                    <div class="inner-content-div no-horizontal-padding">
                        <div class="history-btn-picker-div">
                            <Button
                                enableToolTip={true}
                                selected={selectedHistoryTimeSpan === LogSpanPeriod.currentHour}
                                style={$NodeDetailPickerButtonStyle}
                                buttonText={$texts._1h}
                                onClick={() => {
                                    selectedHistoryTimeSpan = LogSpanPeriod.currentHour;
                                    let { initial_date, end_date } = getTimeSpanFromLogPeriod(selectedHistoryTimeSpan);
                                    loadNodeLogs(initial_date, end_date);
                                }}
                            >
                                <div slot="tooltip"><ToolTipText text={$texts.currentHour} /></div>
                            </Button>
                            <Button
                                enableToolTip={true}
                                selected={selectedHistoryTimeSpan === LogSpanPeriod.currentDay}
                                style={$NodeDetailPickerButtonStyle}
                                buttonText={$texts._1d}
                                onClick={() => {
                                    selectedHistoryTimeSpan = LogSpanPeriod.currentDay;
                                    let { initial_date, end_date } = getTimeSpanFromLogPeriod(selectedHistoryTimeSpan);
                                    loadNodeLogs(initial_date, end_date);
                                }}
                            >
                                <div slot="tooltip"><ToolTipText text={$texts.currentDay} /></div>
                            </Button>
                            <Button
                                enableToolTip={true}
                                selected={selectedHistoryTimeSpan === LogSpanPeriod.current7Days}
                                style={$NodeDetailPickerButtonStyle}
                                buttonText={$texts._7d}
                                onClick={() => {
                                    selectedHistoryTimeSpan = LogSpanPeriod.current7Days;
                                    let { initial_date, end_date } = getTimeSpanFromLogPeriod(selectedHistoryTimeSpan);
                                    loadNodeLogs(initial_date, end_date);
                                }}
                            >
                                <div slot="tooltip"><ToolTipText text={$texts.currentWeek} /></div>
                            </Button>
                            <Button
                                enableToolTip={true}
                                selected={selectedHistoryTimeSpan === LogSpanPeriod.currentMonth}
                                style={$NodeDetailPickerButtonStyle}
                                buttonText={$texts._1M}
                                onClick={() => {
                                    selectedHistoryTimeSpan = LogSpanPeriod.currentMonth;
                                    let { initial_date, end_date } = getTimeSpanFromLogPeriod(selectedHistoryTimeSpan);
                                    loadNodeLogs(initial_date, end_date);
                                }}
                            >
                                <div slot="tooltip"><ToolTipText text={$texts.currentMonth} /></div>
                            </Button>
                            <Button
                                enableToolTip={true}
                                selected={selectedHistoryTimeSpan === LogSpanPeriod.currentYear}
                                style={$NodeDetailPickerButtonStyle}
                                buttonText={$texts._1Y}
                                onClick={() => {
                                    selectedHistoryTimeSpan = LogSpanPeriod.currentYear;
                                    let { initial_date, end_date } = getTimeSpanFromLogPeriod(selectedHistoryTimeSpan);
                                    loadNodeLogs(initial_date, end_date);
                                }}
                            >
                                <div slot="tooltip"><ToolTipText text={$texts.currentYear} /></div>
                            </Button>
                            <div class="custom-date-div">
                                <Button
                                    enableToolTip={true}
                                    selected={showCustomDatePicker}
                                    style={selectedHistoryTimeSpan === LogSpanPeriod.customDate
                                        ? $SelectedCustomDatePickerButtonStyle
                                        : $CustomDatePickerButtonStyle}
                                    buttonText=""
                                    imageURL="/img/custom-date.svg"
                                    onClick={() => {
                                        showCustomDatePicker = !showCustomDatePicker;
                                    }}
                                >
                                    <div slot="tooltip"><ToolTipText text={$texts.customPeriod} /></div>
                                </Button>
                                <DateRangePicker
                                    bind:showToolTip={showCustomDatePicker}
                                    requestCustomPeriod={(startDateTime, endDateTime) => {
                                        let initial_date = getDateFromField(startDateTime);
                                        let end_date = getDateFromField(endDateTime);
                                        loadNodeLogs(initial_date, end_date);
                                        selectedHistoryTimeSpan = LogSpanPeriod.customDate;
                                        showCustomDatePicker = false;
                                    }}
                                />
                            </div>
                        </div>
                        <div class="chart-container">
                            {#if nodeLogs}
                                <svelte:component this={nodeLogs.graphComponent} data={nodeLogs.points} unit={nodeLogs.unit} />
                            {/if}
                        </div>
                    </div>
                {/if}

                <div class="section-title"><h3>{$texts.technicalData}</h3></div>
                <div class="inner-content-div">
                    <div class="row">
                        <span class="label">{$texts.type}</span>
                        <InlineLoader loaded={nodeAdditionalInfo?.type !== undefined}>
                            <span class="value align-right">{nodeAdditionalInfo?.type}</span>
                        </InlineLoader>
                    </div>
                    <div class="row">
                        <span class="label">{$texts.protocol}</span>
                        <InlineLoader loaded={nodeAdditionalInfo?.protocol !== undefined}>
                            <span class="value align-right">{$protocolTexts[nodeAdditionalInfo?.protocol] || $pluginTexts.noProtocol}</span>
                        </InlineLoader>
                    </div>
                    <div class="row">
                        {#if nodeAdditionalInfo}
                            <span class="label">{$pluginTexts[$protocolPlugins[nodeAdditionalInfo.protocol].shortTextKey]}</span>
                            <InlineLoader loaded={nodeAdditionalInfo?.protocol !== undefined}>
                                {#if nodeAdditionalInfo}
                                    <span class="value align-right"
                                        >{getCommunicationID(nodeAdditionalInfo.protocol, nodeAdditionalInfo) || $texts.virtual}</span
                                    >
                                {/if}
                            </InlineLoader>
                        {/if}
                    </div>
                    <div class="row">
                        <span class="label">{$texts.interval}</span>
                        <InlineLoader loaded={nodeAdditionalInfo?.read_period !== undefined}>
                            <span class="value align-right">{nodeAdditionalInfo?.read_period} s</span>
                        </InlineLoader>
                    </div>
                    <div class="row">
                        <span class="label">{$texts.logging}</span>
                        <InlineLoader loaded={nodeAdditionalInfo !== undefined}>
                            {#if nodeAdditionalInfo?.logging_period !== undefined}
                                <span class="value align-right">{nodeAdditionalInfo?.logging_period} min.</span>
                            {:else}
                                <span class="value align-right">{$texts.disabled}</span>
                            {/if}
                        </InlineLoader>
                    </div>
                </div>
            {/if}
        </main>
    </RightPanelSheet>
</div>

<style>
    .dot-state {
        inline-size: 16px;
        block-size: 16px;
        border-radius: 50%;
        background: var(--state-dim-color);
    }

    .dot-state[data-state="dim"] {
        background: var(--state-dim-color);
    }

    .dot-state[data-state="okState"] {
        background: var(--state-ok-color);
    }

    .dot-state[data-state="alarmState"] {
        background: var(--state-alarm-color);
    }

    .dot-state[data-state="warningState"] {
        background: var(--state-warning-color);
    }

    .dot-state[data-state="disconnectedState"] {
        background: var(--state-disconnected-color);
    }

    .dot-state-div {
        display: flex;
        justify-content: end;
        align-items: center;
    }

    .title-div {
        display: flex;
        flex-direction: row;
        justify-content: start;
        gap: var(--title-item-gap);
        align-items: center;
        inline-size: 100%;
        block-size: 100%;
        margin: 0;
        padding: 0;
    }

    .title-div img {
        inline-size: var(--title-image-width);
        block-size: var(--title-image-height);
    }

    .title-div h3 {
        flex: 1;
        min-inline-size: 0;
        margin: 0;
        padding: 0;
        font-size: var(--title-size);
        color: var(--title-color);
        font-weight: var(--title-weight);
        line-height: var(--title-image-height);
    }

    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        inline-size: 100%;
        margin: 0;
        padding: 0;
    }

    .row.fit-height {
        block-size: auto;
    }

    .label {
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        line-height: 1;
        block-size: 100%;
    }

    .value {
        flex: 1;
        text-align: right;
        display: inline-flex;
        justify-content: end;
        align-items: center;
        white-space: nowrap;
        line-height: 1;
        block-size: 100%;
        gap: var(--value-adornment-gap, 0.5rem);
    }

    .value.align-right {
        float: right;
    }

    .value.with-adornment {
        display: inline-flex;
        justify-content: end;
        align-items: center;
    }

    .header-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--header-row-gap);
        inline-size: 100%;
        margin: 0;
        padding: 0;
    }

    .header-div .row {
        gap: var(--header-col-gap);
        block-size: var(--header-row-height);
    }

    .header-div .label {
        inline-size: var(--header-label-width);
        min-inline-size: var(--header-label-width);
        font-size: var(--header-label-size);
        color: var(--header-label-color);
        font-weight: var(--header-label-weight);
    }

    .header-div .value {
        font-size: var(--header-value-size);
        color: var(--header-value-color);
        font-weight: var(--header-value-weight);
    }

    .header-div .dot-state-div {
        inline-size: var(--header-state-div-width);
        block-size: var(--header-row-height);
    }

    .content-div {
        inline-size: 100%;
        margin: 0;
        padding: 0;
    }

    .content-div .section-title {
        margin: 0;
        padding: 0;
        border-bottom: var(--content-title-border-bottom);
    }

    .content-div .section-title h3 {
        margin: 0;
        padding: 0 var(--content-title-padding-left) var(--content-title-padding-bottom) var(--content-title-padding-left);
        font-size: var(--content-title-size);
        color: var(--content-title-color);
        font-weight: var(--content-title-weight);
        text-transform: var(--content-title-transform);
        letter-spacing: var(--content-title-spacing);
    }

    .inner-content-div {
        box-sizing: border-box;
        position: relative;
        inline-size: 100%;
        margin: 0;
        padding: var(--content-inner-padding-top) var(--content-inner-padding-horizontal) var(--content-inner-padding-bottom);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--content-row-gap);
    }

    .inner-content-div.no-horizontal-padding {
        padding-left: 0;
        padding-right: 0;
    }

    .content-div .inner-content-div .row {
        gap: var(--content-col-gap);
        block-size: var(--content-row-height);
    }

    .content-div .inner-content-div .row.fit-height {
        block-size: auto;
    }

    .content-div .inner-content-div .label {
        inline-size: var(--content-label-width);
        min-inline-size: var(--content-label-width);
        font-size: var(--content-label-size);
        color: var(--content-label-color);
        font-weight: var(--content-label-weight);
    }

    .content-div .inner-content-div .value {
        font-size: var(--content-value-size);
        color: var(--content-value-color);
        font-weight: var(--content-value-weight);
    }

    .content-div .dot-state-div {
        inline-size: var(--content-state-div-width);
        block-size: var(--content-row-height);
    }

    .content-div .inner-content-div .history-btn-picker-div {
        display: flex;
        flex-direction: row;
        gap: var(--history-btn-picker-gap);
        width: 100%;
        justify-content: start;
        align-items: center;
        height: fit-content;
    }

    .content-div .inner-content-div .custom-date-div {
        margin: 0;
        padding: 0;
        position: relative;
        width: fit-content;
        height: 100%;
    }

    .chart-container {
        padding-top: 5px;
        width: 100%;
        height: fit-content;
    }
</style>
