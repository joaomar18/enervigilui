<script lang="ts">
    import Button from "../../General/Button.svelte";

    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Styles
    import { AddNodeButtonStyle } from "$lib/style/button";

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
        <Button buttonText={$texts.addNode[$selectedLang]} style={$AddNodeButtonStyle} height={buttonHeight} onClick={onAddNode} />
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
