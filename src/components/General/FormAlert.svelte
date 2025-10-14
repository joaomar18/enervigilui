<script lang="ts">
    import { fade } from "svelte/transition";
    import { AlertType } from "$lib/stores/view/toast";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { FormAlertStyle } from "$lib/style/general";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $FormAlertStyle;

    // Props
    export let alertText: string;
    export let alertType: AlertType;
    export let alertVariables: Record<string, string | number> | undefined = undefined;

    // Layout / styling props
    export let width: string | undefined = undefined;
    export let height: string | undefined = undefined;
    export let padding: string | undefined = undefined;
    export let textSize: string | undefined = undefined;
    export let textWeight: string | undefined = undefined;
    export let textLeftPadding: string | undefined = undefined;
    export let borderRadiusRight: string | undefined = undefined;
    export let iconSize: string | undefined = undefined;
    export let alertBackgroundColor: string | undefined = undefined;
    export let alertBorderLeft: string | undefined = undefined;
    export let alertIconColor: string | undefined = undefined;
    export let alertTextColor: string | undefined = undefined;
    export let warningBackgroundColor: string | undefined = undefined;
    export let warningBorderLeft: string | undefined = undefined;
    export let warningIconColor: string | undefined = undefined;
    export let warningTextColor: string | undefined = undefined;
    export let infoBackgroundColor: string | undefined = undefined;
    export let infoBorderLeft: string | undefined = undefined;
    export let infoIconColor: string | undefined = undefined;
    export let infoTextColor: string | undefined = undefined;
    export let neutralBackgroundColor: string | undefined = undefined;
    export let neutralBorderLeft: string | undefined = undefined;
    export let neutralIconColor: string | undefined = undefined;
    export let neutralTextColor: string | undefined = undefined;

    $: localOverrides = {
        width,
        height,
        padding,
        textSize,
        textWeight,
        textLeftPadding,
        borderRadiusRight,
        iconSize,
        alertBackgroundColor,
        alertBorderLeft,
        alertIconColor,
        alertTextColor,
        warningBackgroundColor,
        warningBorderLeft,
        warningIconColor,
        warningTextColor,
        infoBackgroundColor,
        infoBorderLeft,
        infoIconColor,
        infoTextColor,
        neutralBackgroundColor,
        neutralBorderLeft,
        neutralIconColor,
        neutralTextColor,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Color Picking
    const colorMap = {
        [AlertType.ALERT]: {
            background: () => String(mergedStyle.alertBackgroundColor),
            borderLeft: () => String(mergedStyle.alertBorderLeft),
            iconColor: () => String(mergedStyle.alertIconColor),
            textColor: () => String(mergedStyle.alertTextColor),
        },
        [AlertType.WARNING]: {
            background: () => String(mergedStyle.warningBackgroundColor),
            borderLeft: () => String(mergedStyle.warningBorderLeft),
            iconColor: () => String(mergedStyle.warningIconColor),
            textColor: () => String(mergedStyle.warningTextColor),
        },
        [AlertType.INFO]: {
            background: () => String(mergedStyle.infoBackgroundColor),
            borderLeft: () => String(mergedStyle.infoBorderLeft),
            iconColor: () => String(mergedStyle.infoIconColor),
            textColor: () => String(mergedStyle.infoTextColor),
        },
        [AlertType.NEUTRAL]: {
            background: () => String(mergedStyle.neutralBackgroundColor),
            borderLeft: () => String(mergedStyle.neutralBorderLeft),
            iconColor: () => String(mergedStyle.neutralIconColor),
            textColor: () => String(mergedStyle.neutralTextColor),
        },
    };
    // Variables
    let message: string = "";
    let backgroundColor: string;
    let borderLeft: string;
    let iconColor: string;
    let textColor: string;

    // Reactive Statements
    $: {
        message = alertText;
        if (alertVariables) {
            Object.entries(alertVariables).forEach(([key, value]) => {
                message = message.replace(`{${key}}`, String(value));
            });
        }
    }
    $: {
        const typeColors = colorMap[alertType] ?? colorMap[AlertType.ALERT];
        backgroundColor = typeColors.background();
        borderLeft = typeColors.borderLeft();
        iconColor = typeColors.iconColor();
        textColor = typeColors.textColor();
    }
</script>

<!--
    FormAlert Component
    
    A reusable alert component for displaying form validation messages and notifications.
    Supports multiple alert types (alert, warning, info, neutral) with customizable styling.
    Features icon + text layout with proper text wrapping and responsive design.
-->
<div
    style="
        --width: {mergedStyle.width};
        --heigth: {mergedStyle.height};
        --padding: {mergedStyle.padding};
        --text-padding: {mergedStyle.textPadding};
        --border-radius-right: {mergedStyle.borderRadiusRight};
        --icon-size: {mergedStyle.iconSize};
        --background-color: {backgroundColor};
        --left-border: {borderLeft};
        --icon-color: {iconColor};
        --text-color: {textColor};
        --text-left-padding: {textLeftPadding};
    "
    class="alert-div"
    in:fade={{ duration: 300 }}
>
    <svg
        class="alert-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
        role="img"
        aria-label="Error"
    >
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
        <line x1="12" y1="8" x2="12" y2="13" />
        <circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
    </svg>

    <span class="alert-text">{message}</span>
</div>

<style>
    /* Main alert container - block layout with background and left border accent */
    .alert-div {
        width: var(--width);
        height: var(--height);
        display: block;
        position: relative;
        background-color: var(--background-color);
        border-left: var(--left-border);
        border-top-right-radius: var(--border-radius-right);
        border-bottom-right-radius: var(--border-radius-right);
        padding: var(--padding);
    }

    /* Alert icon - floated left with proper sizing and color */
    .alert-div .alert-icon {
        width: var(--icon-size);
        height: var(--icon-size);
        image-rendering: crisp-edges;
        float: left;
        stroke: var(--icon-color);
        margin-right: 5px;
    }

    /* Alert text - block display with proper text wrapping and indentation */
    .alert-div .alert-text {
        display: block;
        line-height: var(--icon-size);
        font-size: var(--text-size);
        color: var(--text-color);
        font-weight: var(--text-weight);
        padding-left: var(--text-left-padding);
        word-wrap: break-word;
    }
</style>
