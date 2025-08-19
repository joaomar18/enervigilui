import { toastTimeout, toastKey, toastVariables, toastType, displayToast } from "$lib/stores/view/toast";
import { ToastType } from "$lib/stores/view/toast";

/**
 * Shows a toast popup with a message key, type, and optional variables.
 * @param key Message key.
 * @param type Toast type.
 * @param variables Optional variables for message.
 */
export function showToast(key: string, type: ToastType, variables?: Record<string, string | number>) {
    toastTimeout.update((old) => {
        if (old) clearTimeout(old);
        return null;
    });

    toastKey.set(key);
    toastVariables.set(variables);
    toastType.set(type);
    displayToast.set(true);
    const id = setTimeout(() => displayToast.set(false), 3000);
    toastTimeout.set(id);
}
