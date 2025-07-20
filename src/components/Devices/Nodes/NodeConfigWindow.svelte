<script lang="ts">
    import type { FormattedNode } from "$lib/stores/nodes";
    import ModalWindow from "../../General/ModalWindow.svelte";

    // Props
    export let visible: boolean;
    export let node: FormattedNode;
</script>

<ModalWindow
    title={`${node.displayName}`}
    width="100%"
    maxWidth="750px"
    height="300px"
    borderRadius="10px"
    borderColor="#2a2e3a"
    backgroundColor="#14161c"
    closeWindow={() => {
        visible = false;
    }}
></ModalWindow>

<style>
</style>
