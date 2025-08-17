import type { Language, TextsObject } from "$lib/stores/lang";

/**
 * Returns a function that maps a language code to a login status message.
 * @param status - Status code (-1: timeout, 401: wrong credentials, 429: too many attempts).
 * @param data - Optional info (remaining attempts or unlock time).
 * @param texts - Localized message templates.
 * @returns Function returning the message for a given language.
 */
export function interpretLoginStatus(status: number, data: { remaining?: number; unlocked?: string }, texts: TextsObject): (lang: Language) => string {
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
 * Validates username: string with at least 3 non-whitespace chars.
 * @param username - Username to validate.
 * @returns True if valid, else false.
 */
export function validateUsername(username: string) {
    if (typeof username !== "string") return false;
    const trimmed = username.replace(/\s/g, "");
    return trimmed.length >= 3;
}

/**
 * Validates password: string with at least 5 non-whitespace chars.
 * @param password - Password to validate.
 * @returns True if valid, else false.
 */
export function validatePassword(password: string) {
    if (typeof password !== "string") return false;
    const trimmed = password.replace(/\s/g, "");
    return trimmed.length >= 5;
}
