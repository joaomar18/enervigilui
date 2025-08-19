import { writable, type Writable } from "svelte/store";

/**
 * Types of toast messages for popup notifications.
 */
export enum ToastType {
    ALERT = "ALERT",
    INFO = "INFO",
    WARNING = "WARNING",
    NEUTRAL = "NEUTRAL",
}

export const displayToast: Writable<boolean> = writable(false);
export const toastType: Writable<ToastType> = writable(ToastType.ALERT);
export const toastKey: Writable<string> = writable("");
export const toastVariables: Writable<Record<string, string | number> | undefined> = writable(undefined);
export const toastTimeout: Writable<ReturnType<typeof setTimeout> | null> = writable(null);
