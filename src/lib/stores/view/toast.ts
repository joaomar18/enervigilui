import { writable, type Writable } from "svelte/store";
import { readable, type Readable } from "svelte/store";

/**
 * Types of toast / alert messages for notifications.
 */
export enum AlertType {
    ALERT = "ALERT",
    INFO = "INFO",
    WARNING = "WARNING",
    NEUTRAL = "NEUTRAL",
}

export const displayToast: Writable<boolean> = writable(false);
export const toastType: Writable<AlertType> = writable(AlertType.ALERT);
export const toastTextList: Writable<Record<string, string> | null> = writable(null);
export const toastKey: Writable<string> = writable("");
export const toastVariables: Writable<Record<string, string | number> | undefined> = writable(undefined);
export const toastTimeout: Writable<ReturnType<typeof setTimeout> | null> = writable(null);
