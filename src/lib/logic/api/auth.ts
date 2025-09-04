import { callAPI } from "$lib/logic/api/api";
import { navigateTo } from "../view/navigation";
import { validateUsername, validatePassword } from "../validation/auth";

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
        loginPage: true,
    });
    if (sucess) {
        await navigateTo("/devices", {}, true); // Navigate to the dashboard on success
    }
}

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

export async function logoutUser() {
    const { sucess, data } = await callAPI({
        endpoint: "/api/auth/logout",
        method: "POST",
    });
    if (sucess) {
        await navigateTo("/login", {}, true);
    }
}
