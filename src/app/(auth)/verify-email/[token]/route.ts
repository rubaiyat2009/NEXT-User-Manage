import { validateEmailVerificationToken } from '@/app/_lib/token';
import { User } from '@/app/_models';

import type { NextRequest } from 'next/server';

export const GET = async (
    _: NextRequest,
    {
        params,
    }: {
        params: {
            token: string;
        };
    },
) => {
    const { token } = params;
    try {
        const userId = await validateEmailVerificationToken(token);
        const user = await User.auth().getUser(userId);
        await User.auth().invalidateAllUserSessions(user.userId);
        await User.auth().updateUserAttributes(user.userId, {
            email_verified: true,
        });
        const session = await User.auth().createSession({
            userId: user.userId,
            attributes: {},
        });
        const sessionCookie = User.auth().createSessionCookie(session);
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/',
                'Set-Cookie': sessionCookie.serialize(),
            },
        });
    } catch {
        return new Response('Invalid email verification link', {
            status: 400,
        });
    }
};
