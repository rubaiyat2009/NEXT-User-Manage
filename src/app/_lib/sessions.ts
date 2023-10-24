import { cache } from 'react';
import db from '@/app/_lib/db';
import { cookies } from 'next/headers';
import { User } from '@/app/_models';

export const getSession = cache(async () => {
    await db();

    const authRequest = User.auth().handleRequest({
        request: null,
        cookies,
    });

    return await authRequest.validate();
});
