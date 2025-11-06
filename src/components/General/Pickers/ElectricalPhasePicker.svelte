<script lang="ts">
    import { onDestroy } from "svelte";
    import { SelectablePhaseFilter } from "$lib/types/view/nodes";
    import Button from "../Button.svelte";
    import ToolTip from "../ToolTip.svelte";
    import ToolTipText from "../ToolTipText.svelte";

    // Texts
    import { texts } from "$lib/stores/lang/generalTexts";

    // Styles
    import { PickerToolTipStyle } from "$lib/style/general";
    import { PickerToolTipButtonStyle } from "$lib/style/general";
    import { PickerButtonStyle } from "$lib/style/general";

    // Style object (from theme)
    export let toolTipButtonStyle: { [property: string]: string | number } | null = null;
    $: effectiveToolTipButtonStyle = toolTipButtonStyle ?? $PickerToolTipButtonStyle;

    // Props
    export let useToolTip: boolean = true;
    export let selectedPhase: SelectablePhaseFilter;

    // Variables
    let containerDiv: HTMLDivElement;
    let clickEventListenerDefined: boolean = false;
    let showSelectionToolTip: boolean = false;

    // Reactive Statements
    $: if (!showSelectionToolTip && clickEventListenerDefined) {
        window.removeEventListener("click", handleClickOutside);
        clickEventListenerDefined = false;
    }
    $: if (showSelectionToolTip && !clickEventListenerDefined) {
        requestAnimationFrame(() => {
            window.addEventListener("click", handleClickOutside);
            clickEventListenerDefined = true;
        });
    }

    // Export Functions
    export let changePhaseFilter: (selectedPhase: SelectablePhaseFilter) => void;

    // Functions
    function handleClickOutside(event: MouseEvent): void {
        if (showSelectionToolTip && containerDiv && !containerDiv.contains(event.target as Node)) {
            showSelectionToolTip = false;
        }
    }

    onDestroy(() => {
        if (clickEventListenerDefined) {
            window.removeEventListener("click", handleClickOutside);
        }
    });
</script>

<!--
    ElectricalPhasePicker Component
    
    A specialized phase filter selection interface for electrical data visualization with
    dual presentation modes. Provides phase-specific filtering options (L1, L2, L3) and
    aggregated total view for electrical measurement data. Features both compact tooltip-based
    trigger button mode and expanded inline selection interface, supporting responsive
    interaction patterns with click-outside detection and automatic event listener cleanup.
    
    Implements right-aligned tooltip positioning for optimal UI placement and maintains
    visual selection states across all phase filter options. Uses internationalized labels
    and comprehensive tooltips for each phase option, with callback-based phase change
    events for parent component integration. Supports customizable styling through theme
    system integration and provides consistent button behavior across both display modes.
    
    The component handles window event delegation for modal interactions, manages reactive
    tooltip visibility states, and ensures proper cleanup of event listeners on component
    destruction for optimal performance and memory management.
-->
<div bind:this={containerDiv}>
    {#if useToolTip}
        <ToolTip
            style={$PickerToolTipStyle}
            maxWidth="auto"
            zIndex={198}
            forceShowMobile={true}
            showToolTip={showSelectionToolTip}
            autoPositionContinuous={true}
            alignType="right"
        >
            <div class="phase-selection-div">
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedPhase === SelectablePhaseFilter.L1}
                    buttonText={$texts.l1}
                    onClick={() => changePhaseFilter(SelectablePhaseFilter.L1)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.l1Phase} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedPhase === SelectablePhaseFilter.L2}
                    buttonText={$texts.l2}
                    onClick={() => changePhaseFilter(SelectablePhaseFilter.L2)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.l2Phase} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedPhase === SelectablePhaseFilter.L3}
                    buttonText={$texts.l3}
                    onClick={() => changePhaseFilter(SelectablePhaseFilter.L3)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.l3Phase} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedPhase === SelectablePhaseFilter.TOTAL}
                    buttonText={$texts.totalShort}
                    onClick={() => changePhaseFilter(SelectablePhaseFilter.TOTAL)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.total} /></div>
                </Button>
            </div>
        </ToolTip>

        <Button
            style={effectiveToolTipButtonStyle}
            fontSize="22px"
            selected={showSelectionToolTip}
            buttonText={$texts.phaseShort}
            enableToolTip={true}
            onClick={() => {
                showSelectionToolTip = !showSelectionToolTip;
            }}
        >
            <div slot="tooltip"><ToolTipText text={$texts.phaseSelection} /></div>
        </Button>
    {:else}
        <div class="phase-selection-div">
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedPhase === SelectablePhaseFilter.L1}
                buttonText={$texts.l1}
                onClick={() => changePhaseFilter(SelectablePhaseFilter.L1)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.l1Phase} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedPhase === SelectablePhaseFilter.L2}
                buttonText={$texts.l2}
                onClick={() => changePhaseFilter(SelectablePhaseFilter.L2)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.l2Phase} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedPhase === SelectablePhaseFilter.L3}
                buttonText={$texts.l3}
                onClick={() => changePhaseFilter(SelectablePhaseFilter.L3)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.l3Phase} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedPhase === SelectablePhaseFilter.TOTAL}
                buttonText={$texts.totalShort}
                onClick={() => changePhaseFilter(SelectablePhaseFilter.TOTAL)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.total} /></div>
            </Button>
        </div>
    {/if}
</div>

<style>
    /* Phase selection container - Horizontal layout for electrical phase filter buttons (L1, L2, L3, Total) */
    .phase-selection-div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        width: fit-content;
        height: fit-content;
    }
</style>
