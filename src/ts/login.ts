import type { Language, TextsObject } from "../stores/lang";

export async function loginUser(
    url: string,
    method: string,
    username: string,
    password: string,
    autoLogin: boolean,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const signal = controller.signal;

    // Automatically abort the request after `timeout` milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            method: method,
            credentials: "include", // Cookies (including HTTP-only cookies)
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
                auto_login: autoLogin,
            }),
            signal,
        });

        clearTimeout(timeoutId); // cancel timeout if response arrives in time
        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        return {
            status: -1,
            data: null,
        };
    }
}

export async function autoLogin(
    url: string,
    method: string,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const signal = controller.signal;

    // Automatically abort the request after `timeout` milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            method: method,
            credentials: "include", // Cookies (including HTTP-only cookies) are automatically sent by the browser
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        });

        clearTimeout(timeoutId); // cancel timeout if response arrives in time
        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        return {
            status: -1,
            data: null,
        };
    }
}

export async function logoutUser(
    url: string,
    method: string,
    timeout: number = 3000
): Promise<{ status: number; data: any }> {
    const controller = new AbortController();
    const signal = controller.signal;

    // Automatically abort the request after `timeout` milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            signal,
        });

        clearTimeout(timeoutId);
        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (error) {
        return {
            status: -1,
            data: null,
        };
    }
}

export function interpretLoginStatus(
    status: number,
    data: { remaining?: number; unlocked?: string },
    texts: TextsObject
): (lang: Language) => string {
    return (lang: Language) => {
        switch (status) {
            case -1:
                return `${texts.timeout[lang]}`;
            case 401:
                return `${texts.wrongCredentials[lang]} ${data.remaining}`;
            case 429:
                const date = new Date(data.unlocked ?? "");
                const localTime = date.toLocaleTimeString(lang === "PT" ? "pt-PT" : "en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                return `${texts.tooManyAttempts01[lang]} ${localTime} ${texts.tooManyAttempts02[lang]}`;
            default:
                return `${texts.unknownError[lang]}`;
        }
    };
}

export function validateUsername(username: string) {
    if (typeof username !== "string") return false;
    const trimmed = username.replace(/\s/g, "");
    return trimmed.length >= 3;
}

export function validatePassword(password: string) {
    if (typeof password !== "string") return false;
    const trimmed = password.replace(/\s/g, "");
    return trimmed.length >= 5;
}
