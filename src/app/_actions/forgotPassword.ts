'use server';

import serverAction from '@/app/_lib/serverAction';
import { cookies } from 'next/headers';
import { User } from '@/app/_models';
import { ForgotPasswordFormDataSchema } from '@/app/_schemas/ForgotPasswordFormDataSchema';
import { generatePasswordResetToken } from '@/app/_lib/token';
import sendMail from '@/app/_lib/sendMail';
import assert from 'assert';
import { SiteUrl } from '@/app/_lib/Urls';

export const forgotPassword = serverAction(
    async (_, { email }) => {
        const user = await User.findOne({ email });
        assert(!!user, "User doesn't exist");

        const token = await generatePasswordResetToken(user._id);

        const htmlTemplate = `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <title>Reset Password</title>
                </head>
                <body style="padding: 30px;text-align:center;">
                <p style="color: #8A8A8A;font-size:16px;font-weight: 600; margin-bottom:15px;">Click button below to reset your password</p>
                    <a 
                    style="background:#0284c7;color:#fff;padding:12px 20px; border-radius:3px;text-decoration:none;font-size:18px;"
                     href="${SiteUrl}/reset-password/${token}">Reset Password Link</a>
                </body>
                </html>
            `;

        await sendMail({
            to: user.email,
            from: 'admin@gmail.com',
            subject: 'Password Reset - User Manage',
            html: htmlTemplate,
        });
    },
    {
        authenticated: false,
        schema: ForgotPasswordFormDataSchema,
        cookies,
    },
);
