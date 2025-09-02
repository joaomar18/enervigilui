import { get } from "svelte/store";
import { callAPI } from "$lib/logic/api/api";
import { navigateTo } from "../view/navigation";
import { selectedLang } from "$lib/stores/lang/definition";
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
        await navigateTo("/devices", get(selectedLang), {}, true); // Navigate to the dashboard on success
    }
}

export async function autoLogin(basePage: string, isSubpage: boolean): Promise<{ redirect: boolean; target: string }> {
    const { sucess, data } = await callAPI({
        endpoint: "/api/auth/auto_login",
        method: "POST",
    });
    let redirect = false;
    let target = "";
    if (sucess) {
        // Authenticated
        if (basePage === "/" || basePage === "/login") {
            redirect = true;
            target = "/devices";
        }
        // User is in a subpage, redirect to main page
        else if (isSubpage) {
            redirect = true;
            target = basePage;
        }
    } else {
        // Unauthenticated or failed
        if (basePage !== "/login") {
            redirect = true;
            target = "/login";
        }
    }
    return { redirect, target };
}

export async function logoutUser() {
    const { sucess, data } = await callAPI({
        endpoint: "/api/auth/logout",
        method: "POST",
    });
    if (sucess) {
        await navigateTo("/login", get(selectedLang), {}, true);
    }
}
