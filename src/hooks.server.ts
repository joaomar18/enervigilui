import type { Handle } from '@sveltejs/kit';

/**
 * Populates request-local authentication state based on the presence of a session token.
 *
 * This value is used by server-side loaders and guards to determine access,
 * and may be forwarded to the client via layout data when needed.
 */
export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token');
    event.locals.authenticated = Boolean(token);
    return resolve(event);
};