<script lang="ts">
    import RightPanelSheet from "../../../General/RightPanelSheet.svelte";
    import Measurement from "./Measurement.svelte";

    // Styles
    import { NodesBaseDisplayDetailStyle } from "$lib/style/nodes";
    import type { ProcessedNodeState } from "$lib/types/nodes/base";

    // Props
    //export let nodeState: ProcessedNodeState;
    export let showPanel: boolean;
    export let state: "alarm" | "warning" | "ok" | "disconnected" = "disconnected";

    // Layout / styling props

    export let stateAlarmColor: string | undefined = "#ef4444";
    export let stateWarningColor: string | undefined = "#f59e0b";
    export let stateOKColor: string | undefined = "#22c55e";
    export let stateDisconnectedColor: string | undefined = "#6b7280";

    export let titleSize: string | undefined = "1.25rem";
    export let titleColor: string | undefined = "rgba(255, 255, 255, 0.8)";
    export let titleWeight: string | undefined = "500";
    export let titlePaddingLeft: string | undefined = "10px";
    export let titleImageWidth: string | undefined = "32px";
    export let titleImageHeight: string | undefined = "32px";

    export let headerRowHeigth: string | undefined = "25px";
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
    export let contentRowGap: string | undefined = "10px";
    export let contentColGap: string | undefined = "10px";
    export let contentLabelWidth: string | undefined = "100px";
    export let contentLabelSize: string | undefined = "1rem";
    export let contentLabelColor: string | undefined = "rgba(255,255,255, 0.6)";
    export let contentLabelWeight: string | undefined = "400";
    export let contentValueSize: string | undefined = "1rem";
    export let contentValueColor: string | undefined = "rgba(255,255,255, 0.8)";
    export let contentValueWeight: string | undefined = "600";
</script>

<RightPanelSheet useMask={true} bind:showPanel>
    <div
        style="
            --title-size: {titleSize};
            --title-color: {titleColor};
            --title-weight: {titleWeight};
            --title-padding-left: {titlePaddingLeft};
            --title-image-width: {titleImageWidth};
            --title-image-height: {titleImageHeight};
        "
        class="title-div"
        slot="title"
    >
        <img src="/img/variable.svg" alt="Variable state" />
        <h3>Detalhes da Variável</h3>
    </div>
    <div
        style="
            --state-alarm-color: {stateAlarmColor};
            --state-warning-color: {stateWarningColor};
            --state-ok-color: {stateOKColor};
            --state-disconnected-color: {stateDisconnectedColor};

            --header-row-height: {headerRowHeigth};
            --header-row-gap: {headerRowGap};
            --header-col-gap: {headerColGap};

            --header-label-width: {headerLabelWidth};
            --header-label-size: {headerLabelSize};
            --header-label-color: {headerLabelColor};
            --header-label-weight: {headerLabelWeight};

            --header-value-size: {headerValueSize};
            --header-value-color: {headerValueColor};
            --header-value-weight: {headerValueWeight};
        "
        class="header-div"
        slot="header"
    >
        <div class="row">
            <span class="label">Nome</span>
            <span class="value">Potência Ativa</span>
        </div>
        <div class="row">
            <span class="label">Secção</span>
            <span class="value">Fase L1</span>
        </div>
        <div class="row">
            <span class="label">Estado</span>
            <div class="row no-extend">
                <span class="value">OK</span>
                <div
                    class="dot-state"
                    class:alarm={state === "alarm"}
                    class:warning={state === "warning"}
                    class:ok={state === "ok"}
                    class:disconnected={state === "disconnected"}
                ></div>
            </div>
        </div>
    </div>
    <div
        style="
            --state-alarm-color: {stateAlarmColor};
            --state-warning-color: {stateWarningColor};
            --state-ok-color: {stateOKColor};
            --state-disconnected-color: {stateDisconnectedColor};

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
        "
        class="content-div"
        slot="content"
    >
        <div class="section-title">
            <h3>Estado Atual</h3>
        </div>
        <div class="inner-content-div">
            <div class="row fit-height">
                <span class="label">Valor</span>
                <span class="value">
                    <Measurement
                        baseDisplayStyle={$NodesBaseDisplayDetailStyle}
                        disableClick={true}
                        labelText=""
                        minAlarmValue={230 * 0.9}
                        maxAlarmValue={230 * 1.1}
                        value={234.45}
                        unitText="V"
                    />
                </span>
            </div>
            <div class="row">
                <span class="label">Atualizado</span>
                <span class="value">à 7 segundos</span>
            </div>
            <!--IF INCREMENTAL-->
            <div class="row">
                <span class="label">Reiniciado</span>
                <span class="value">à 13 minutos</span>
            </div>
        </div>
        <div class="section-title">
            <h3>Alarmes</h3>
        </div>
        <div class="inner-content-div">
            <div class="row">
                <span class="label">Limite Inf.</span>
                <div class="row no-extend">
                    <div class="dot-state alarm"></div>
                    <span class="value">{(230 * 0.9).toFixed(2)} V</span>
                </div>
            </div>
            <div class="row">
                <span class="label">Limite Sup.</span>
                <div class="row no-extend">
                    <div class="dot-state alarm"></div>
                    <span class="value">{(230 * 1.1).toFixed(2)} V</span>
                </div>
            </div>
        </div>
        <div class="section-title">
            <h3>Avisos</h3>
        </div>
        <div class="inner-content-div">
            <div class="row">
                <span class="label">Limite Inf.</span>
                <div class="row no-extend">
                    <div class="dot-state warning"></div>
                    <span class="value">{(230 * 0.95).toFixed(2)} V</span>
                </div>
            </div>
            <div class="row">
                <span class="label">Limite Sup.</span>
                <div class="row no-extend">
                    <div class="dot-state warning"></div>
                    <span class="value">{(230 * 1.05).toFixed(2)} V</span>
                </div>
            </div>
        </div>
        <div class="section-title">
            <h3>Histórico</h3>
        </div>
        <div class="inner-content-div">
            <div style="width:100%; height: 750px; background-color: darkblue"></div>
        </div>
        <div class="section-title">
            <h3>Dados Técnicos</h3>
        </div>
        <div class="inner-content-div">
            <div class="row">
                <span class="label">Tipo</span>
                <span class="value">FLOAT</span>
            </div>
            <div class="row">
                <span class="label">Protocolo</span>
                <span class="value">MODBUS RTU</span>
            </div>
            <div class="row">
                <span class="label">Registo</span>
                <span class="value">0x0020</span>
            </div>
            <div class="row">
                <span class="label">Intervalo</span>
                <span class="value">5 s</span>
            </div>
        </div>
    </div>
