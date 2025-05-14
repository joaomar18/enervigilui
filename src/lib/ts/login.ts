import type { Language, TextsObject } from "../stores/lang";

/**
 * Attempts to log in a user with the provided credentials, optionally enabling auto-login, and supports request timeout.
 *
 * @param username - The user's username.
 * @param password - The user's password.
 * @param autoLogin - Whether to enable automatic login for future sessions.
 * @param timeout - Maximum time in milliseconds to wait for the server response before aborting. Defaults to 3000 ms.
 * @returns A promise that resolves to an object containing:
 *   - `status`: the HTTP status code returned by the server, or -1 if the request was aborted or failed.
 *   - `data`: the parsed JSON response from the server, or `null` if the request failed or was aborted.
 *
 * @example
 * loginUser('johndoe', 's3cr3t', true, 5000)
 *   .then(({ status, data }) => {
 *     if (status === 200) {
 *       console.log('Login successful:', data);
 *     } else {
 *       console.error('Login failed. Status:', status);
 *     }
 *   });
 */
export async function loginUser(
    username: string,
    password: string,
    autoLogin: boolean,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const signal = controller.signal;

    // Automatically abort the request after `timeout` milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            credentials: "include", // Cookies (including HTTP-only cookies)
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
                auto_login: autoLogin,
            }),
            signal,
        });

        clearTimeout(timeoutId); // cancel timeout if response arrives in time
        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        return {
            status: -1,
            data: null,
        };
    }
}

/**
 * Attempts to automatically log in the user using stored cookies, with an optional timeout to abort the request.
 *
 * @param timeout - Maximum time in milliseconds to wait for the server response before aborting. Defaults to 3000 ms.
 * @returns A promise that resolves to an object containing:
 *   - `status`: the HTTP status code returned by the server, or -1 if the request was aborted or failed.
 *   - `data`: the parsed JSON response from the server, or `null` if the request failed or was aborted.
 *
 * @example
 * autoLogin(5000)
 *   .then(({ status, data }) => {
 *     if (status === 200) {
 *       console.log('Auto-login successful:', data);
 *     } else {
 *       console.warn('Auto-login failed. Status:', status);
 *     }
 *   });
 */
export async function autoLogin(timeout: number = 3000): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const signal = controller.signal;

    // Automatically abort the request after `timeout` milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch("api/auto_login", {
            method: "POST",
            credentials: "include", // Cookies (including HTTP-only cookies) are automatically sent by the browser
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        });

        clearTimeout(timeoutId); // cancel timeout if response arrives in time
        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        return {
            status: -1,
            data: null,
        };
    }
}

/**
 * Logs out the current user by sending a POST request to the server, with an optional timeout to abort.
 *
 * @param timeout - Maximum time in milliseconds to wait for the server response before aborting. Defaults to 3000 ms.
 * @returns A promise that resolves to an object containing:
 *   - `status`: the HTTP status code returned by the server, or -1 if the request was aborted or failed.
 *   - `data`: the parsed JSON response from the server, or `null` if the request failed or was aborted.
 *
 * @example
 * logoutUser(5000)
 *   .then(({ status, data }) => {
 *     if (status === 200) {
 *       console.log('Logout successful:', data);
 *     } else {
 *       console.error('Logout failed. Status:', status);
 *     }
 *   });
 */
export async function logoutUser(timeout: number = 3000): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const signal = controller.signal;

    // Automatically abort the request after `timeout` milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        });

        clearTimeout(timeoutId);
        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        return {
            status: -1,
            data: null,
        };
    }
}

/**
 * Returns a function that maps a language code to a human-readable login status message,
 * based on the provided status code and optional data.
 *
 * @param status - The HTTP-like status code:
 *   - `-1` indicates a timeout or network failure.
 *   - `401` indicates wrong credentials; uses `data.remaining` for attempts left.
 *   - `429` indicates too many attempts; uses `data.unlocked` (ISO date string) for unlock time.
 *   - any other value yields an unknown error message.
 * @param data - An object containing optional properties for certain statuses:
 *   - `remaining?: number` — number of remaining login attempts (used with status 401).
 *   - `unlocked?: string` — ISO date string when login will be unlocked (used with status 429).
 * @param texts - An object with localized message templates for each scenario. Each key is an object
 *   mapping `Language` codes (`"EN"` or `"PT"`) to the appropriate string.
 *   - `timeout`
 *   - `wrongCredentials`
 *   - `tooManyAttempts01`
 *   - `tooManyAttempts02`
 *   - `unknownError`
 *
 * @returns A function that, given a `lang` code, returns the formatted message in that language.
 *
 * @example
 * const texts = {
 *   timeout: { EN: "Request timed out.", PT: "Tempo esgotado." },
 *   wrongCredentials: { EN: "Incorrect credentials.", PT: "Credenciais incorretas." },
 *   tooManyAttempts01: { EN: "Too many attempts. Try again at", PT: "Muitas tentativas. Tente novamente às" },
 *   tooManyAttempts02: { EN: ".", PT: "." },
 *   unknownError: { EN: "Unknown error occurred.", PT: "Ocorreu um erro desconhecido." },
 * };
 *
 * const messageFn = interpretLoginStatus(429, { unlocked: "2025-05-14T15:30:00Z" }, texts);
 * console.log(messageFn("EN")); // "Too many attempts. Try again at 03:30 PM ."
 */
export function interpretLoginStatus(
    status: number,
    data: { remaining?: number; unlocked?: string },
    texts: TextsObject
): (lang: Language) => string {
    return (lang: Language) => {
        switch (status) {
            case -1:
                return `${texts.timeout[lang]}`;
            case 401:
                return `${texts.wrongCredentials[lang]} ${data.remaining}`;
            case 429:
                const date = new Date(data.unlocked ?? "");
                const localTime = date.toLocaleTimeString(lang === "PT" ? "pt-PT" : "en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                return `${texts.tooManyAttempts01[lang]} ${localTime} ${texts.tooManyAttempts02[lang]}`;
            default:
                return `${texts.unknownError[lang]}`;
        }
    };
}

/**
 * Checks whether the provided username is a valid non-empty string with at least
 * three non-whitespace characters.
 *
 * @param username - The value to validate as a username.
 * @returns `true` if `username` is a string and, after removing all whitespace, has
 * at least 3 characters; otherwise returns `false`.
 *
 * @example
 * validateUsername("joão");      // true
 * validateUsername("ab");        // false (only 2 non-whitespace chars)
 * validateUsername("   a b  ");  // false (only 2 non-whitespace chars)
 * validateUsername(12345 as any); // false (not a string)
 */
export function validateUsername(username: string) {
    if (typeof username !== "string") return false;
    const trimmed = username.replace(/\s/g, "");
    return trimmed.length >= 3;
}

/**
 * Checks whether the provided password is a valid non-empty string with at least
 * five non-whitespace characters.
 *
 * @param password - The value to validate as a password.
 * @returns `true` if `password` is a string and, after removing all whitespace, has
 * at least 5 characters; otherwise returns `false`.
 *
 * @example
 * validatePassword("p@ssw0rd");    // true
 * validatePassword(" 1234 ");      // false (only 4 non-whitespace chars)
 * validatePassword("  a b c ");    // true (5 non-whitespace chars)
 * validatePassword(null as any);   // false (not a string)
 */
export function validatePassword(password: string) {
    if (typeof password !== "string") return false;
    const trimmed = password.replace(/\s/g, "");
    return trimmed.length >= 5;
}
