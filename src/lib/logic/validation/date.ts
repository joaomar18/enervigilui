import { getDaysInMonth } from "../util/date";
import { texts } from "$lib/stores/lang/generalTexts";


/**
 * Validates if date components contain valid values within acceptable ranges.
 * @param date - Object with year, month, and day (strings, numbers, or null)
 * @returns True if all non-null components are valid, false otherwise
 */
export function validDate(date: { year: string | number | null, month: string | number | null, day: string | number | null }): boolean {
    if (date.year !== null) {
        if (date.year === "") return false;
        if (Number(date.year) < 0 || Number(date.year) > 9999) return false;
    }
    if (date.month !== null) {
        if (date.month === "") return false;
        if (Number(date.month) < 1 || Number(date.month) > 12) return false;
    }
    if (date.day !== null && date.year !== null && date.month !== null) {
        if (date.day === "") return false;
        if (Number(date.day) < 1 || Number(date.day) > getDaysInMonth(Number(date.year), Number(date.month))) return false;
    }
    return true;
}


/**
 * Validates if time components contain valid values within 24-hour format ranges.
 * @param time - Object with hour, minute, and second (strings, numbers, or null)
 * @returns True if all non-null components are valid, false otherwise
 */
export function validTime(time: { hour: string | number | null, minute: string | number | null, second: string | number | null }): boolean {
    if (time.hour !== null) {
        if (time.hour === "") return false;
        if (Number(time.hour) < 0 || Number(time.hour) > 23) return false;
    }
    if (time.minute !== null) {
        if (time.minute === "") return false;
        if (Number(time.minute) < 0 || Number(time.minute) > 59) return false;
    }
    if (time.second !== null) {
        if (time.second === "") return false;
        if (Number(time.second) < 0 || Number(time.second) > 59) return false;
    }
    return true;
}

//export function validTimeSpan(): {valid: boolean, validRange: boolean, messageKey: string | null}