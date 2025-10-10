<script lang="ts">
    import { onMount } from "svelte";
    import InputField from "../InputField.svelte";

    // Styles
    import { InputTimeFieldStyle } from "$lib/style/general";

    // Props
    export let inputValue: string;
    export let inputType: "HOURS" | "MINUTES" | "SECONDS";
    export let inputInvalid: boolean = false;

    // Variables
    let maxValue: number;
    let placeHolderText: string;

    // Reactive Statements

    // Functions
    function createTypeSpecificVars(): void {
        if (inputType === "HOURS") {
            placeHolderText = "HH";
            maxValue = 23;
        } else if (inputType === "MINUTES") {
            placeHolderText = "mm";
            maxValue = 59;
        } else if (inputType === "SECONDS") {
            placeHolderText = "ss";
            maxValue = 59;
        }
    }

    onMount(() => {
        createTypeSpecificVars();
    });
</script>

<InputField
    style={$InputTimeFieldStyle}
    {inputInvalid}
    enableInputInvalid={true}
    bind:inputValue
    {placeHolderText}
    zeroPaddingDigits={2}
    inputType="POSITIVE_INT"
    {maxValue}
    validateOnInput={true}
    disableHints={true}
/>

<style>
</style>
