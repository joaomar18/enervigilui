import type { Language } from "$lib/stores/lang/definition";

/**
 * Returns login status message for given status and language.
 * @param status Status code.
 * @param data Optional info.
 * @param texts Message templates.
 * @param lang Language.
 * @returns Status message.
 */
export function interpretLoginStatus(
    status: number,
    data: { remaining?: number; unlocked?: string },
    texts: Record<string, string>,
    lang: Language
): string {
    switch (status) {
        case -1:
            return `${texts.timeout}`;
        case 401:
            return `${texts.wrongCredentials} ${data.remaining}`;
        case 429:
            const date = new Date(data.unlocked ?? "");
            const localTime = date.toLocaleTimeString(lang === "PT" ? "pt-PT" : "en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });
            return `${texts.tooManyAttempts01} ${localTime} ${texts.tooManyAttempts02}`;
        default:
            return `${texts.unknownError}`;
    }
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
