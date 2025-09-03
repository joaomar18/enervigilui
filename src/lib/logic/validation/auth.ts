import { autoLogin } from "../api/auth";

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

/**
 * Checks if auto-login is possible based on current URL path.
 * @returns Promise with redirect status and target URL.
 */
export async function checkAutoLogin(): Promise<{ shouldRedirect: boolean; redirectTarget: string }> {
    const path = window.location.pathname;
    const segments = path.split("/").filter(Boolean);
    const base = segments.length > 0 ? `/${segments[0]}` : "/";
    const isSubpage = segments.length > 1;

    return await autoLogin(base, isSubpage);
}
