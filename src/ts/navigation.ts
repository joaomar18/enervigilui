import { goto } from "$app/navigation";

// Splash screen store
import { splashDone } from "../stores/auth";

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
