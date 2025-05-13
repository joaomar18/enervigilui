import { writable, type Writable } from "svelte/store";
import type { Language } from "../stores/lang";

// your alert state
export const displayAlert = writable(false);
export const alertText = writable<Record<Language, string>>({ EN: "", PT: "" });

export const alertTimeout: Writable<ReturnType<typeof setTimeout> | null> = writable(null);

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
