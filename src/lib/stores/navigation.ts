import { writable } from "svelte/store";

export const splashDone = writable<boolean>(false);
export const loadedDone = writable<boolean>(false);
export const showSubLoader = writable<boolean>(false);
export const leftPanelOpen = writable<boolean>(false);
export const searchQuery = writable<string>(""); // Query to filter devices
