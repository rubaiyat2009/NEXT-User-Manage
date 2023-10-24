import db from '@/app/_lib/db';
import * as z from 'zod';
import { AuthRequest, Session } from 'lucia';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import defineAbilityForUser from '@/app/_lib/defineAbilityForUser';
import { MongoAbility } from '@casl/ability';
import { isForbiddenError, isLuciaError, isRedirectError } from '@/app/_lib/serverError';
import { AssertionError } from 'assert';
import superjson from 'superjson';
import { Error } from 'mongoose';
import { User } from '@/app/_models';

type Context<AUTH extends boolean = false> = {
    session: AUTH extends true ? Session : Session | null;
    authRequest: AuthRequest<Lucia.Auth>;
    userAbilities: MongoAbility<[Abilities.Actions, Abilities.Subjects]>;
};

type ServerActionFn<REQ = undefined, RES = void, AUTH extends boolean = false> = (
    ...args: REQ extends undefined ? [ctx: Context<AUTH>] : [ctx: Context<AUTH>, req: REQ]
) => Promise<RES>;

type ServerAction<REQ = undefined, RES = void> = (req?: REQ) => Promise<RES>;

/**
 * Creates a server action. This is a wrapper around a function that handles the database connection, authentication,
 * and error handling.
 *
 * @param fn
 * @param schema
 * @param authenticated
 * @param cookies
 */
export default function serverAction<REQ = undefined, RES = void, AUTH extends boolean = true>(
    fn: ServerActionFn<REQ, RES, AUTH>,
    {
        schema,
        authenticated,
        cookies,
    }: {
        schema?: z.ZodType<REQ>;
        authenticated?: AUTH;
        cookies: () => ReadonlyRequestCookies;
    },
): ServerAction<REQ, RES> {
    return async (formData) => {
        try {
            await db();

            const authRequest = User.auth().handleRequest({
                request: null,
                cookies,
            });

            const session = await authRequest.validate();

            if ((authenticated ?? true) && !session) {
                throw new Error("You're not authenticated.");
            }

            let deserialized = undefined;

            if (!formData && schema) {
                throw new Error('Invalid request.');
            }

            if (!!formData) {
                deserialized = superjson.deserialize(formData as any);
            }

            if (!!schema) {
                deserialized = await schema.parseAsync(deserialized);
            }

            const userAbilities = defineAbilityForUser(session?.user ?? null);

            const result = await (fn as Function)(
                { session: session, authRequest, userAbilities },
                deserialized,
            );

            const { meta, json } = superjson.serialize(result) as any;

            return {
                meta,
                json,
            } as RES;
        } catch (e: any) {
            const error = new Error("Something went wrong. We're looking into it.");

            if (isLuciaError(e)) {
                switch (e.message) {
                    case 'AUTH_DUPLICATE_KEY_ID':
                        error.message = 'This email is already in use.';
                        break;
                    case 'AUTH_INVALID_PASSWORD':
                    case 'AUTH_INVALID_KEY_ID':
                        error.message = 'Invalid email or password.';
                        break;
                    case 'REQUEST_UNAUTHORIZED':
                        error.message = "You don't have permission to do that.";
                        break;
                    default:
                        console.error(e);
                }
            } else if (e instanceof Error.DocumentNotFoundError) {
                error.message = 'Document not found.';
            } else if (e instanceof z.ZodError) {
                console.log(e);
                error.message = e.issues[0].message;
            } else if (isForbiddenError(e)) {
                console.error({
                    action: e.action,
                    subject: e.subject,
                    field: e.field,
                    message: e.message,
                });
                error.message = 'You do not have permission to do that.';
            } else if (e instanceof AssertionError) {
                error.message = e.message;
            } else if (isRedirectError(e)) {
                throw e;
            } else {
                console.error(e);
            }

            /**
             * We serialize the error to make sure it's safe to send to the client.
             */
            const { meta, json } = superjson.serialize(error);

            return {
                meta,
                json,
            } as RES;
        }
    };
}
