import { writable, derived } from "svelte/store";

// Type for the available languages
export type Language = "PT" | "EN";

// Type of the Texts Object
export interface TextsObject {
    [key: string]: {
        PT: string;
        EN: string;
    };
}

export const selectedLang = writable<Language>("EN"); //Current selected language: Starts with EN - English

/**
 * Creates a derived store that exposes texts in the current selected language.
 *
 * @param texts - Mapping of texts in the various available languages.
 * @returns A store with the texts for the current {@link selectedLang} value.
 */
export function createLangStore<T extends TextsObject>(texts: T) {
    return derived(selectedLang, (lang) => {
        const result: Record<string, string> = {};
        for (const key in texts) {
            result[key] = texts[key][lang];
        }
        return result;
    });
}
