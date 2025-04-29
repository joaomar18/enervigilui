import { writable } from 'svelte/store';

export const isAuthenticated = writable<boolean>(false);
export const authChecked = writable<boolean>(false);