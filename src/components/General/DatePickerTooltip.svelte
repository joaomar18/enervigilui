<script lang="ts">
    import { onDestroy } from "svelte";
    import ToolTip from "./ToolTip.svelte";
    import Button from "./Button.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { ToolTipDatePickerStyle } from "$lib/style/general";
    import { SubPrimaryButtonStyle, SubDefaultButtonStyle } from "$lib/style/button";
    import InputTimeField from "./TimeDate/InputTimeField.svelte";
    import InputDateField from "./TimeDate/InputDateField.svelte";

    // Props
    export let showToolTip: boolean;

    // Layout / styling props
    export let padding: string | undefined = "10px";
    export let labelSize: string | undefined = "15px";
    export let labelColor: string | undefined = "white";
    export let labelWeight: string | undefined = "400";
    export let labelPaddingLeft: string | undefined = "5px";
    export let contentGap: string | undefined = "20px";
    export let fieldGap: string | undefined = "10px";
    export let rowGap: string | undefined = "10px";

    // Variables
    let startDate = "";
    let startHours = "";
    let startMinutes = "";
    let endHours = "";
    let endMinutes = "";
    let endDate = "";
    let containerDiv: HTMLDivElement;
    let clickEventListenerDefined: boolean = false;

    // Reactive Statements
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

<ToolTip style={$ToolTipDatePickerStyle} zIndex={198} width="400px" minWidth="auto" maxWidth="auto" {showToolTip}>
    <div
        style="
            --padding: {padding};
            --label-size: {labelSize};
            --label-color: {labelColor};
            --label-weight: {labelWeight};
            --label-padding-left: {labelPaddingLeft};
            --content-gap: {contentGap};
            --field-gap: {fieldGap};
            --row-gap: {rowGap};
        "
        bind:this={containerDiv}
        class="date-picker-div"
    >
        <div class="content">
            <div class="field">
                <span>Início</span>
                <div class="row">
                    <InputDateField inputValue={startDate} />
                    <InputTimeField inputValue={startHours} inputType="HOURS" />
                    <span class="time-sep">:</span>
                    <InputTimeField inputValue={startMinutes} inputType="MINUTES" />
                </div>
            </div>
            <div class="field">
                <span>Fim</span>
                <div class="row">
                    <InputDateField inputValue={endDate} />
                    <InputTimeField inputValue={endHours} inputType="HOURS" />
                    <span class="time-sep">:</span>
                    <InputTimeField inputValue={endMinutes} inputType="MINUTES" />
                </div>
            </div>
            <Button buttonText={$texts.confirm} style={$SubPrimaryButtonStyle} onClick={() => {}} />
            <Button buttonText={$texts.cancel} style={$SubDefaultButtonStyle} onClick={() => {}} />
        </div>
    </div>
</ToolTip>

<style>
    .date-picker-div {
        width: fit-content;
        height: fit-content;
        padding: var(--padding);
    }
    .content {
        margin: 0;
        padding: 0;
        position: relative;
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: var(--content-gap);
    }

    .content .field {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        gap: var(--field-gap);
    }

    .content .field span {
        font-size: var(--label-size);
        color: var(--label-color);
        font-weight: var(--label-weight);
        padding: 0;
        padding-left: var(--label-padding-left);
    }

    .content .field .row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: var(--row-gap);
    }
</style>
