<script lang="ts">
    import RightPanelSheet from "../../../General/RightPanelSheet.svelte";
    import Measurement from "./Measurement.svelte";
    import Action from "../../../General/Action.svelte";
    import Button from "../../../General/Button.svelte";

    // Styles
    import { NodesBaseDisplayDetailStyle } from "$lib/style/nodes";
    import type { ProcessedNodeState } from "$lib/types/nodes/base";

    // Props
    //export let nodeState: ProcessedNodeState;
    export let showPanel: boolean;
    export let state: "alarm" | "warning" | "ok" | "disconnected" = "disconnected";

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
            <h3>Detalhes da Variável</h3>
        </header>

        <section slot="header" class="header-div" aria-labelledby="hdr-title">
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
                <span class="value with-adornment">
                    <span class="value">OK</span>
                    <div class="dot-state-div">
                        <div class="dot-state" data-state={state}></div>
                    </div>
                </span>
            </div>
        </section>

        <main slot="content" class="content-div">
            <div class="section-title"><h3>Estado Atual</h3></div>
            <div class="inner-content-div">
                <div class="row fit-height">
                    <span class="label">Valor</span>
                    <span class="value">
                        <Measurement
                            baseDisplayStyle={$NodesBaseDisplayDetailStyle}
                            disableClick
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
                <div class="row">
                    <dt class="label">Reiniciado</dt>
                    <dd class="value">à 13 minutos</dd>
                </div>
            </div>

            <div class="section-title"><h3>Alarmes</h3></div>
            <div class="inner-content-div">
                <div class="row">
                    <span class="label">Limite Inf.</span>
                    <span class="value with-adornment">
                        <span class="value">{(230 * 0.9).toFixed(2)} V</span>
                        <div class="dot-state-div"><div class="dot-state" data-state="dim"></div></div>
                    </span>
                </div>
                <div class="row">
                    <span class="label">Limite Sup.</span>
                    <span class="value with-adornment">
                        <span class="value">{(230 * 1.1).toFixed(2)} V</span>
                        <div class="dot-state-div"><div class="dot-state" data-state="dim"></div></div>
                    </span>
                </div>
            </div>

            <div class="section-title"><h3>Avisos</h3></div>
            <div class="inner-content-div">
                <div class="row">
                    <span class="label">Limite Inf.</span>
                    <span class="value with-adornment">
                        <span class="value">{(230 * 0.95).toFixed(2)} V</span>
                        <div class="dot-state-div"><div class="dot-state" data-state="dim"></div></div>
                    </span>
                </div>
                <div class="row">
                    <span class="label">Limite Sup.</span>
                    <span class="value with-adornment">
                        <span class="value">{(230 * 1.05).toFixed(2)} V</span>
                        <div class="dot-state-div"><div class="dot-state" data-state="dim"></div></div>
                    </span>
                </div>
            </div>

            <div class="section-title"><h3>Histórico</h3></div>
            <div class="inner-content-div">
                <div class="history-btn-picker-div">
                    <Button buttonText="1h" onClick={() => {}} />
                    <Button buttonText="24H" onClick={() => {}} />
                    <Button buttonText="7D" onClick={() => {}} />
                    <Button buttonText="1M" onClick={() => {}} />
                    <Action imageURL="/img/custom-date.svg" onClick={() => {}} />
                </div>
                <div style="width:100%; height:750px; background-color:darkblue"></div>
            </div>

            <div class="section-title"><h3>Dados Técnicos</h3></div>
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

    .dot-state[data-state="ok"] {
        background: var(--state-ok-color);
    }

    .dot-state[data-state="alarm"] {
        background: var(--state-alarm-color);
    }

    .dot-state[data-state="warning"] {
        background: var(--state-warning-color);
    }

    .dot-state[data-state="disconnected"] {
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
</style>
