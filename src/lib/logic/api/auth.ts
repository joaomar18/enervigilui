import { APICaller } from "$lib/logic/api/api";
import { navigateTo } from "../view/navigation";
import { validateUsername, validatePassword } from "../validation/auth";
import { userAuthenticated } from "$lib/stores/view/navigation";
import type { APIDescriptor } from "$lib/logic/api/api";

/**
 * Authenticates user with username and password credentials.
 * Validates inputs, sends login request, and navigates to dashboard on success.
 *
 * @param username - User's username for authentication.
 * @param password - User's password for authentication.
 * @param autoLogin - Whether to enable automatic login for future sessions.
 */
export function loginUserAPI(username: string, password: string, autoLogin: boolean): APIDescriptor<void> {
    return {
        async call({ signal, timeout } = {}) {
            const validInputs: boolean = validateUsername(username) && validatePassword(password);
            if (!validInputs) return;
            const { sucess, data } = await APICaller.callAPI({
                endpoint: "/api/auth/login",
                method: "POST",
                params: {
                    username,
                    password,
                    auto_login: autoLogin,
                },
                signal,
                timeout,
            });
            userAuthenticated.set(sucess);
            if (sucess) {
                await navigateTo("/devices", {}, true, true); // Navigate to the dashboard on success
            }

        }
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
export function autoLoginAPI(): APIDescriptor<{ sucess: boolean }> {
    return {
        async call({ signal, timeout } = {}) {
            const { sucess } = await APICaller.callAPI({
                endpoint: "/api/auth/auto_login",
                method: "POST",
                signal,
                timeout
            });
            userAuthenticated.set(sucess);
            return { sucess };
        }
    };
}

/**
 * Logs out the current user and redirects to login page.
 * Sends logout request to server and navigates to login on success.
 */
export function logoutUserAPI(): APIDescriptor<void> {
    return {
        async call({ signal, timeout } = {}) {
            const { sucess, data } = await APICaller.callAPI({
                endpoint: "/api/auth/logout",
                method: "POST",
                signal,
                timeout,
            });
            if (sucess) {
                userAuthenticated.set(false);
                await navigateTo("/login", {}, true, true);
            }
        }
    }
}
