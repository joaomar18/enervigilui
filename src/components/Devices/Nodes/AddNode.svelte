<script lang="ts">
    import Button from "../../General/Button.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Layout / styling props
    export let backgroundColor: string;

    // Export Funcions
    export let onAddNode: () => void;
</script>

<tr
    style="
        --background-color: {backgroundColor};
    "
    class="add-node"
>
    <td colspan="10">
        <Button
            buttonText={$texts.addNode[$selectedLang]}
            width="100%"
            height="32px"
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
