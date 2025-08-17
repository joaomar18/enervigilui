<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount, onDestroy } from "svelte";
    import { selectedLang, texts } from "$lib/stores/lang";
    import type { Language } from "$lib/stores/lang";
    import { loginUser } from "$lib/ts/api/auth";
    import { interpretLoginStatus, validateUsername, validatePassword } from "$lib/ts/validation/auth";
    import { navigateTo } from "$lib/ts/view/navigation";

    import LoginField from "./LoginField.svelte";
    import LoginButton from "./LoginButton.svelte";
    import ForgotPassButton from "./ForgotPassButton.svelte";
    import Checkbox from "../General/Checkbox.svelte";
    import Alert from "../General/Alert.svelte";

    // Styles
    import { mergeStyle } from "$lib/style/components";
    import { LoginFormStyle } from "$lib/style/login";

    // Style object (from theme)
    export let style: { [property: string]: string | number } | null = null;
    $: effectiveStyle = style ?? $LoginFormStyle;

    // Layout / styling props
    export let backgroundColor: string | undefined = undefined;
    export let titleColor: string | undefined = undefined;
    export let textColor: string | undefined = undefined;
    export let titleWeight: string | undefined = undefined;
    export let textWeight: string | undefined = undefined;

    $: localOverrides = {
        backgroundColor,
        titleColor,
        textColor,
        titleWeight,
        textWeight,
    };

    // Merged style
    $: mergedStyle = mergeStyle(effectiveStyle, localOverrides);

    // Form State
    let username: string = "";
    let password: string = "";
    let autoLogin: boolean = false;

    // Login Flow Control
    let loginAttempt: boolean = false;
    let loginProcessing: boolean = false;

    // Validation Flags
    $: usernameIncorrect = !validateUsername(username) && loginAttempt;
    $: passwordIncorrect = !validatePassword(password) && loginAttempt;

    $: usernameErrorText = usernameIncorrect ? $texts.userInvalid[$selectedLang] : "";
    $: passwordErrorText = passwordIncorrect ? $texts.passwordInvalid[$selectedLang] : "";

    // Alert State
    let displayAlert: boolean = false;
    let alertText: (lang: Language) => string = () => "";
    let alertTopPos: number = -10;
    let alertTimeout: number | undefined = undefined;

    // Function to create alert / delete old alerts
    function showAlert(generatetextFunction: (lang: Language) => string): void {
        if (alertTimeout) {
            clearTimeout(alertTimeout);
        }
        alertText = generatetextFunction;
        displayAlert = true;
        alertTimeout = setTimeout(() => (displayAlert = false), 3000);
    }

    // Login Logic
    async function login(): Promise<void> {
        loginAttempt = true;

        const validInputs: boolean = validateUsername(username) && validatePassword(password);
        if (!validInputs) return;

        loginProcessing = true;

        try {
            // Send login request
            const { status, data }: { status: number; data: any } = await loginUser(
                username, // Username
                password, // Password
                autoLogin, // Auto-login flag
            );

            // Handle success or failure
            if (status === 200) {
                await navigateTo("/devices", $selectedLang, {}, true); // Navigate to the dashboard on success
            } else {
                showAlert(interpretLoginStatus(status, data, $texts)); // Handle error
            }
        } catch (error) {
            showAlert((lang: Language) => $texts.unexpectedError[lang]);
        } finally {
            loginProcessing = false;
        }
    }

    function forgotPassword(): void {
        // Placeholder for future implementation
    }

    // Responsive Alert Positioning
    function handleScreenResize(): void {
        if (browser && window.innerHeight >= 760) {
            const offset = -10 - 0.3 * (window.innerHeight - 760);
            alertTopPos = Math.max(offset, -60);
        } else {
            alertTopPos = -10;
        }
    }

    // Setup / teardown listeners
    onMount(() => {
        if (browser) {
            window.addEventListener("resize", handleScreenResize);
            handleScreenResize();
        }
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("resize", handleScreenResize);
        }
    });
</script>

<!-- 
  LoginModal: Main login form component with username and password fields,
  error handling, persistent session checkbox, and action buttons.
-->
<div
    class="login-modal"
    style="
        --background-color: {mergedStyle.backgroundColor};
        --title-color: {mergedStyle.titleColor};
        --text-color: {mergedStyle.textColor};
        --title-weight: {mergedStyle.titleWeight};
        --text-weight: {mergedStyle.textWeight};
    "
>
    {#if displayAlert}
        <Alert
            topPos={`${alertTopPos}px`}
            pushTop={true}
            alertText={alertText($selectedLang)}
            onClick={() => {
                clearTimeout(alertTimeout);
                alertTimeout = undefined;
                displayAlert = false;
            }}
        />
    {/if}
    <h3>{$texts.title[$selectedLang]}</h3>
    <LoginField
        id="username"
        paddingTop="10px"
        imageUrl="/img/user.png"
        fieldText={$texts.username[$selectedLang]}
        type="text"
        bind:value={username}
        incorrect={usernameIncorrect}
        incorrectText={usernameErrorText}
        hintText={$texts.userInfo[$selectedLang]}
    />
    <LoginField
        id="password"
        paddingTop="30px"
        imageUrl="/img/password.png"
        fieldText={$texts.password[$selectedLang]}
        type="password"
        bind:value={password}
        incorrect={passwordIncorrect}
        incorrectText={passwordErrorText}
        hintText={$texts.passwordInfo[$selectedLang]}
    />
    <div class="checkbox-div">
        <Checkbox bind:checked={autoLogin} inputName="auto-login" enabledBackgroundColor="#4caf7f" marginRight="10px" />
        <span class="keep-logged-in-text">{$texts.keepSessionLogged[$selectedLang]}</span>
    </div>
    <LoginButton processing={loginProcessing} paddingTop="30px" onClick={login} />
    <ForgotPassButton onClick={forgotPassword} />
</div>

<style>
    /* Main container for the login modal */
    .login-modal {
        position: relative;
        box-sizing: content-box;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 500px;
        background-color: var(--background-color);
        min-width: 260px;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        margin-left: 0%;
        z-index: 1;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    }

    /* Login title */
    h3 {
        margin: 0;
        padding: 0;
        padding-top: 30px;
        padding-bottom: 30px;
        color: var(--title-color);
        font-weight: var(--title-weight);
        font-size: 1.5rem;
    }

    /* Wrapper for the "Keep me logged in" checkbox and label */
    .checkbox-div {
        width: 90%;
        margin: 0;
        padding-top: 30px;
        padding-bottom: 0px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    /* Label text for the checkbox */
    .keep-logged-in-text {
        font-size: 1.25rem;
        font-weight: var(--text-weight);
        color: var(--text-color);
    }

    /* Responsive layout for tablets */
    @media (min-width: 520px) {
        .login-modal {
            width: 90%;
            max-width: 32.5rem;
            border-radius: 20px;
        }
        .checkbox-div {
            width: 100%;
            padding-left: 50px;
            padding-right: 50px;
        }
    }

    /* Full-width modal on large screens */
    @media (min-width: 1024px) {
        .login-modal {
            width: 32.5rem;
        }
    }
</style>
