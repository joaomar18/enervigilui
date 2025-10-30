<script lang="ts">
    import { onDestroy } from "svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { FullScreenPanelStyle } from "$lib/style/dashboard";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $FullScreenPanelStyle;

    // Layout / styling props
    export let blurFilter: string | undefined = undefined;
    export let background: string | undefined = undefined;
    export let paddingHorizontal: string | undefined = undefined;
    export let paddingTop: string | undefined = undefined;
    export let paddingBottom: string | undefined = undefined;

    $: localOverrides = {
        blurFilter,
        background,
        paddingHorizontal,
        paddingTop,
        paddingBottom,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Variables
    let fullscreenContainer: HTMLDivElement;
    let loaded: boolean = false;

    // Reactive Statements
    $: if (!loaded && fullscreenContainer) {
        document.body.appendChild(fullscreenContainer);
        loaded = true;
    }

    // Functions
    onDestroy(() => {
        if (loaded) {
            document.body.removeChild(fullscreenContainer);
            loaded = false;
        }
    });
</script>

<div
    bind:this={fullscreenContainer}
    style="
        --blur-filter: {mergedStyle.blurFilter};
        --background: {mergedStyle.background};
        --padding-horizontal: {mergedStyle.paddingHorizontal};
        --padding-top: {mergedStyle.paddingTop};
        --padding-bottom: {mergedStyle.paddingBottom};
    "
    class="fullscreen-div"
    class:loaded
>
    <div class="content"></div>
</div>

<style>
    .fullscreen-div {
        position: fixed;
        display: none;
        margin: 0;
        padding: 0;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 1000;
        backdrop-filter: blur(var(--blur-filter));
        -webkit-backdrop-filter: blur(var(--blur-filter));
        background: var(--background);
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        padding-left: var(--padding-horizontal);
        padding-right: var(--padding-horizontal);
    }

    .fullscreen-div.loaded {
        display: block;
    }

    .content {
        background-color: red;
        width: 100%;
        height: 100%;
        position: relative;
        margin: 0;
        padding: 0;
    }
</style>
