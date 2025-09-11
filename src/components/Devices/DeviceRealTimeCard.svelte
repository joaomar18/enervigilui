<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { DeviceRealTimeCardStyle } from "$lib/style/device";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $DeviceRealTimeCardStyle;

    // Props
    export let titleText: string = "";

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let minWidth: string | undefined = undefined;
    export let minHeight: string | undefined = undefined;
    export let maxWidth: string | undefined = undefined;
    export let maxHeight: string | undefined = undefined;
    export let backgroundColor: string | undefined = undefined;
    export let borderColor: string | undefined = undefined;
    export let shadow: string | undefined = undefined;
    export let borderRadius: string | undefined = undefined;
    export let titleColor: string | undefined = undefined;
    export let titleWeight: string | undefined = undefined;
    export let titlePaddingLeft: string | undefined = undefined;
    export let headerWidth: string | undefined = undefined;
    export let headerBorder: string | undefined = undefined;
    export let headerPaddingTop: string | undefined = undefined;
    export let headerPaddingBottom: string | undefined = undefined;
    export let contentVerticalPadding: string | undefined = undefined;
    export let contentHorizontalPadding: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        backgroundColor,
        borderColor,
        shadow,
        borderRadius,
        titleColor,
        titleWeight,
        titlePaddingLeft,
        headerWidth,
        headerBorder,
        headerPaddingTop,
        headerPaddingBottom,
        contentVerticalPadding,
        contentHorizontalPadding,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);
</script>

<div
    style="
        --width: {mergedStyle.width};
        --height: {mergedStyle.height};
        --min-width: {mergedStyle.minWidth};
        --min-height: {mergedStyle.minHeight};
        --max-width: {mergedStyle.maxWidth};
        --max-height: {mergedStyle.maxHeight};
        --background-color: {mergedStyle.backgroundColor};
        --border-color: {mergedStyle.borderColor};
        --border-radius: {mergedStyle.borderRadius};
        --shadow: {mergedStyle.shadow};
        --title-color: {mergedStyle.titleColor};
        --title-weight: {mergedStyle.titleWeight};
        --title-padding-left: {mergedStyle.titlePaddingLeft};
        --header-width: {mergedStyle.headerWidth};
        --header-border: {mergedStyle.headerBorder};
        --header-padding-top: {mergedStyle.headerPaddingTop};
        --header-padding-bottom: {mergedStyle.headerPaddingBottom};
        --content-vertical-padding: {mergedStyle.contentVerticalPadding};
        --content-horizontal-padding: {mergedStyle.contentHorizontalPadding};
    "
    class="container"
>
    <div class="header">
        <h3>{titleText}</h3>
    </div>
    <div class="content">
        <slot />
    </div>
</div>

<style>
    .container {
        margin: 0;
        padding: 0;
        width: var(--width);
        height: var(--height);
        min-width: var(--min-width);
        min-height: var(--min-height);
        max-width: var(--max-width);
        max-height: var(--max-height);
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
    .header {
        margin: 0;
        padding: 0;
        width: var(--header-width);
        height: fit-content;
        padding-top: var(--header-padding-top);
        padding-bottom: var(--header-padding-bottom);
        border-bottom: var(--header-border);
    }

    .header h3 {
        width: 100%;
        margin: 0;
        padding: 0;
        padding-left: var(--title-padding-left);
        text-align: left;
        color: var(--title-color);
        font-weight: var(--title-weight);
    }

    .content {
        margin: 0;
        padding-top: var(--content-vertical-padding);
        padding-bottom: var(--content-vertical-padding);
        padding-left: var(--content-horizontal-padding);
        padding-right: var(--content-horizontal-padding);
        width: 100%;
        min-height: 0;
        flex: 1;
        overflow: hidden;
        overflow-y: auto;
    }
</style>
