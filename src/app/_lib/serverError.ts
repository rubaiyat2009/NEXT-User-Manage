import type { LuciaError } from 'lucia';
import type { ForbiddenError } from '@casl/ability';

export function isLuciaError(error: unknown): error is LuciaError {
    return error?.constructor?.name === 'LuciaError';
}

export function isForbiddenError(error: unknown): error is ForbiddenError<any> {
    return error?.constructor?.name === 'ForbiddenError';
}

/**
 *  Check if error is a redirect error. Redirect errors are thrown by the server to redirect the client to a different page.
 *  It should be rethrown in order for the page to be redirected.
 *
 * @param error
 */
export function isRedirectError(error: any): boolean {
    if (typeof error?.digest !== 'string') return false;

    const [errorCode, type, destination, permanent = 'false'] = (error.digest as any).split(';', 4);

    return (
        errorCode === 'NEXT_REDIRECT' &&
        (type === 'replace' || type === 'push') &&
        typeof destination === 'string' &&
        (permanent === 'true' || permanent === 'false')
    );
}
