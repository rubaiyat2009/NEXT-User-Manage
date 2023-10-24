'use server';

import serverAction from '@/app/_lib/serverAction';
import { cookies } from 'next/headers';
import { User } from '@/app/_models';

export const signOut = serverAction(
    async ({ session, authRequest }) => {
        await User.auth().invalidateSession(session.sessionId);
        authRequest.setSession(null);
    },
    { cookies },
);
