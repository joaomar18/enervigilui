<script lang="ts">
    import RightPanelSheet from "../../../General/RightPanelSheet.svelte";

    // Props
    export let showPanel: boolean;

    // Layout / styling props
    export let titleSize: string | undefined = "1.25rem";
    export let titleColor: string | undefined = "rgba(255, 255, 255, 0.8)";
    export let titleWeight: string | undefined = "500";
    export let titlePaddingLeft: string | undefined = "10px";
    export let titleImageWidth: string | undefined = "32px";
    export let titleImageHeight: string | undefined = "32px";

    export let headerRowHeigth: string | undefined = "25px";
    export let headerRowGap: string | undefined = "10px";
    export let headerColGap: string | undefined = "10px";
    export let headerLabelWidth: string | undefined = "75px";
    export let headerLabelSize: string | undefined = "1rem";
    export let headerLabelColor: string | undefined = "rgba(255, 255, 255, 0.6)";
    export let headerLabelWeight: string | undefined = "400";
    export let headerValueSize: string | undefined = "1rem";
    export let headerValueColor: string | undefined = "rgba(255, 255, 255, 0.8)";
    export let headerValueWeight: string | undefined = "600";

    


</script>

<RightPanelSheet useMask={false} bind:showPanel>
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
            <span class="label">Fase</span>
            <span class="value">L1</span>
        </div>
        <div class="row">
            <span class="label">Estado</span>
            <div class="row no-extend">
                <span class="value">OK</span>
                <div class="dot-state"></div>e: {headerLabelSize};
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
            <span class="label">Fase</span>
            <span class="value">L1</span>
        </div>
            </div>
        </div>
    </div>
    <div class="content-div" slot="content">
        <div class="row">
            <span class="label">Valor</span>
            <span class="value">230.45</span>
        </div>
        <div class="row">
            <span class="label">Última Atualização</span>
            <span class="value">230.45</span>
        </div>
        <div class="row">
            <span class="label">Última Inicialização</span>
            <span class="value"></span>
        </div>
    </div>
</RightPanelSheet>

<style>
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
    }

    .header-div .row .value {
        flex: 1;
        font-size: var(--header-value-size);
        color: var(--header-value-color);
        font-weight: var(--header-value-weight);
        text-align: right;
    }

    .header-div .row.no-extend .value {
        flex: 0;
    }

    .header-div .row .dot-state {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: green;
    }
</style>
