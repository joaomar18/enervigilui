<script lang="ts">
    import InputField from "../InputField.svelte";

    // Styles
    import { InputDateFieldStyle } from "$lib/style/general";

    // Props
    export let inputValue: string;
    export let inputInvalid: boolean = false;

    // Variables
    let placeHolderText: string = "YYYY - MM - DD";

    // Reactive Statements

    // Functions
</script>

<InputField
    style={$InputDateFieldStyle}
    {inputInvalid}
    enableInputInvalid={true}
    bind:inputValue
    {placeHolderText}
    inputType="STRING"
    disableHints={true}
/>

<style>
</style>
