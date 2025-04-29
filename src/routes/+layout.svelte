<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { autoLogin } from "../ts/login";

    let splashDone: boolean = false;
    let shouldRedirect: boolean = false;
    let authFinished: boolean = false;
    let redirectTarget: string | undefined = undefined;

    async function checkAuthentication() {
        const path = window.location.pathname;
        const { status } = await autoLogin("/api/auto_login", "POST");

        if (status === 200) {
            // Authenticated
            if (path === "/" || path === "/login") {
                shouldRedirect = true;
                redirectTarget = "/dashboard";
            }
        } else {
            // Unauthenticated or failed
            if (path !== "/login") {
                shouldRedirect = true;
                redirectTarget = "/login";
            }
        }
    }

    onMount(async () => {
        // Always wait at least this amount after redirect/navigation
        const MIN_SPLASH_DURATION = 300;

        await checkAuthentication();

        if (shouldRedirect && redirectTarget) {
            await goto(redirectTarget);
        }

        await new Promise((res) => setTimeout(res, MIN_SPLASH_DURATION));

        splashDone = true;
    });
</script>

{#if !splashDone}
    <!-- Splash screen -->
    <div class="container">
        <div class="loader-wrapper">
            <div class="spinner"></div>
            <div class="image-div"></div>
        </div>
        <footer class="footer">
            <span class="brand fade-in">ENERVIGIL</span>
            <span class="product fade-in">EDGE</span>
        </footer>
    </div>
{:else}
    <slot />
{/if}

<style>
    /* Fullscreen container for the splash screen */
    .container {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100vh;
        min-width: 320px;
        min-height: 760px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #181d23;
    }

    /* Wrapper to center spinner + logo */
    .loader-wrapper {
        position: relative;
        width: 280px;
        height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Circular loading animation ring */
    .spinner {
        position: absolute;
        width: 280px;
        height: 280px;
        border: 6px solid transparent;
        border-top: 6px solid #00c78b;
        border-radius: 50%;
        animation: spin 1.2s linear infinite;
        z-index: 0;
        box-shadow: 0px 0px 15px rgba(0, 199, 139, 0.2);
    }

    /* Circular logo background in center */
    .image-div {
        padding: 0;
        margin: 0;
        width: 256px;
        height: 256px;
        background-color: #202731;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url("./img/logo.png");
        box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.2);
        background-size: auto;
    }

    /* Footer container for brand name */
    .footer {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
    }

    /* Base style for both ENERVIGIL and EDGE text */
    span {
        font-family: "Montserrat", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 32px;
        text-align: center;
        font-weight: 500;
    }

    /* Fade-in animation for brand and product text */
    span.fade-in {
        opacity: 0;
        transform: translateY(10px);
        animation: fadeIn 1s ease-out forwards;
        animation-delay: 0.5s;
    }

    /* Gradient brand styling for "ENERVIGIL" */
    span.brand {
        background: linear-gradient(90deg, #4caf50, #2196f3);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Lighter color for "EDGE" product label */
    span.product {
        padding-left: 10px;
        color: #aaa;
    }

    /* Spinner keyframe animation (continuous rotation) */
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Text entrance animation (fade + slide up) */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Desktop-specific overrides */
    @media (max-width: 415px) {
        .loader-wrapper {
            width: 200px;
            height: 200px;
        }

        .spinner {
            width: 200px;
            height: 200px;
            border-width: 5px;
        }

        .image-div {
            width: 180px;
            height: 180px;
            background-size: 50%;
        }

        .footer span {
            font-size: 24px; /* reduce brand text size too */
        }
    }
</style>
