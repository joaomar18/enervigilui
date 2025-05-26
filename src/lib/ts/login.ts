import { makeAPIRequest } from "./api";
import type { Language, TextsObject } from "../stores/lang";

/**
 * Authenticates a user by sending their credentials to the server's login endpoint.
 *
 * @param username - The user's username or email for authentication.
 * @param password - The user's password for authentication.
 * @param autoLogin - Whether to enable automatic login for future sessions.
 *   If `true`, the server will return credentials that can be used for auto-login.
 * @param timeout - The maximum time in milliseconds to wait for a server response
 *   before aborting the request. Defaults to 3000ms (3 seconds).
 * @returns A promise that resolves to an object containing:
 *   - `status`: HTTP status code from the server response, or -1 if the request failed/timed out
 *   - `data`: The data returned by the server, or null if the request failed
 *
 * @example
 * // Standard login
 * const { status, data } = await loginUser("admin", "password123", false);
 *
 * // Login with auto-login enabled and custom timeout
 * const { status, data } = await loginUser("admin", "password123", true, 5000);
 */
export async function loginUser(
    username: string,
    password: string,
    autoLogin: boolean,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    return makeAPIRequest(
        "/api/login",
        "POST",
        {
            username,
            password,
            auto_login: autoLogin,
        },
        timeout
    );
}

/**
 * Attempts to automatically log in a user using stored credentials or session data
 * by sending a POST request to the server's auto-login endpoint.
 *
 * @param timeout - The maximum time in milliseconds to wait for a server response
 *   before aborting the request. Defaults to 3000ms (3 seconds).
 * @returns A promise that resolves to an object containing:
 *   - `status`: HTTP status code from the server response, or -1 if the request failed/timed out
 *   - `data`: The data returned by the server, or null if the request failed
 *
 * @example
 * // Standard auto-login attempt
 * const { status, data } = await autoLogin();
 *
 * // Auto-login with extended timeout
 * const { status, data } = await autoLogin(5000); // 5 second timeout
 */
export async function autoLogin(timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/auto_login", "POST", {}, timeout);
}

/**
 * Logs out the current user by sending a POST request to the server's logout endpoint.
 *
 * @param timeout - The maximum time in milliseconds to wait for a server response
 *   before aborting the request. Defaults to 3000ms (3 seconds).
 * @returns A promise that resolves to an object containing:
 *   - `status`: HTTP status code from the server response, or -1 if the request failed/timed out
 *   - `data`: The data returned by the server, or null if the request failed
 *
 * @example
 * // Standard logout
 * const { status, data } = await logoutUser();
 *
 * // Logout with custom timeout
 * const { status, data } = await logoutUser(5000); // 5 second timeout
 */
export async function logoutUser(timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/logout", "POST", {}, timeout);
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
