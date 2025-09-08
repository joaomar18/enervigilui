import { writable } from "svelte/store";

export const currentDeviceID = writable<number | undefined>(undefined); // Current device id