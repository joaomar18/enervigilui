import { goto } from "$app/navigation";

// Splash screen store
import { splashDone, loadedDone } from "../stores/auth";

/**
 * Navigates the application to a new URL, appending any extra query parameters
 * and a `lang` parameter last, optionally showing a splash screen for a minimum duration.
 *
 * @param url - The base URL or route to navigate to (without query parameters).
 * @param extraParams - An object of additional key/value pairs to include in the query string.
 * @param splashScreen - Whether to display the splash screen during navigation. Defaults to `false`.
 * @param minSplashDuration - Minimum time in milliseconds to keep the splash screen visible if enabled. Defaults to `300`.
 * @param lang - Language code to append as the final `lang` query parameter.
 * @returns A promise that resolves once navigation has occurred and, if `splashScreen` is enabled,
 *          the minimum splash-screen duration has elapsed.
 *
 * @example
 * // Only language (no extra params, no splash)
 * navigateTo('/devices/edit', {}, false, 300, 'PT');
 * // → /devices/edit?lang=PT
 *
 * // With an extra parameter
 * navigateTo('/devices/edit', { foo: 'bar' }, false, 300, 'PT');
 * // → /devices/edit?foo=bar&lang=PT
 *
 * // With splash screen and custom duration
 * navigateTo('/home', { ref: '123' }, true, 500, 'EN')
 *   .then(() => console.log('Navigation complete and splash hidden'));
 */
export async function navigateTo(
    url: string,
    lang: string,
    extraParams: Record<string, string> = {},
    splashScreen: boolean = false,
    minSplashDuration: number = 300
): Promise<void> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(extraParams)) {
        params.append(key, value);
    }
    params.append("lang", lang);

    const target = `${url}?${params.toString()}`;
    const currentFull = window.location.pathname + window.location.search;

    if (currentFull === target) {
        return;
    }

    if (splashScreen) {
        splashDone.set(false);
    }
    loadedDone.set(false);

    await goto(target);

    if (splashScreen) {
        await new Promise((res) => setTimeout(res, minSplashDuration));
        splashDone.set(true);
    }
}
