import { writable, type Writable } from "svelte/store";
import type { Language } from "./lang";

export const displayAlert = writable(false);
export const displayAsInfo = writable(false);
export const alertText = writable<Record<Language, string>>({ EN: "", PT: "" });
export const alertTimeout: Writable<ReturnType<typeof setTimeout> | null> = writable(null);