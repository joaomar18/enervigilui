import { goto } from "$app/navigation";
import { get } from "svelte/store";
import { browser } from "$app/environment";
import { checkAutoLogin } from "../validation/auth";
import { selectedLang } from "$lib/stores/lang/definition";

// Splash screen store
import {
    splashDone,
    loadedDone,
    showSubLoader,
    leftPanelOpen,
    searchQuery,
    subLoaderTimer,
    resetSubLoaderSubscription,
} from "../../stores/view/navigation";

/**
 * Builds navigation URLs with query parameters and returns navigation route information.
 *
 * Appends all extra parameters except 'lang', then appends the language code as the final query parameter.
 * Returns the complete target URL, target route, current route, and extracted search query for navigation comparison.
 *
 * @param url - The base URL or route to navigate to (without query parameters).
 * @param lang - Language code to append as the final 'lang' query parameter.
 * @param extraParams - Additional key/value pairs to include in the query string (excluding 'lang').
 * @returns [target, targetRoute, currentRoute, searchQuery]
 * - Array with the complete target URL with query params, target route path, current route path, and extracted search query string.
 */
function getNavigationReady(url: string, lang: string, extraParams: Record<string, string> = {}): Array<string> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(extraParams)) {
        if (key !== "lang") params.append(key, value);
    }
    params.append("lang", lang);

    const target = `${url}?${params.toString()}`;
    const targetRoute = url;
    const currentRoute = window.location.pathname;
    const searchQuery = params.get("searchQuery") ?? "";

    return [target, targetRoute, currentRoute, searchQuery];
}

/**
 * Resets the sub-loader timer and subscription to ensure a clean navigation state.
 *
 * Clears any active sub-loader timeout and unsubscribes from the loader completion event.
 * This prevents duplicate timers or subscriptions when starting a new navigation.
 */
function resetSubLoaderTrigger() {
    // Reset Sub Loader Timer
    const timer = get(subLoaderTimer);
    if (timer) {
        clearTimeout(timer);
        subLoaderTimer.set(null);
    }

    // Reset Sub Loader Subscription
    const subscription = get(resetSubLoaderSubscription);
    if (subscription) {
        subscription();
        resetSubLoaderSubscription.set(null);
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
    const subscription = loadedDone.subscribe((val) => {
        if (val) {
            showSubLoader.set(false);
            const currentSub = get(resetSubLoaderSubscription);
            if (currentSub) {
                currentSub();
                resetSubLoaderSubscription.set(null);
            }
        }
    });

    resetSubLoaderSubscription.set(subscription);

    const timer = setTimeout(() => {
        const loadedDoneState = get(loadedDone);
        if (!loadedDoneState) {
            showSubLoader.set(true);
        }
    }, showSubLoaderTime);

    subLoaderTimer.set(timer);
}

/**
 * Navigates to a new URL with optional query parameters, splash screen, and loading states.
 *
 * @param url - The target URL or route to navigate to.
 * @param extraParams - Additional query parameters to append to the URL.
 * @param splashScreen - Whether to show splash screen during navigation.
 * @param minSplashDuration - Minimum duration (ms) to display splash screen.
 * @param showSubLoaderTime - Time (ms) before showing sub-loader if navigation takes too long.
 * @returns Promise that resolves when navigation and splash screen (if enabled) complete.
 */
export async function navigateTo(
    url: string,
    extraParams: Record<string, string> = {},
    splashScreen: boolean = false,
    minSplashDuration: number = 300,
    showSubLoaderTime: number = 600
): Promise<void> {
    let [target, targetRoute, currentRoute, searchQuery] = getNavigationReady(url, get(selectedLang), extraParams);

    // Already in Intended URL
    if (targetRoute === currentRoute) {
        return;
    }

    resetSubLoaderTrigger();
    loadedDone.set(false);
    setSubLoaderTrigger(showSubLoaderTime);
    setSearchQuery(targetRoute, searchQuery);

    let gotoPromise = goto(target);
    let timerPromise = Promise.resolve();
    if (splashScreen) {
        splashDone.set(false);
        timerPromise = new Promise((res) => setTimeout(res, minSplashDuration));
    }

    await Promise.all([gotoPromise, timerPromise]);

    if (!window.matchMedia("(min-width: 880px)").matches) {
        leftPanelOpen.set(false);
    }

    if (splashScreen) {
        splashDone.set(true);
    }
}

/**
 * Checks if the current page is an authentication page.
 * @returns True if the current pathname starts with "/login".
 */
export function isAuthenticationPage(): boolean {
    return window.location.pathname.startsWith("/login");
}

/**
 * Checks if the current page is a dashboard page.
 * @returns True if the current page is not an authentication page.
 */
export function isDashboardPage(): boolean {
    return !isAuthenticationPage();
}

/**
 * Updates document body scroll behavior based on content loading state.
 * @param contentLoaded - True to enable scrolling, false to disable.
 */
export function updateScrollingState(contentLoaded: boolean): void {
    if (browser) {
        if (contentLoaded) {
            document.body.style.overflow = "auto";
        } else {
            document.body.style.overflow = "hidden";
        }
    }
}

/**
 * Sets initial left panel state based on screen width.
 * Opens panel on desktop (≥880px), closes on mobile.
 */
export function setInitialLeftPanelState() {
    leftPanelOpen.set(window.matchMedia("(min-width: 880px)").matches);
}

/**
 * Sets the search query state based on the target route.
 *
 * Clears the search query for all routes except "/devices" where it preserves the search string.
 * This ensures search functionality is only active on the devices page.
 *
 * @param targetRoute - The route being navigated to.
 * @param searchString - The search query string to set (only used for "/devices" route).
 */
export function setSearchQuery(targetRoute: string, searchString: string) {
    if (targetRoute !== "/devices") {
        searchQuery.set("");
    } else {
        searchQuery.set(searchString);
    }
}

/**
 * Extracts search query from current URL and updates the search state.
 * Reads 'searchQuery' parameter from URL and applies it via setSearchQuery.
 */
export async function getSearchQuery() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("searchQuery") ?? "";
    setSearchQuery(path, searchQuery);
}

/**
 * Initializes layout by checking authentication, loading search state, and handling redirects.
 * Waits for minimum splash duration before completing initialization.
 */
export async function initLayout() {
    const checkAutoLoginPromise = checkAutoLogin();
    const getSearchQueryPromise = getSearchQuery();
    const minTimePromise = new Promise((res) => setTimeout(res, 300));

    const [authResult] = await Promise.all([checkAutoLoginPromise, getSearchQueryPromise, minTimePromise]);

    if (authResult.shouldRedirect && authResult.redirectTarget) {
        await navigateTo(authResult.redirectTarget);
    }

    splashDone.set(true);
}
