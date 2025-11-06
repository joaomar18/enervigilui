<script lang="ts">
    import { onDestroy } from "svelte";
    import { EnergyDirectionFilter } from "$lib/types/view/nodes";
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
    export let selectedDirection: EnergyDirectionFilter;

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
    export let changeEnergyDirection: (selectedDirection: EnergyDirectionFilter) => void;

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
    EnergyDirectionPicker Component
    
    A specialized energy flow direction selection interface for electrical energy monitoring
    systems with dual presentation modes. Provides directional filtering options for energy
    data analysis: Forward (consumption/import), Reverse (generation/export), and Total
    (bidirectional aggregate). Features both compact tooltip-based trigger button mode and
    expanded inline selection interface, supporting responsive interaction patterns with
    click-outside detection and automatic event listener cleanup.
    
    Implements right-aligned tooltip positioning for optimal UI placement and maintains
    visual selection states across all energy direction filter options. Uses internationalized
    labels and comprehensive tooltips for each direction option (forward energy, reverse energy,
    total energy), with callback-based direction change events for parent component integration.
    Essential for energy metering systems that distinguish between energy consumption and
    energy production/feedback to the grid.
    
    The component handles window event delegation for modal interactions, manages reactive
    tooltip visibility states, and ensures proper cleanup of event listeners on component
    destruction for optimal performance and memory management. Supports customizable styling
    through theme system integration and provides consistent button behavior across both
    display modes.
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
            <div class="direction-selection-div">
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedDirection === EnergyDirectionFilter.FORWARD}
                    buttonText={$texts.forwardEnergyShort}
                    onClick={() => changeEnergyDirection(EnergyDirectionFilter.FORWARD)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.forwardEnergy} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedDirection === EnergyDirectionFilter.REVERSE}
                    buttonText={$texts.reverseEnergyShort}
                    onClick={() => changeEnergyDirection(EnergyDirectionFilter.REVERSE)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.reverseEnergy} /></div>
                </Button>
                <Button
                    enableToolTip={true}
                    style={$PickerButtonStyle}
                    selected={selectedDirection === EnergyDirectionFilter.TOTAL}
                    buttonText={$texts.totalEnergyShort}
                    onClick={() => changeEnergyDirection(EnergyDirectionFilter.TOTAL)}
                >
                    <div slot="tooltip"><ToolTipText text={$texts.totalEnergy} /></div>
                </Button>
            </div>
        </ToolTip>

        <Button
            style={effectiveToolTipButtonStyle}
            selected={showSelectionToolTip}
            buttonText=""
            imageURL={"/img/direction.svg"}
            enableToolTip={true}
            onClick={() => {
                showSelectionToolTip = !showSelectionToolTip;
            }}
        >
            <div slot="tooltip"><ToolTipText text={$texts.energyDirection} /></div>
        </Button>
    {:else}
        <div class="direction-selection-div">
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedDirection === EnergyDirectionFilter.FORWARD}
                buttonText={$texts.forwardEnergyShort}
                onClick={() => changeEnergyDirection(EnergyDirectionFilter.FORWARD)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.forwardEnergy} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedDirection === EnergyDirectionFilter.REVERSE}
                buttonText={$texts.reverseEnergyShort}
                onClick={() => changeEnergyDirection(EnergyDirectionFilter.REVERSE)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.reverseEnergy} /></div>
            </Button>
            <Button
                enableToolTip={true}
                style={$PickerButtonStyle}
                selected={selectedDirection === EnergyDirectionFilter.TOTAL}
                buttonText={$texts.totalEnergyShort}
                onClick={() => changeEnergyDirection(EnergyDirectionFilter.TOTAL)}
            >
                <div slot="tooltip"><ToolTipText text={$texts.totalEnergy} /></div>
            </Button>
        </div>
    {/if}
</div>

<style>
    /* Energy direction container - Horizontal layout for energy direction filter buttons (Forward, Reverse, Total) */
    .direction-selection-div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        width: fit-content;
        height: fit-content;
    }
</style>
