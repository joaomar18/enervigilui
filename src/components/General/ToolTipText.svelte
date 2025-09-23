<script lang="ts">
    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { ToolTipTextStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $ToolTipTextStyle;

    // Props
    export let text: string;

    //Layout / styling Props
    export let textColor: string | undefined = undefined;
    export let textWeight: string | undefined = undefined;
    export let textSize: string | undefined = undefined;

    $: localOverrides = {
        textColor,
        textWeight,
        textSize,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);
</script>

<span
    style="
        --text-color: {mergedStyle.textColor};
        --text-weight: {mergedStyle.textWeight};
        --text-size: {mergedStyle.textSize};
    ">{text}</span
>

<style>
    span {
        color: var(--text-color);
        font-weight: var(--text-weight);
        font-size: var(--text-size);
        text-align: center;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
    }
</style>
