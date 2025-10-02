import { get } from "svelte/store";
import { selectedLang } from "$lib/stores/lang/definition";

/**
 * Difference in milliseconds between two Date objects (b - a).
 */
export function diffMs(a: Date, b: Date): number {
    return b.getTime() - a.getTime();
}

/**
 * Returns a new Date offset from the given date by specified components.
 * Note: JavaScript Date normalizes overflow (e.g., month 13 → next year January).
 */
export function addToDate(date: Date, years: number = 0, months: number = 0, days: number = 0, hours: number = 0, minutes: number = 0): Date {
    const newDate = new Date(Date.UTC(date.getUTCFullYear() + years,
        date.getUTCMonth() + months,
        date.getUTCDate() + days,
        date.getUTCHours() + hours,
        date.getUTCMinutes() + minutes,
        date.getUTCSeconds(),
        date.getUTCMilliseconds()));
    return newDate;
}

/**
 * Duration of the next minute interval starting from the given date in ms.
 */
export function minDurationMs(dateMs: number): number {
    let date = new Date(dateMs);
    const next = addToDate(date, 0, 0, 0, 0, 1);
    return diffMs(date, next);
}

/**
 * Duration of the next 15-minute interval starting from the given date in ms.
 */
export function min15DurationMs(dateMs: number): number {
    let date = new Date(dateMs);
    const next = addToDate(date, 0, 0, 0, 0, 15);
    return diffMs(date, next);
}

/**
 * Duration of the next hour from the provided date in ms.
 */
export function hourDurationMs(dateMs: number): number {
    let date = new Date(dateMs);
    const next = addToDate(date, 0, 0, 0, 1);
    return diffMs(date, next);
}

/**
 * Calendar-aware duration of the next day in ms.
 */
export function dayDurationMs(dateMs: number): number {
    let date = new Date(dateMs);
    const next = addToDate(date, 0, 0, 1);
    return diffMs(date, next);
}

/**
 * Calendar month duration from the given date in ms.
 */
export function monthDurationMs(dateMs: number): number {
    let date = new Date(dateMs);
    const next = addToDate(date, 0, 1);
    return diffMs(date, next);
}

/**
 * Calendar year duration from the given date in ms.
 */
export function yearDurationMs(dateMs: number): number {
    let date = new Date(dateMs);
    const next = addToDate(date, 1);
    return diffMs(date, next);
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