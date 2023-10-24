'use server';

import serverAction from '@/app/_lib/serverAction';
import { cookies } from 'next/headers';
import { User } from '@/app/_models';
import { redirect } from 'next/navigation';
import { ResetPasswordDataSchema } from '../_schemas/ResetPasswordDataSchema';
import { validatePasswordResetToken } from '../_lib/token';

export const resetPassword = serverAction(
    async ({ authRequest }, { password, token }) => {
        const user_Id = await validatePasswordResetToken(token);
        let user = await User.findById(user_Id);
        await user?.invalidAllSession(user_Id);
        await user?.resetPassword('email', user.email, password);

        redirect('/sign-in');
    },
    {
        authenticated: false,
        schema: ResetPasswordDataSchema,
        cookies,
    },
);
