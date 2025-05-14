import { writable, type Writable } from "svelte/store";
import type { Language } from "./lang";

// your alert state
export const displayAlert = writable(false);
export const alertText = writable<Record<Language, string>>({ EN: "", PT: "" });

export const alertTimeout: Writable<ReturnType<typeof setTimeout> | null> = writable(null);

/**
 * Displays a transient alert message in the UI, using Svelte stores to manage state.
 *
 * Clears any existing alert timeout, sets the provided localized text, shows the alert,
 * and automatically hides it after 3 seconds.
 *
 * @param textLang - A record mapping each supported `Language` code (`"EN"`, `"PT"`, etc.)
 *                   to the alert message to display.
 *
 * @example
 * // Show an English alert
 * showAlert({ EN: "Operation successful!", PT: "Operação bem-sucedida!" });
 */
export function showAlert(textLang: Record<Language, string>) {
    alertTimeout.update((old) => {
        if (old) clearTimeout(old);
        return null;
    });
    alertText.set(textLang);
    displayAlert.set(true);
    const id = setTimeout(() => displayAlert.set(false), 3000);
    alertTimeout.set(id);
}
