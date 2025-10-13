import { get } from "svelte/store";
import { selectedLang } from "$lib/stores/lang/definition";
import type { DateTimeField } from "$lib/types/date";


/**
 * Creates a new DateTimeField object with zero-padded string values from a Date object or empty strings.
 * @param date - Optional Date object to populate the fields from. If null, all fields are empty strings.
 * @returns A DateTimeField with zero-padded strings: year (4 digits), month/day/hour/minute (2 digits each), or empty strings if date is null.
 */
export function createDateTimeField(date: Date | null = null): DateTimeField {
    return {
        year: date ? String(date.getFullYear()).padStart(4, "0") : "",
        month: date ? String(date.getMonth()).padStart(2, "0") : "",
        day: date ? String(date.getDate()).padStart(2, "0") : "",
        hour: date ? String(date.getHours()).padStart(2, "0") : "",
        minute: date ? String(date.getMinutes()).padStart(2, "0") : "",
    } as DateTimeField;
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

/**
 * Converts a Date object to an ISO string representation with local timezone offset.
 *
 * Unlike the native Date.toISOString() which always returns UTC time (ending with 'Z'),
 * this function returns the date in the local timezone with the appropriate offset
 * (e.g., '+01:00', '-05:00').
 *
 * @param date - The Date object to convert
 * @returns ISO string with local timezone offset (e.g., "2025-10-08T14:30:00.000+01:00")
 * @throws TypeError if the input is not a Date object
 */
export function toISOStringLocal(date: Date): string {
    if (!(date instanceof Date)) throw new TypeError("Expected a Date object");

    const pad = (n: number, z: number = 2) => ("00" + n).slice(-z);
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);

    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()) +
        "T" +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes()) +
        ":" +
        pad(date.getSeconds()) +
        "." +
        pad(date.getMilliseconds(), 3) +
        sign +
        offsetHours +
        ":" +
        offsetMinutes
    );
}
