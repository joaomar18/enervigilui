<script lang="ts">
    // Stores for multi-language support
    import { selectedLang, texts } from "../../../stores/lang";

    // Layout / styling props
    export let paddingTop: string = "0px";
    export let paddingBottom: string = "0px";
    export let textColor: string = ""; //normal text color
    export let hoverTextColor: string = ""; //text color when button is hovered

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
        --padding-top:{paddingTop};
        --padding-bottom:{paddingBottom};
    "
>
    <span
        class="forgot-password-text"
        style="
        --text-color: {textColor};
        --hover-text-color: {hoverTextColor};
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
    }

    /* Text color on hover */
    .forgot-password-div:hover .forgot-password-text {
        color: var(--hover-text-color, rgb(52, 151, 210));
    }

    /* Text appearance and color (default) */
    .forgot-password-text {
        font-size: 1.1rem;
        color: var(--text-color, rgb(216, 216, 216));
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
    }
</style>
