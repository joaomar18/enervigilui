import { callAPI } from "$lib/logic/api/api";
import { navigateTo } from "../view/navigation";
import { validateUsername, validatePassword } from "../validation/auth";

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
    if (sucess) {
        await navigateTo("/devices", {}, true); // Navigate to the dashboard on success
    }
}

/**
 * Attempts automatic login and determines appropriate navigation target.
 * Checks if user has valid session and returns redirect information based on current page context.
 *
 * @param basePage - Current base page path (e.g., "/", "/login", "/devices").
 * @param isSubpage - Whether the current page is a subpage of the base.
 * @returns Object with redirect status and target URL for navigation.
 */
export async function autoLogin(basePage: string, isSubpage: boolean): Promise<{ shouldRedirect: boolean; redirectTarget: string }> {
    const { sucess, data } = await callAPI({
        endpoint: "/api/auth/auto_login",
        method: "POST",
    });
    let shouldRedirect = false;
    let redirectTarget = "";
    if (sucess) {
        // Authenticated
        if (basePage === "/" || basePage === "/login") {
            shouldRedirect = true;
            redirectTarget = "/devices";
        }
        // User is in a subpage, redirect to main page
        else if (isSubpage) {
            shouldRedirect = true;
            redirectTarget = basePage;
        }
    } else {
        // Unauthenticated or failed
        if (basePage !== "/login") {
            shouldRedirect = true;
            redirectTarget = "/login";
        }
    }
    return { shouldRedirect, redirectTarget };
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
        await navigateTo("/login", {}, true);
    }
}
