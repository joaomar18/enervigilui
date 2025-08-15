<script lang="ts">
    // Stores for multi-language support
    import { selectedLang, texts } from "$lib/stores/lang";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { ForgotPassButtonStyle } from "$lib/style/login";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $ForgotPassButtonStyle;

    // Layout / styling props
    export let paddingTop: string | undefined = undefined;
    export let paddingBottom: string | undefined = undefined;
    export let textColor: string | undefined = undefined;
    export let hoverTextColor: string | undefined = undefined;

    $: localOverrides = {
        paddingTop,
        paddingBottom,
        textColor,
        hoverTextColor,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Click Export Funcion
    export let onClick: () => void;

    // Functions
    function handleClick(): void {
        if (onClick) {
            onClick();
        }
    }
</script>

<!-- 
  ForgotPassword: Displays a clickable "Forgot password?" text.
-->
<div
    class="forgot-password-div"
    style="
        --padding-top:{mergedStyle.paddingTop};
        --padding-bottom:{mergedStyle.paddingBottom};
    "
>
    <span
        class="forgot-password-text"
        style="
        --text-color: {mergedStyle.textColor};
        --hover-text-color: {mergedStyle.hoverTextColor};
    ">{$texts.forgotPassword[$selectedLang]}</span
    >
    <button on:click={handleClick} aria-label="Button"></button>
</div>

<style>
    /* Wrapper with configurable vertical spacing and relative positioning for absolute button */
    .forgot-password-div {
        position: relative;
        padding-top: var(--padding-top, 0px);
        padding-bottom: var(--padding-bottom, 0px);
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Text color on hover */
    .forgot-password-div:hover .forgot-password-text {
        color: var(--hover-text-color);
    }

    /* Text appearance and color (default) */
    .forgot-password-text {
        font-size: 1.1rem;
        color: var(--text-color);
        text-decoration: underline;
    }

    /* Invisible full-size button for capturing clicks */
    button {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }
</style>
