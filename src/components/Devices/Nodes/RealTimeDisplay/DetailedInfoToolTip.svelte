<script lang="ts">
    import { onDestroy } from "svelte";
    import ToolTip from "../../../General/ToolTip.svelte";

    //Props
    export let showToolTip: boolean;

    // Variables
    let toolTipDiv: HTMLDivElement;
    let clickEventListenerDefined: boolean = false;

    // Reactive Statements
    $: if (showToolTip && !clickEventListenerDefined) {
        window.addEventListener("click", handleClickOutside);
        clickEventListenerDefined = true;
    }

    $: if (!showToolTip && clickEventListenerDefined) {
        window.removeEventListener("click", handleClickOutside);
        clickEventListenerDefined = false;
    }

    // Functions
    function handleClickOutside(event: MouseEvent): void {
        if (
            showToolTip &&
            toolTipDiv &&
            !toolTipDiv.contains(event.target as Node) &&
            toolTipDiv.parentElement &&
            !toolTipDiv.parentElement.contains(event.target as Node)
        ) {
            showToolTip = false;
        }
    }

    onDestroy(() => {
        if (clickEventListenerDefined) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

<div class="tooltip-div" bind:this={toolTipDiv}>
    <ToolTip width="90%" height="300px" {showToolTip}></ToolTip>
</div>

<style>
    .tooltip-div {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: start;
    }
</style>
