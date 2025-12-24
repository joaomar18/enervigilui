import { callAPI } from "$lib/logic/api/api";
import { navigateTo } from "../view/navigation";
import { validateUsername, validatePassword } from "../validation/auth";
import { userAuthenticated } from "$lib/stores/view/navigation";

/**
 * Authenticates user with username and password credentials.
 * Validates inputs, sends login request, and navigates to dashboard on success.
 *
 * @param username - User's username for authentication.
 * @param password - User's password for authentication.
 * @param autoLogin - Whether to enable automatic login for future sessions.
 */
export async function loginUser(username: string, password: string, autoLogin: boolean) {
    const validInputs: boolean = validateUsername(username) && validatePassword(password);
    if (!validInputs) return;
    const { sucess, data } = await callAPI({
        endpoint: "/api/auth/login",
        method: "POST",
        params: {
            username,
            password,
            auto_login: autoLogin,
        },
    });
    userAuthenticated.set(sucess);
    if (sucess) {
        await navigateTo("/devices", {}, true, true); // Navigate to the dashboard on success
    }
}

/**
 * Attempts to refresh or validate the current authentication session with the backend.
 *
 * This function does NOT make routing or authorization decisions.
 * It only reports whether a valid authenticated session exists after contacting the server.
 *
 * Intended for client-side UX initialization (e.g. auto-login checks, UI state),
 * while final access control and redirects remain enforced by server-side guards.
 *
 * @returns Object indicating whether the session is authenticated.
 */
export async function autoLogin(): Promise<{ sucess: boolean }> {
    const { sucess, data } = await callAPI({
        endpoint: "/api/auth/auto_login",
        method: "POST",
    });
    userAuthenticated.set(sucess);
    return { sucess };
}

/**
 * Logs out the current user and redirects to login page.
 * Sends logout request to server and navigates to login on success.
 */
export async function logoutUser() {
    const { sucess, data } = await callAPI({
        endpoint: "/api/auth/logout",
        method: "POST",
    });
    if (sucess) {
        userAuthenticated.set(false);
        await navigateTo("/login", {}, true, true);
    }
}
