'use server';

import { SignUpFormDataSchema } from '@/app/_schemas/SignUpFormDataSchema';
import serverAction from '@/app/_lib/serverAction';
import { Haulier, HaulierAdmin } from '@/app/_models';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const onSignUp = serverAction(
    async ({ userAbilities }, { first_name, last_name, telephone, email, password }) => {
        const haulier = await Haulier.create({});

        const user = new HaulierAdmin({
            email,
            first_name,
            last_name,
            telephone,
            email_verified: false,
            role: 'HaulierAdmin',
            haulier: haulier._id,
        });

        await user.createOnBehalf(userAbilities, password);

        redirect('/sign-in');
    },
    {
        authenticated: false,
        schema: SignUpFormDataSchema,
        cookies,
    },
);
