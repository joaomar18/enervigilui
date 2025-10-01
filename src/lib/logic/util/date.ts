import { get } from "svelte/store";
import { selectedLang } from "$lib/stores/lang/definition";

/**
 * Time duration constants (in milliseconds).
 */
export const MS_MIN = 60 * 1000;        // One minute
export const MS_15_MIN = 15 * MS_MIN;    // Fifteen minutes
export const MS_HOUR = 60 * MS_MIN;      // One hour
export const MS_DAY = 24 * MS_HOUR;      // Nominal 24-hour day

export function diffMs(a: Date, b: Date): number {
    return b.getTime() - a.getTime();
}

export function addMonths(date: Date, months: number): Date {
    const newDate = new Date(date.getTime());
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
}

export function monthDurationMs(date: Date): number {
    const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    const next = addMonths(start, 1);
    return diffMs(start, next);
}

export function yearDurationMs(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
    const next = new Date(date.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
    return diffMs(start, next);
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