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
 * Deeply compares two values for structural equality.
 * 
 * @param a - First value to compare.
 * @param b - Second value to compare.
 * @returns `true` if both values have identical structure and content, `false` otherwise.
 */
export function isEqual(a: Object, b: Object) {
    if (a === b) return true;

    if (typeof a !== "object" || typeof b !== "object" || a == null || b == null) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        const valA = (a as Record<string, any>)[key];
        const valB = (b as Record<string, any>)[key];
        if (!keysB.includes(key)) return false;
        if (!isEqual(valA, valB)) return false;
    }

    return true;
}
