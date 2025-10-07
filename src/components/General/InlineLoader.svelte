<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { InlineLoaderStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $InlineLoaderStyle;

    // Props
    export let loaded: boolean;

    // Layout / styling props
    export let width: string | undefined = "100%";
    export let height: string | undefined = "100%";
    export let backgroundColor: string | undefined = "transparent";
    export let border: string | undefined = "none";
    export let shadow: string | undefined = "none";
    export let waveBackground: string | undefined = "linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)";
    export let waveAnimationTime: string | undefined = "1.6s";

    $: localOverrides = {
        width,
        height,
        backgroundColor,
        border,
        shadow,
        waveBackground,
        waveAnimationTime,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);
</script>

<div
    style="
        --width: {mergedStyle.width};
        --height: {mergedStyle.height};
        --background-color: {mergedStyle.backgroundColor};
        --border: {mergedStyle.border};
        --shadow: {mergedStyle.shadow};
        --wave-background: {mergedStyle.waveBackground};
        --wave-animation-time: {mergedStyle.waveAnimationTime};
    "
    class="inline-loader-div"
    class:loaded
>
    <div class="content">
        <slot />
    </div>
    <div class="wave"></div>
</div>

<style>
    .inline-loader-div {
        position: relative;
        overflow: hidden;
        width: var(--width);
        height: var(--height);
        background-color: var(--background-color);
        border: var(--border);
        box-shadow: var(--shadow);
    }

    .inline-loader-div .content {
        margin: 0;
        padding: 0;
        position: relative;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    .inline-loader-div.loaded .content {
        opacity: 1;
    }

    .inline-loader-div .wave {
        position: absolute;
        top: 0;
        left: -150%;
        width: 50%;
        height: 100%;
        background: var(--wave-background);
        animation: wave var(--wave-animation-time) ease-in-out infinite;
    }

    @keyframes wave {
        0% {
            left: -150%;
        }
        100% {
            left: 150%;
        }
    }

    .inline-loader-div.loaded {
        background-color: transparent;
        border: none;
        box-shadow: none;
    }

    .inline-loader-div.loaded .wave {
        animation: none;
        opacity: 0;
    }
</style>
