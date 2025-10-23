<script lang="ts">
    import { computePosition, limitShift, shift, offset } from "@floating-ui/dom";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { GraphToolTipStyle } from "$lib/style/graph";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $GraphToolTipStyle;

    // Props
    export let zIndex: number = 200; // Default z-index
    export let originalParent: HTMLElement | null = null;
    export let cursorPos: { x: number | undefined; y: number | undefined };
    export let insideGraph: boolean;

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
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let parentElement: HTMLElement;
    let tooltipElement: HTMLDivElement;

    // Reactive Statements
    $: if (tooltipElement) {
        if (originalParent) {
            parentElement = originalParent;
        } else if (tooltipElement.parentElement) {
            parentElement = tooltipElement.parentElement;
        } else {
            throw new Error("Parent element needs to be defined by prop or by dom relationship.");
        }
    }
    $: if (cursorPos && cursorPos.x !== undefined && cursorPos.y !== undefined) {
        updatePosition();
    }

    // Functions
    function makeVirtualRef(x: number, y: number, parent: HTMLElement) {
        const parentRect = parent.getBoundingClientRect();
        const cx = parentRect.left + x;
        const cy = parentRect.top + y;
        return {
            getBoundingClientRect: () => new DOMRect(cx, cy, 0, 0),
        };
    }

    async function updatePosition(): Promise<void> {
        if (!parentElement || !tooltipElement || cursorPos.x === undefined || cursorPos.y === undefined || cursorPos.x < 0 || cursorPos.y < 0) return;

        const virtualRef = makeVirtualRef(cursorPos.x, cursorPos.y, parentElement);

        const { x, y } = await computePosition(virtualRef, tooltipElement, {
            placement: "top-start",
            strategy: "absolute",
            middleware: [
                offset({ mainAxis: parseInt(String(mergedStyle.offsetPx)) }),
                shift({
                    boundary: parentElement,
                    crossAxis: true,
                    padding: parseInt(String(mergedStyle.offsetPx)),
                    limiter: limitShift(),
                }),
            ],
        });

        let finalX = x - parentElement.getBoundingClientRect().left;
        let finalY = y - parentElement.getBoundingClientRect().top;

        Object.assign(tooltipElement.style, {
            left: `${finalX}px`,
            top: `${finalY}px`,
        });

        console.log(parentElement.getBoundingClientRect().left, parentElement.getBoundingClientRect().top);
    }
</script>

{#if insideGraph}
    <div
        bind:this={tooltipElement}
        style="
        --z-index: {zIndex};
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
        pointer-events: none;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        z-index: var(--z-index);
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
