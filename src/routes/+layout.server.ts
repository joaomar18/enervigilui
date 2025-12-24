/**
 * Root layout server loader that enforces authentication and route validity.
 *
 * Applies server-authoritative guards for:
 * - Authentication access
 * - Auth boundary normalization (/ → /devices, /login when authenticated)
 * - Device-scoped subpage requirements
 *
 * This loader performs redirects only and exposes no client-side logic.
 */
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const DEVICE_SCOPED_PAGES = new Set([
    'general_view',
    'edit',
]);

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const authenticated = locals.authenticated;

    const segments = url.pathname.split('/').filter(Boolean);
    const base = segments.length > 0 ? `/${segments[0]}` : '/';
    const subpage = segments[1] ?? null;

    // Redirect unauthenticated users to login
    if (!authenticated && base !== '/login') {
        throw redirect(303, '/login');
    }

    // Normalize authenticated access away from auth/root pages
    if (authenticated && (base === '/login' || base === '/')) {
        throw redirect(303, '/devices');
    }

    // Enforce required device context for device-scoped subpages
    if (base === '/devices' && subpage && DEVICE_SCOPED_PAGES.has(subpage)) {
        const deviceId = url.searchParams.get('deviceId');

        if (!deviceId) {
            throw redirect(303, '/devices');
        }
    }
};