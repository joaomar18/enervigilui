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
