<script lang="ts">
    import { onDestroy } from "svelte";
    import { createDateTimeField } from "$lib/logic/util/date";
    import ToolTip from "./ToolTip.svelte";
    import Button from "./Button.svelte";
    import TimeField from "./TimeDate/TimeField.svelte";
    import DateField from "./TimeDate/DateField.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { ToolTipDatePickerStyle } from "$lib/style/general";
    import { SubPrimaryButtonStyle, SubDefaultButtonStyle } from "$lib/style/button";

    // Props
    export let showToolTip: boolean;

    // Layout / styling props
    export let paddingHorizontal: string | undefined = "20px";
    export let paddingTop: string | undefined = "20px";
    export let paddingBottom: string | undefined = "20px";
    export let labelSize: string | undefined = "15px";
    export let labelColor: string | undefined = "white";
    export let labelWeight: string | undefined = "400";
    export let labelPaddingLeft: string | undefined = "5px";
    export let contentGap: string | undefined = "20px";
    export let fieldGap: string | undefined = "10px";
    export let rowGap: string | undefined = "10px";

    // Variables
    let startDateTime = createDateTimeField();
    let endDateTime = createDateTimeField(new Date());
    let containerDiv: HTMLDivElement;
    let clickEventListenerDefined: boolean = false;

    // Reactive Statements
    $: if (!showToolTip && clickEventListenerDefined) {
        window.removeEventListener("click", handleClickOutside);
        startDateTime = createDateTimeField();
        endDateTime = createDateTimeField(new Date());
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

<ToolTip
    style={$ToolTipDatePickerStyle}
    autoPositionContinuous={true}
    zIndex={198}
    width="50vw"
    minWidth="300px"
    maxWidth="375px"
    maxHeight="auto"
    {showToolTip}
>
    <div
        style="
            --padding-horizontal: {paddingHorizontal};
            --padding-top: {paddingTop};
            --padding-bottom: {paddingBottom};
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
                    <div class="extend">
                        <DateField bind:yearValue={startDateTime.year} bind:monthValue={startDateTime.month} bind:dayValue={startDateTime.day} />
                    </div>
                    <TimeField bind:hourValue={startDateTime.hour} bind:minuteValue={startDateTime.minute} useSecond={false} width="35%" />
                </div>
            </div>
            <div class="field">
                <span>Fim</span>
                <div class="row">
                    <div class="extend">
                        <DateField bind:yearValue={endDateTime.year} bind:monthValue={endDateTime.month} bind:dayValue={endDateTime.day} />
                    </div>
                    <TimeField bind:hourValue={endDateTime.hour} bind:minuteValue={endDateTime.minute} useSecond={false} width="35%" />
                </div>
            </div>
            <div class="action-buttons-div">
                <Button buttonText={$texts.confirm} style={$SubPrimaryButtonStyle} onClick={() => {}} />
                <Button
                    buttonText={$texts.cancel}
                    style={$SubDefaultButtonStyle}
                    onClick={() => {
                        showToolTip = false;
                    }}
                />
            </div>
        </div>
    </div>
</ToolTip>

<style>
    .date-picker-div {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        container-type: inline-size; /* Enable container queries */
    }
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
        justify-content: space-between;
        width: 100%;
        height: fit-content;
        align-items: center;
        gap: var(--row-gap);
    }

    .content .field .row .extend {
        flex: 1;
        min-width: 0;
        height: fit-content;
    }

    .content .action-buttons-div {
        padding-top: 10px;
        display: flex;
        flex-direction: row;
        gap: 20px;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
