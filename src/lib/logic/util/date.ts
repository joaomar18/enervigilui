import { get } from "svelte/store";
import { selectedLang } from "$lib/stores/lang/definition";
import type { DateTimeField } from "$lib/types/date";
import { LogSpanPeriod } from "$lib/types/view/nodes";


/**
 * Creates a new DateTimeField object with zero-padded string values from a Date object or empty strings.
 * @param date - Optional Date object to populate the fields from. If null, all fields are empty strings.
 * @returns A DateTimeField with zero-padded strings: year (4 digits), month/day/hour/minute (2 digits each), or empty strings if date is null.
 */
export function createDateTimeField(date: Date | null = null): DateTimeField {
    return {
        year: date ? String(date.getFullYear()).padStart(4, "0") : "",
        month: date ? String(date.getMonth() + 1).padStart(2, "0") : "",
        day: date ? String(date.getDate()).padStart(2, "0") : "",
        hour: date ? String(date.getHours()).padStart(2, "0") : "",
        minute: date ? String(date.getMinutes()).padStart(2, "0") : "",
    } as DateTimeField;
}


/**
 * Gets the number of days in a specific month and year (handles leap years).
 * @param year - Full year number
 * @param month - Month number (1-12)
 * @returns Number of days in the month
 */
export function getDaysInMonth(year: number, month: number): number {
    if (month < 1 || month > 12) throw new Error(`Month number is out of index: ${month}.`);
    return new Date(year, month, 0).getDate();
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

/**
 * Converts a log period enum to complete date ranges for full periods.
 * @param period - The time span period to convert
 * @returns Object with initial_date (period start) and end_date (next period start)
 */
export function getTimeSpanFromLogPeriod(period: LogSpanPeriod): { initial_date: Date; end_date: Date } {
    let initial_date = new Date();
    let end_date: Date;

    switch (period) {
        case LogSpanPeriod.currentHour:
            initial_date.setMinutes(0, 0, 0);
            end_date = new Date(initial_date);
            end_date.setHours(end_date.getHours() + 1);
            return { initial_date, end_date };

        case LogSpanPeriod.currentDay:
            initial_date.setHours(0, 0, 0, 0);
            end_date = new Date(initial_date);
            end_date.setDate(end_date.getDate() + 1);
            return { initial_date, end_date };

        case LogSpanPeriod.current7Days:
            initial_date.setHours(0, 0, 0, 0);
            while (initial_date.getDay() != 1) {
                initial_date.setDate(initial_date.getDate() - 1);
            }
            end_date = new Date(initial_date);
            end_date.setDate(end_date.getDate() + 7);
            return { initial_date, end_date };

        case LogSpanPeriod.currentMonth:
            initial_date.setHours(0, 0, 0, 0);
            initial_date.setDate(1);
            end_date = new Date(initial_date);
            end_date.setMonth(end_date.getMonth() + 1);
            return { initial_date, end_date };

        case LogSpanPeriod.currentYear:
            initial_date.setHours(0, 0, 0, 0);
            initial_date.setMonth(0, 1);
            end_date = new Date(initial_date);
            end_date.setFullYear(end_date.getFullYear() + 1);
            return { initial_date, end_date };

        default:
            throw new Error(`Invalid Log Span Period: ${period}`);
    }
}

/**
 * Converts a DateTimeField object to a JavaScript Date object.
 * @param dateTimeField - Object containing year, month, day, hour, and minute as strings
 * @returns Date object constructed from the field values (month is adjusted from 1-12 to 0-11)
 */
export function getDateFromField(dateTimeField: DateTimeField): Date {
    return new Date(Number(dateTimeField.year), Number(dateTimeField.month) - 1, Number(dateTimeField.day), Number(dateTimeField.hour), Number(dateTimeField.minute));
}

/**
 * Converts a 2-digit year to a 4-digit year by choosing the century closest to the current year.
 * @param yy - Two-digit year (0-99)
 * @returns Four-digit year in the century closest to the current date
 */
export function interpretYY(yy: string): string {

    const currentYear = new Date().getFullYear();
    const currentCentury = Math.floor(currentYear / 100) * 100;
    const yearCurrCentury = currentCentury + Number(yy);
    const yearPrevCentury = (currentCentury - 100) + Number(yy);
    const yearNextCentury = currentCentury + 100 + Number(yy);

    const candidates = [yearCurrCentury, yearPrevCentury, yearNextCentury];
    return String(candidates.reduce((closest, candidate) => {
        const diffCurrent = Math.abs(currentYear - candidate);
        const diffClosest = Math.abs(currentYear - closest);
        return diffCurrent < diffClosest ? candidate : closest;
    }));
}

/**
 * Extracts the last two digits of a year string to get the short year format.
 * @param yyyy - Full year string (e.g., "2025")
 * @returns Two-digit year string (e.g., "25")
 */
export function getShortYear(yyyy: string): string {
    return yyyy.slice(-2);
}

/**
 * Converts an ISO date string to Unix timestamp in milliseconds.
 * @param date - ISO date string to convert
 * @returns Unix timestamp in milliseconds since epoch
 */
export function convertISOToTimestamp(date: string): number {
    return new Date(date).getTime();
}