import { writable, type Writable } from "svelte/store";
import type { Language } from "./lang";

// your alert state
export const displayAlert = writable(false);
export const alertText = writable<Record<Language, string>>({ EN: "", PT: "" });

export const alertTimeout: Writable<ReturnType<typeof setTimeout> | null> = writable(null);

/**
 * Displays a transient alert message in the UI with support for variable interpolation.
 *
 * @param textLang - A record mapping each supported `Language` code to the alert message.
 * @param variables - Optional object with key-value pairs to replace placeholders in messages.
 *
 * @example
 * // Show an alert with dynamic content
 * showAlert(
 *   { EN: "Connected to device: {deviceName}", PT: "Conectado ao dispositivo: {deviceName}" },
 *   { deviceName: "Energy Meter 01" }
 * );
 */
export function showAlert(
    textLang: Record<Language, string>,
    variables?: Record<string, string | number>
) {
    alertTimeout.update((old) => {
        if (old) clearTimeout(old);
        return null;
    });

    // If variables are provided, replace placeholders in each language
    if (variables) {
        const processedText: Record<Language, string> = { ...textLang };

        Object.keys(textLang).forEach((lang) => {
            let message = textLang[lang as Language];

            Object.entries(variables).forEach(([key, value]) => {
                message = message.replace(`{${key}}`, String(value));
            });

            processedText[lang as Language] = message;
        });

        alertText.set(processedText);
    } else {
        alertText.set(textLang);
    }

    displayAlert.set(true);
    const id = setTimeout(() => displayAlert.set(false), 3000);
    alertTimeout.set(id);
}
