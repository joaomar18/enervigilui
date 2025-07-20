<script lang="ts">
    import type { FormattedNode, NodePhase } from "$lib/stores/nodes";
    import ModalWindow from "../../General/ModalWindow.svelte";

    // Stores for variable definitions
    import { defaultVariables } from "$lib/stores/nodes";

    // Stores for multi-language support
    import { texts, variableNameTextsByPhase, selectedLang } from "$lib/stores/lang";

    // Props
    export let visible: boolean;
    export let node: FormattedNode;
    export let section: NodePhase;

    // Variables
    let title: string;

    $: if (node) {
        title = `${node.displayName}, ${$texts.section[$selectedLang]}: ${section}`;
    }
</script>

<ModalWindow
    customTitle={true}
    width="100%"
    maxWidth="750px"
    height="300px"
    borderRadius="10px"
    borderColor="#2a2e3a"
    backgroundColor="#14161c"
    closeWindow={() => {
        visible = false;
    }}
>
    <span slot="header" class="header">
        <span class="main-text">{`${$texts.variable[$selectedLang]}:`}</span>
        <span class="sub-text">{node.displayName}</span>
        <span class="main-text">{`${$texts.section[$selectedLang]}:`}</span>
        <span class="sub-text">{section}</span>
        <span class="main-text">{`${$texts.protocol[$selectedLang]}:`}</span>
        <span class="sub-text">{node.protocol}</span>
    </span>
</ModalWindow>

<style>
    .header {
        margin: 0;
        padding: 15px;
        padding-right: 50px;
        line-height: 1.5;
        text-wrap: wrap;
    }

    .header .main-text {
        font-size: 1rem;
        color: #f5f5f5;
        font-weight: 400;
    }

    .header .sub-text {
        padding-left: 5px;
        padding-right: 10px;
        font-size: 1rem;
        color: rgb(147, 147, 147);
        font-weight: 300;
    }
</style>
