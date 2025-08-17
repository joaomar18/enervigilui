import type { Language } from "$lib/stores/lang";
import { alertTimeout, alertText, displayAsInfo, displayAlert } from "$lib/stores/alerts";

export function showAlert(textLang: Record<Language, string>, variables?: Record<string, string | number>, isInfo?: boolean) {
    alertTimeout.update((old) => {
        if (old) clearTimeout(old);
        return null;
    });

    // If variables are provided, replace placeholders in each language
    if (variables) {
        const processedText: Record<Language, string> = { ...textLang };

        Object.keys(textLang).forEach((lang) => {
            let message = textLang[lang as Language];

            Object.entries(variables).forEach(([key, value]) => {
                message = message.replace(`{${key}}`, String(value));
            });

            processedText[lang as Language] = message;
        });

        alertText.set(processedText);
    } else {
        alertText.set(textLang);
    }

    displayAsInfo.set(isInfo ? true : false);
    displayAlert.set(true);
    const id = setTimeout(() => displayAlert.set(false), 3000);
    alertTimeout.set(id);
}
