import { writable } from "svelte/store";

export const currentPage = writable<string>(""); // Current page path
export const splashDone = writable<boolean>(false);
export const loadedDone = writable<boolean>(false);
export const showSubLoader = writable<boolean>(false);
export const leftPanelOpen = writable<boolean>(false);
export const searchQuery = writable<string>(""); // Query to filter devices
export const resetSubLoaderSubscription = writable<(() => void) | null>(null); //Subscription to reset sub loader
export const subLoaderTimer = writable<ReturnType<typeof setTimeout> | null>(null); // Timeout to set sub loader in case of delay
export const hasMouseCapability = writable<boolean>(false);