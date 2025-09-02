/**
 * Validates username: string with at least 3 non-whitespace chars.
 * @param username - Username to validate.
 * @returns True if valid, else false.
 */
export function validateUsername(username: string) {
    if (typeof username !== "string") return false;
    const trimmed = username.replace(/\s/g, "");
    return trimmed.length >= 3;
}

/**
 * Validates password: string with at least 5 non-whitespace chars.
 * @param password - Password to validate.
 * @returns True if valid, else false.
 */
export function validatePassword(password: string) {
    if (typeof password !== "string") return false;
    const trimmed = password.replace(/\s/g, "");
    return trimmed.length >= 5;
}
