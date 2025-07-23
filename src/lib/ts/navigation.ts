import { goto } from "$app/navigation";
import { get } from "svelte/store";

// Splash screen store
import { splashDone, loadedDone, showSubLoader, leftPanelOpen } from "../stores/navigation";

let resetSubLoaderSub: (() => void) | null = null; //Subscription to reset sub loader
let subLoaderTimer: ReturnType<typeof setTimeout> | null = null; // Timeout to set sub loader in case of delay

/**
 * Builds navigation URLs with query parameters.
 *
 * Appends all extra parameters except 'lang', then appends the language code as the final query parameter.
 * Returns the intended navigation URL and the current URL for comparison.
 *
 * @param url - The base URL or route to navigate to (without query parameters).
 * @param lang - Language code to append as the final 'lang' query parameter.
 * @param extraParams - Additional key/value pairs to include in the query string (excluding 'lang').
 * @returns [target, current] - Array with the intended navigation URL and the current URL.
 */
function getNavigationReady(url: string, lang: string, extraParams: Record<string, string> = {}): Array<string> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(extraParams)) {
        if (key !== "lang") params.append(key, value);
    }
    params.append("lang", lang);

    const target = `${url}?${params.toString()}`;
    const current = window.location.pathname + window.location.search;
    return [target, current];
}

/**
 * Resets the sub-loader timer and subscription to ensure a clean navigation state.
 *
 * Clears any active sub-loader timeout and unsubscribes from the loader completion event.
 * This prevents duplicate timers or subscriptions when starting a new navigation.
 */
function resetSubLoaderTrigger() {
    // Reset Sub Loader Timer
    if (subLoaderTimer) {
        clearTimeout(subLoaderTimer);
        subLoaderTimer = null;
    }

    // Reset Sub Loader Subscription
    if (resetSubLoaderSub) {
        resetSubLoaderSub();
        resetSubLoaderSub = null;
    }
}

/**
 * Sets up the sub-loader logic for navigation.
 *
 * Subscribes to the `loadedDone` store to hide the sub-loader when loading completes,
 * and starts a timer to show the sub-loader if loading is not complete after the specified time.
 *
 * @param showSubLoaderTime - Time in milliseconds to wait before showing the sub-loader if not loaded.
 */
function setSubLoaderTrigger(showSubLoaderTime: number) {
    resetSubLoaderSub = loadedDone.subscribe((val) => {
        if (val) {
            showSubLoader.set(false);
            if (resetSubLoaderSub) {
                resetSubLoaderSub();
                resetSubLoaderSub = null;
            }
        }
    });

    subLoaderTimer = setTimeout(() => {
        const loadedDoneState = get(loadedDone);
        if (!loadedDoneState) {
            showSubLoader.set(true);
        }
    }, showSubLoaderTime);
}

/**
 * Navigates to a new URL, appending extra query parameters and a `lang` parameter,
 * with optional splash screen and sub-loader logic.
 *
 * @param url - The base URL or route to navigate to (without query parameters).
 * @param lang - Language code to append as the final `lang` query parameter.
 * @param extraParams - Additional key/value pairs to include in the query string (excluding `lang`).
 * @param splashScreen - If true, shows a splash screen during navigation. Defaults to `false`.
 * @param minSplashDuration - Minimum splash screen duration in ms if enabled. Defaults to `300`.
 * @param showSubLoaderTime - Time in ms before showing the sub-loader if loading is not complete. Defaults to `600`.
 * @returns Promise<void> Resolves after navigation and splash screen (if enabled) are complete.
 *
 * @example
 * // Navigate with only language
 * navigateTo('/devices/edit', 'PT');
 * // → /devices/edit?lang=PT
 *
 * // With extra parameters
 * navigateTo('/devices/edit', 'PT', { foo: 'bar' });
 * // → /devices/edit?foo=bar&lang=PT
 *
 * // With splash screen and custom duration
 * navigateTo('/home', 'EN', { ref: '123' }, true, 500)
 *   .then(() => console.log('Navigation complete and splash hidden'));
 *
 * // With sub-loader shown after 800ms if not loaded
 * navigateTo('/devices', 'PT', {}, false, 300, 800);
 */
export async function navigateTo(
    url: string,
    lang: string,
    extraParams: Record<string, string> = {},
    splashScreen: boolean = false,
    minSplashDuration: number = 300,
    showSubLoaderTime: number = 600
): Promise<void> {
    let [target, current] = getNavigationReady(url, lang, extraParams);

    // Already in Intended URL
    if (target === current) {
        return;
    }

    resetSubLoaderTrigger();

    let gotoPromise = goto(target);
    let timerPromise = Promise.resolve();

    if (splashScreen) {
        splashDone.set(false);
        timerPromise = new Promise((res) => setTimeout(res, minSplashDuration));
    }
    loadedDone.set(false);

    setSubLoaderTrigger(showSubLoaderTime);

    await Promise.all([gotoPromise, timerPromise]);

    if (!window.matchMedia("(min-width: 880px)").matches) {
        leftPanelOpen.set(false);
    }

    if (splashScreen) {
        splashDone.set(true);
    }

}