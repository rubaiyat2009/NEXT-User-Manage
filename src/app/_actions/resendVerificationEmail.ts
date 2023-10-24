'use server';

import serverAction from '@/app/_lib/serverAction';
import { cookies } from 'next/headers';
import { generateEmailVerificationToken, sendEmailVerificationLink } from '../_lib/token';

export const resendVerificationEmail = serverAction(
    async ({ session, authRequest }) => {
        if (!session) {
            return new Response(null, {
                status: 401,
            });
        }
        if (session.user.email_verified) {
            return new Response(
                JSON.stringify({
                    error: 'Email already verified',
                }),
                {
                    status: 422,
                },
            );
        }
        const token = await generateEmailVerificationToken(session.user.userId);
        await sendEmailVerificationLink(session.user.email, token);
        return new Response();
    },
    { cookies },
);
