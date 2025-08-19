import { get } from "svelte/store";
import { selectedLang } from "$lib/stores/lang/definition";
import { ToastType } from "$lib/stores/view/toast";
import { showToast } from "../view/toast";

/**
 * Shows alert toast for given status and language.
 * @param status Status code.
 * @param data Optional info.
 */
export function interpretLoginStatus(status: number, data: { remaining?: number; unlocked?: string }): void {
    switch (status) {
        case -1:
            showToast("timeout", ToastType.ALERT);
            break;
        case 401:
            showToast("wrongCredentials", ToastType.ALERT, { remaining: String(data.remaining) });
            break;
        case 429:
            const date = new Date(data.unlocked ?? "");
            const localTime = date.toLocaleTimeString(get(selectedLang) === "PT" ? "pt-PT" : "en-US", {
                hour: "2-digit",
                minute: "2-digit",
            });
            showToast("tooManyAttempts", ToastType.ALERT, { localTime: localTime });
            break;
        default:
            showToast("unknownError", ToastType.ALERT);
            break;
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
