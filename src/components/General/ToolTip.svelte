<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { hasMouseCapability } from "$lib/stores/view/navigation";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { ToolTipStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $ToolTipStyle;

    // Props
    export let pushToTop: boolean = false;
    export let autoPosition: boolean = false;
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

    // Reactive Statements
    $: animationTimeNumber = parseInt(String(mergedStyle.animationTime));

    // Functions
    function checkPosition() {
        if (!autoPosition || !tooltipElement) return;

        const rect = tooltipElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const offset = parseInt(String(mergedStyle.offsetPx));

        if (spaceBelow < offset && spaceAbove > spaceBelow) {
            showOnTop = true;
        } else {
            showOnTop = false;
        }
    }

    onMount(() => {
        if (autoPosition) {
            let timeout: ReturnType<typeof setTimeout> | null = null;

            const checkPositionThrottled = () => {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                timeout = setTimeout(checkPosition, 10); // Limit to 10 ms
            };

            checkPosition();
            window.addEventListener("resize", checkPositionThrottled, { passive: true });
            window.addEventListener("scroll", checkPositionThrottled, { passive: true });

            return () => {
                window.removeEventListener("resize", checkPositionThrottled);
                window.removeEventListener("scroll", checkPositionThrottled);
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            };
        }
    });
</script>

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
    >
        <div class="content">
            <slot />
        </div>
    </div>
{/if}

<style>
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

    .tooltip-div.show-on-top {
        bottom: var(--offset);
        transform-origin: bottom center;
    }

    .tooltip-div.show-on-bottom {
        top: var(--offset);
        transform-origin: top center;
    }

    .content {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }
</style>
