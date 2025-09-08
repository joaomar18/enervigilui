import { get } from "svelte/store";
import { selectedLang } from "$lib/stores/lang/definition";
import { texts } from "$lib/stores/lang/generalTexts";

/**
 * Validates if a string represents a valid integer.
 * @param str String to validate
 * @returns True if the string is a valid integer and not empty
 */
export function stringIsValidInteger(str: string): boolean {
    const num = Number(str);
    return Number.isInteger(num) && str.trim() !== "";
}

/**
 * Validates if a string represents a valid float number.
 * @param str String to validate
 * @returns True if the string is a valid float and not empty
 */
export function stringIsValidFloat(str: string): boolean {
    const num = Number(str);
    return !isNaN(num) && str.trim() !== "";
}

/**
 * Converts a date string to a localized date string with time, based on the selected language.
 * @param date - ISO date string or null.
 * @returns Localized date string with time (e.g., "12 de setembro de 2025, 14:30") or null if input is null.
 */
export function convertDateToLocalDate(date: string | null): string | null {
    if (date === null) return null;
    let newDate = new Date(date);
    const localDate = newDate.toLocaleDateString(get(selectedLang) === "PT" ? "pt-PT" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    return localDate;
}

/**
 * Converts a date string to a localized time string based on the selected language.
 * @param date - ISO date string or null.
 * @returns Localized time string (e.g., "14:30") or null if input is null.
 */
export function convertDateToLocalTime(date: string | null): string | null {
    if (date === null) return null;
    let newDate = new Date(date);
    const localTime = newDate.toLocaleTimeString(get(selectedLang) === "PT" ? "pt-PT" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return localTime;
}