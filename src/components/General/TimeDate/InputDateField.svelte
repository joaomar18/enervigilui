<script lang="ts">
    import InputField from "../InputField.svelte";

    // Props
    export let inputValue: string;
    export let inputInvalid: boolean = false;

    // Variables
    let placeHolderText: string = "YYYY-MM-DD";

    // Reactive Statements

    // Functions
</script>

<InputField {inputInvalid} enableInputInvalid={true} bind:inputValue {placeHolderText} inputType="STRING" disableHints={true} />

<style>
</style>