</RightPanelSheet>

<style>
    .dot-state {
        width: 16px;
        height: 16px;
        border-radius: 50%;
    }

    .dot-state.ok {
        background-color: var(--state-ok-color);
    }

    .dot-state.alarm {
        background-color: var(--state-alarm-color);
    }

    .dot-state.warning {
        background-color: var(--state-warning-color);
    }

    .dot-state.disconnected {
        background-color: var(--state-disconnected-color);
    }

    .title-div {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    .title-div img {
        width: var(--title-image-width);
        height: var(--title-image-height);
    }

    .title-div h3 {
        flex: 1;
        min-width: 0;
        margin: 0;
        padding: 0;
        padding-left: var(--title-padding-left);
        font-size: var(--title-size);
        color: var(--title-color);
        font-weight: var(--title-weight);
        line-height: var(--title-image-height);
    }

    .header-div {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: var(--header-row-gap);
    }

    .header-div .row {
        padding: 0;
        margin: 0;
        width: 100%;
        height: var(--header-row-height);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: var(--header-col-gap);
        align-items: center;
    }

    .header-div .row.no-extend {
        justify-content: end;
    }

    .header-div .row .label {
        width: var(--header-label-width);
        min-width: var(--header-label-width);
        font-size: var(--header-label-size);
        color: var(--header-label-color);
        font-weight: var(--header-label-weight);
        line-height: 1;
        white-space: nowrap;
    }

    .header-div .row .value {
        flex: 1;
        font-size: var(--header-value-size);
        color: var(--header-value-color);
        font-weight: var(--header-value-weight);
        text-align: right;
        line-height: 1;
        white-space: nowrap;
    }

    .header-div .row.no-extend .value {
        flex: 0;
    }

    .content-div {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: fit-content;
    }

    .content-div .section-title {
        margin: 0;
        padding: 0;
        width: 100%;
        height: fit-content;
        border-bottom: var(--content-title-border-bottom);
    }

    .content-div .section-title h3 {
        margin: 0;
        padding: 0;
        padding-left: var(--content-title-padding-left);
        padding-bottom: var(--content-title-padding-bottom);
        font-size: var(--content-title-size);
        color: var(--content-title-color);
        font-weight: var(--content-title-weight);
        text-transform: var(--content-title-transform);
        letter-spacing: var(--content-title-spacing);
    }

    .content-div .inner-content-div {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        padding-left: var(--content-inner-padding-horizontal);
        padding-right: var(--content-inner-padding-horizontal);
        padding-top: var(--content-inner-padding-top);
        padding-bottom: var(--content-inner-padding-bottom);
        position: relative;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: var(--content-row-gap);
    }

    .content-div .inner-content-div .row {
        padding: 0;
        margin: 0;
        width: 100%;
        height: var(--content-row-height);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: var(--content-col-gap);
    }

    .content-div .inner-content-div .row.fit-height {
        height: fit-content;
    }

    .content-div .inner-content-div .row.no-extend {
        justify-content: end;
    }

    .content-div .inner-content-div .row .label {
        width: var(--content-label-width);
        min-width: var(--content-label-width);
        font-size: var(--content-label-size);
        color: var(--content-label-color);
        font-weight: var(--content-label-weight);
        line-height: 1;
        white-space: nowrap;
    }

    .content-div .inner-content-div .row .value {
        flex: 1;
        font-size: var(--content-value-size);
        color: var(--content-value-color);
        font-weight: var(--content-value-weight);
        text-align: right;
        line-height: 1;
        white-space: nowrap;
    }

    .content-div .inner-content-div .row.no-extend .value {
        flex: 0;
    }
</style>
