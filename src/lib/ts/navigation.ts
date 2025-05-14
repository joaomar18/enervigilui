import { goto } from "$app/navigation";

// Splash screen store
import { splashDone } from "../stores/auth";

/**
 * Navigates the application to a new URL with a specified language parameter,
 * optionally showing a splash screen for at least a minimum duration.
 *
 * @param url - The base URL or route to navigate to (without query parameters).
 * @param lang - Language code to append as a `lang` query parameter.
 * @param splashScreen - Whether to display the splash screen during navigation. Defaults to `false`.
 * @param minSplashDuration - Minimum time in milliseconds to keep the splash screen visible if enabled. Defaults to 300 ms.
 * @returns A promise that resolves once navigation has occurred and, if `splashScreen` is enabled,
 *          the minimum splash-screen duration has elapsed.
 *
 * @example
 * // Navigate to "/dashboard" in Portuguese without splash screen
 * navigateTo("/dashboard", "PT");
 *
 * // Navigate to "/home" in English, showing splash for at least 500 ms
 * navigateTo("/home", "EN", true, 500)
 *   .then(() => console.log("Navigation complete and splash hidden"));
 */
export async function navigateTo(
    url: string,
    lang: string,
    splashScreen: boolean = false,
    minSplashDuration: number = 300
): Promise<void> {
    if (splashScreen) {
        splashDone.set(false);
    }
    await goto(url + "?lang=" + lang);

    if (splashScreen) {
        await new Promise((res) => setTimeout(res, minSplashDuration));
        splashDone.set(true);
    }
}
