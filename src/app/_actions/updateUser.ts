'use server';

import serverAction from '@/app/_lib/serverAction';
import { cookies } from 'next/headers';
import { User } from '@/app/_models';
import { revalidatePath } from 'next/cache';
import { UpdateUserFormDataSchema } from '../_schemas/UpdateUserFormDataSchema';
import { startSession } from 'mongoose';
import sendMail from '../_lib/sendMail';

export const updateUser = serverAction(
    async ({ userAbilities }, { _id, disabled }) => {
        const ClientSession = await startSession();
        const user = await User.findOneAndUpdate(
            { _id },
            { disabled },
            { session: ClientSession, new: true },
        );

        if (user) {
            await sendMail({
                to: user?.email,
                from: 'admin@gmail.com',
                subject: 'Account - User Manage',
                text: disabled
                    ? `This account has been temporarily disabled due to unforeseen circumstances. Please reach out to KarbonX for further information or if you require any assistance.`
                    : 'This account has been enabled',
            });
            revalidatePath('/users');
        }
    },
    { cookies, schema: UpdateUserFormDataSchema },
);
