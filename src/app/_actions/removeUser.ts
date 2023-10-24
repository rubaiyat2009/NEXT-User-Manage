'use server';

import serverAction from '@/app/_lib/serverAction';
import { cookies } from 'next/headers';
import { RemoveUserFormDataSchema } from '@/app/_schemas/RemoveUserFormDataSchema';
import { IUser, User } from '@/app/_models';
import { ForbiddenError } from '@casl/ability';
import { revalidatePath } from 'next/cache';
import { HydratedDocument } from 'mongoose';

export const removeUser = serverAction(
    async ({ userAbilities }, { _id }) => {
        const user = (await User.findById(
            _id,
            undefined,
        ).orFail()) as unknown as HydratedDocument<IUser>;
        ForbiddenError.from(userAbilities).throwUnlessCan('delete', user);
        await User.auth().deleteUser(_id as string);
        revalidatePath('/users');
    },
    { cookies, schema: RemoveUserFormDataSchema },
);
