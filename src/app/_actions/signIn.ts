'use server';

import serverAction from '@/app/_lib/serverAction';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { SignInFormDataSchema } from '@/app/_schemas/SignInFormDataSchema';
import { User } from '@/app/_models';

export const signIn = serverAction(
    async ({ authRequest }, { password, email }) => {
        const user = await User.auth().useKey('email', email, password);

        const session = await User.auth().createSession({
            userId: user.userId,
            attributes: {},
        });

        authRequest.setSession(session);

        revalidatePath('/');
    },
    {
        authenticated: false,
        schema: SignInFormDataSchema,
        cookies,
    },
);
