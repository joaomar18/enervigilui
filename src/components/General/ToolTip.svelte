<script lang="ts">
    import { fade } from "svelte/transition";
    import { hasMouseCapability } from "$lib/stores/view/navigation";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { ToolTipStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $ToolTipStyle;

    // Props
    export let pushToTop: boolean = false;
    export let autoPosition: boolean = true;
    export let forceShowMobile: boolean = false;
    export let showToolTip: boolean;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let minWidth: string | undefined = undefined;
    export let maxWidth: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let minHeight: string | undefined = undefined;
    export let maxHeight: string | undefined = undefined;
    export let offsetPx: string | undefined = undefined;
    export let border: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let paddingHorizontal: string | undefined = undefined;
    export let paddingVertical: string | undefined = undefined;
    export let animationTime: number | undefined = undefined;

    $: localOverrides = {
        width,
        minWidth,
        maxWidth,
        height,
        minHeight,
        maxHeight,
        offsetPx,
        border,
        borderRadius,
        backgroundColor,
        paddingHorizontal,
        paddingVertical,
        animationTime,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let tooltipElement: HTMLDivElement;
    let showOnTop = pushToTop;
    let animationTimeNumber: number;
    let tooltipAlign: "left" | "right" | "center" = "center";

    // Reactive Statements
    $: animationTimeNumber = parseInt(String(mergedStyle.animationTime));

    $: if (showToolTip && tooltipElement && autoPosition) {
        updatePosition();
    }

    // Functions
    function updatePosition(): void {
        tooltipAlign = "center"; // Reset alignment to center
        requestAnimationFrame(() => {
            const rect = tooltipElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewPortWidth = window.innerWidth;

            const spaceAbove = rect.top;
            const spaceBelow = viewportHeight - rect.bottom;

            const offset = parseInt(String(mergedStyle.offsetPx));

            // Vertical Position
            if (spaceBelow < offset && spaceAbove > spaceBelow) {
                showOnTop = true;
            } else {
                showOnTop = false;
            }

            // Horizontal Position
            if (rect.left < offset) {
                tooltipAlign = "left";
            } else if (rect.right + offset > viewPortWidth) {
                tooltipAlign = "right";
            } else {
                tooltipAlign = "center";
            }
        });
    }
</script>

<!--
  ToolTip component

  A customizable tooltip that appears on hover or when triggered.
  - Automatically positions itself above or below the trigger element based on available space.
  - Supports horizontal alignment (left, center, right) to stay within viewport bounds.
  - Fade in/out animation with configurable duration.
  - Only shows on devices with mouse capability unless forceShowMobile is true.
-->
{#if showToolTip && ($hasMouseCapability || forceShowMobile)}
    <div
        bind:this={tooltipElement}
        transition:fade={{ duration: animationTimeNumber }}
        style="
        --width: {mergedStyle.width};
        --min-width: {mergedStyle.minWidth};
        --max-width: {mergedStyle.maxWidth};
        --height: {mergedStyle.height};
        --min-height: {mergedStyle.minHeight};
        --max-height: {mergedStyle.maxHeight};
        --offset: {mergedStyle.offsetPx};
        --border: {mergedStyle.border};
        --border-radius: {mergedStyle.borderRadius};
        --background-color: {mergedStyle.backgroundColor};
        --padding-horizontal: {mergedStyle.paddingHorizontal};
        --padding-vertical: {mergedStyle.paddingVertical};
    "
        class="tooltip-div"
        class:show-on-top={showOnTop}
        class:show-on-bottom={!showOnTop}
        class:align-left={tooltipAlign === "left"}
        class:align-right={tooltipAlign === "right"}
    >
        <div class="content">
            <slot />
        </div>
    </div>
{/if}

<style>
    /* Main tooltip container: positioned absolutely with customizable dimensions and styling */
    .tooltip-div {
        margin: 0;
        width: var(--width);
        min-width: var(--min-width);
        max-width: var(--max-width);
        height: var(--height);
        min-height: var(--min-height);
        max-height: var(--max-height);
        border: var(--border);
        border-radius: var(--border-radius);
        background-color: var(--background-color);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
        padding-top: var(--padding-vertical);
        padding-bottom: var(--padding-vertical);
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        z-index: 1;
    }

    /* Tooltip positioned above the trigger element */
    .tooltip-div.show-on-top {
        bottom: var(--offset);
        transform-origin: bottom center;
    }

    /* Tooltip positioned below the trigger element */
    .tooltip-div.show-on-bottom {
        top: var(--offset);
        transform-origin: top center;
    }

    /* Left-aligned tooltip (when close to left edge of viewport) */
    .tooltip-div.align-left {
        transform: translateX(50%);
    }

    /* Right-aligned tooltip (when close to right edge of viewport) */
    .tooltip-div.align-right {
        transform: translateX(-50%);
    }

    /* Content wrapper: fills the tooltip container */
    .content {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
</style>
