import { makeAPIRequest } from "$lib/ts/api/api";

/**
 * Sends login credentials to the server.
 * @param username - Username or email.
 * @param password - User password.
 * @param autoLogin - Enable auto-login for future sessions.
 * @param timeout - Request timeout in ms (default: 3000).
 * @returns Promise with server status and data.
 */
export async function loginUser(username: string, password: string, autoLogin: boolean, timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest(
        "/api/auth/login",
        "POST",
        {
            username,
            password,
            auto_login: autoLogin,
        },
        timeout
    );
}

/**
 * Attempts auto-login using stored credentials.
 * @param timeout - Request timeout in ms (default: 3000).
 * @returns Promise with server status and data.
 */
export async function autoLogin(timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/auth/auto_login", "POST", {}, timeout);
}

/**
 * Logs out the current user.
 * @param timeout - Request timeout in ms (default: 3000).
 * @returns Promise with server status and data.
 */
export async function logoutUser(timeout: number = 3000): Promise<{ status: number; data: any }> {
    return makeAPIRequest("/api/auth/logout", "POST", {}, timeout);
}
