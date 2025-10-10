<script lang="ts">
    import { onMount } from "svelte";
    import InputField from "../InputField.svelte";
    import { validateStringNumber } from "./DateTimeValidation";

    // Styles
    import { InputTimeFieldStyle } from "$lib/style/general";

    // Props
    export let hours: string = "";
    export let minutes: string = "";
    export let seconds: string = "";
    export let useHours: boolean = true;
    export let useMinutes: boolean = true;
    export let useSeconds: boolean = true;
    export let inputInvalid: boolean = false;

    // Variables
    let hoursId: string = "HH";
    let minutesId: string = "mm";
    let secondsId: string = "ss";
    let formatterSep: string = " : ";
    let usedFields: Array<string> = [];

    let inputValue: string;

    let placeHolderText: string = "";

    // Reactive Statements

    // Functions

    function validateTime(): void {
        let values = inputValue.split(formatterSep);
        let validValues: Array<string> = [];
        for (let i = 0; i < values.length; i++) {
            validValues[i] = validateStringNumber(values[i]);
        }

        for (let field of usedFields) {
            if (field === hoursId) {
                // Hours
            } else if (field === "mm") {
                // Minutes
            } else if (field === "ss") {
                // Seconds
            }
        }
    }

    function constructFields(): void {
        if (useHours) {
            usedFields.push(hoursId);
        }
        if (useMinutes) {
            usedFields.push(minutesId);
        }
        if (useSeconds) {
            usedFields.push(secondsId);
        }
    }

    function constructPlaceHolder(): void {
        for (let field of usedFields) {
            if (placeHolderText) placeHolderText += formatterSep;
            placeHolderText += field;
        }
    }

    onMount(() => {
        constructFields();
        constructPlaceHolder();
    });
</script>

<InputField
    style={$InputTimeFieldStyle}
    {inputInvalid}
    enableInputInvalid={true}
    bind:inputValue
    {placeHolderText}
    zeroPaddingDigits={2}
    disableHints={true}
    onChange={validateTime}
/>

<style>
</style>
