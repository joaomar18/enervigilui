<script lang="ts">
    import Button from "../../General/Button.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Props
    export let windowWidth: number;

    // Layout / styling props
    export let backgroundColor: string;

    // Export Funcions
    export let onAddNode: () => void;

    // Variables
    $: buttonHeight = windowWidth <= 880 ? "40px" : "32px";
</script>

<tr
    style="
        --background-color: {backgroundColor};
    "
    class="add-node"
>
    <td colspan="20">
        <Button
            buttonText={$texts.addNode[$selectedLang]}
            width="100%"
            borderRadius="0px"
            borderColor="transparent"
            height={buttonHeight}
            backgroundColor="#1a2027"
            hoverColor="#1f242b"
            fontSize="0.9rem"
            fontColor="#f5f5f5"
            fontWeight="400"
            onClick={onAddNode}
        />
    </td>
</tr>

<style>
    tr.add-node {
        background-color: var(--background-color);
    }

    tr td {
        height: fit-content;
        padding: 5px;
        padding-left: 0px;
        padding-right: 0px;
    }
</style>
