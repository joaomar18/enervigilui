<script lang="ts">
    import HintInfo from "../../General/HintInfo.svelte";

    // Props
    export let id;

    // Layout / styling props
    export let paddingTop: string = "0px";
    export let paddingBottom: string = "0px";
    export let imageUrl: string;
    export let imageWidth: string;
    export let imageHeight: string;
    export let fieldText: string; //Visible text of the field
    export let type: string = "text"; // Input type (default is text)
    export let value: string = "";
    export let incorrect: boolean;
    export let incorrectText: string;
    export let hintText: string;

    // Variables
    let showPassword: boolean = false;

    // Functions
    function togglePassword(): void {
        showPassword = !showPassword;
    }
</script>

<!-- 
  InputField: Reusable form field with icon, error handling, and optional show/hide password logic.
-->
<div
    class="field"
    style="
        --padding-top: {paddingTop};
        --padding-bottom: {paddingBottom};
    "
>
    <span class="field-name">{fieldText}</span>
    <div class="input-div">
        <img
            class="field-image"
            style="
                --image-width:{imageWidth}; 
                --image-height:{imageHeight};
            "
            src={imageUrl}
            alt={fieldText}
        />
        {#if type === "password"}
            {#if !showPassword}
                <input
                    type="password"
                    {id}
                    style="padding-right:50px; {incorrect ? 'border: 2px solid #D72638' : ''}"
                    bind:value
                />
            {:else}
                <input
                    type="text"
                    {id}
                    autocomplete="current-password"
                    style="padding-right:50px; {incorrect ? 'border: 2px solid #D72638' : ''}"
                    bind:value
                />
            {/if}
        {:else}
            <input
                type="text"
                {id}
                autocomplete={id}
                bind:value
                style={incorrect ? "border: 2px solid #D72638" : ""}
            />
        {/if}
        {#if type === "password"}
            <div class="show-hide-div" style="width:{imageWidth}; height:{imageHeight};">
                <div class="show-hide-content">
                    <img
                        class="show-hide-img"
                        src={showPassword ? "./img/show.png" : "./img/hide.png"}
                        alt={showPassword ? "show" : "hide"}
                        style="width:{imageWidth}; heigh:{imageHeight};"
                    />
                    <button
                        class="show-hide-btn"
                        on:click={togglePassword}
                        aria-label="Show Password"
                    ></button>
                </div>
            </div>
        {/if}
        {#if incorrect}
            <div class="warning-div">
                <HintInfo
                    labelText={incorrectText}
                    hintWidth="300px"
                    hintHeight="fit-content"
                    hintBackgroundColor="#1e242b"
                    hintBorderColor="#2c343d"
                    hintBorderRadius="10px"
                    textColor="#d72638"
                    openBackgroundColor="rgba(215, 38, 56, 0.1)"
                    openHoverBackgroundColor="rgba(215, 38, 56, 0.2)"
                    openStrokeColor="#d72638"
                    openHoverStrokeColor="#ff3e50"
                    closeBackgroundColor="rgba(255, 255, 255, 0.1)"
                    closeHoverBackgroundColor="rgba(255, 255, 255, 0.2)"
                    closeStrokeColor="white"
                    closeHoverStrokeColor="#eeeeee"
                >
                    <span class="warning-text">{hintText}</span>
                </HintInfo>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Wrapper container for the field */
    .field {
        width: 90%;
        padding-top: var(--padding-top, "0px");
        padding-bottom: var(--padding-bottom, "0px");
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        box-sizing: border-box;
    }

    /* Label text above input */
    .field-name {
        font-size: 1.25rem;
        font-weight: 300;
        color: rgb(255, 255, 255);
        width: 100%;
        padding-bottom: 10px;
    }

    /* Container for input and icons */
    .input-div {
        width: 100%;
        position: relative;
        height: fit-content;
    }

    /* Input icon on the left */
    .field-image {
        margin: 0;
        padding: 0;
        width: var(--image-width, "0px");
        height: var(--image-height, "0px");
        top: 50%;
        left: calc((50px - var(--image-width)) / 2);
        transform: translateY(-50%);
        position: absolute;
    }

    /* Password toggle (eye icon) wrapper */
    .show-hide-div {
        margin: 0;
        padding: 0;
        top: 50%;
        right: calc((50px - 32px) / 2);
        transform: translateY(-50%);
        position: absolute;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Wrapper for the show/hide toggle button */
    .show-hide-content {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        position: relative;
        -webkit-tap-highlight-color: transparent;
    }

    /* Toggle eye icon */
    .show-hide-img {
        padding: 0;
        margin: 0;
    }

    /* Transparent button for toggling password visibility */
    .show-hide-btn {
        left: 0;
        top: 0;
        margin: 0;
        padding: 0;
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }

    /* Styled input field */
    input {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 40px;
        font-size: 1.25rem;
        padding-left: 50px;
        outline: none;
        box-shadow: none;
    }

    /* Error container styling */
    .warning-div {
        position: absolute;
        width: max-content;
        top: -10px;
        right: 0px;
        transform: translateY(-100%);
    }

    /* Error container text styling */
    .warning-text {
        padding: 10px;
        padding-right: 40px;
        font-size: 1rem;
        font-weight: 300;
        line-height: 1.5;
        color: white;
    }

    /* Responsive padding and width for larger screens */
    @media (min-width: 520px) {
        .field {
            padding-left: 50px;
            padding-right: 50px;
            width: 100%;
        }
    }
</style>
