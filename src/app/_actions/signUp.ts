'use server';

import { SignUpFormDataSchema } from '@/app/_schemas/SignUpFormDataSchema';
import serverAction from '@/app/_lib/serverAction';
import { Haulier, HaulierAdmin, User } from '@/app/_models';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { generateEmailVerificationToken, sendEmailVerificationLink } from '../_lib/token';

export const signUp = serverAction(
    async (
        { userAbilities, authRequest },
        { first_name, last_name, company_name, telephone, email, password },
    ) => {
        const haulier = await Haulier.create({ name: company_name });

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

        const newUser = await User.auth().useKey('email', email, password);
        const session = await User.auth().createSession({
            userId: newUser.userId,
            attributes: {},
        });

        authRequest.setSession(session);

        const token = await generateEmailVerificationToken(newUser.userId);
        await sendEmailVerificationLink(email, token);

        redirect('/verify-email');
    },
    {
        authenticated: false,
        schema: SignUpFormDataSchema,
        cookies,
    },
);
