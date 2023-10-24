import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { PasswordResetToken } from '../_models/PasswordResetToken';
import assert from 'assert';
import { EmailVerificationToken } from '../_models/EmailverificationToken';
import sendMail from './sendMail';
import { SiteUrl } from './Urls';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generatePasswordResetToken = async (user_id: string) => {
    const storedUserTokens = await PasswordResetToken.find({ user_id });
    if (storedUserTokens.length > 0) {
        const reusableStoredToken = storedUserTokens.find((token) => {
            // check if expiration is within 1 hour
            // and reuse the token if true
            return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
        });
        if (reusableStoredToken) return reusableStoredToken.id;
    }
    const token = generateRandomString(63);
    const passwordResetToken = new PasswordResetToken({
        id: token,
        expires: new Date().getTime() + EXPIRES_IN,
        user_id: user_id,
    });
    await passwordResetToken.save();

    return token;
};

export const validatePasswordResetToken = async (token: string) => {
    const storedToken = await PasswordResetToken.findOne({ id: token });

    assert(!!storedToken, 'Invalid token');

    await PasswordResetToken.deleteOne({ id: storedToken.id });

    const tokenExpires = Number(storedToken.expires); // bigint => number conversion

    assert(!!isWithinExpiration(tokenExpires), 'Expired token');

    return storedToken.user_id;
};

export const generateEmailVerificationToken = async (user_id: string) => {
    const storedUserTokens = await EmailVerificationToken.find({ user_id });
    if (storedUserTokens.length > 0) {
        const reusableStoredToken = storedUserTokens.find((token) => {
            // check if expiration is within 1 hour
            // and reuse the token if true
            return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
        });
        if (reusableStoredToken) return reusableStoredToken.id;
    }
    const token = generateRandomString(63);
    const emailVerificationToken = new EmailVerificationToken({
        id: token,
        expires: new Date().getTime() + EXPIRES_IN,
        user_id: user_id,
    });
    await emailVerificationToken.save();

    return token;
};

export const validateEmailVerificationToken = async (token: string) => {
    const storedToken = await EmailVerificationToken.findOne({ id: token });

    assert(!!storedToken, 'Invalid token');

    await EmailVerificationToken.deleteOne({ id: storedToken.id });

    const tokenExpires = Number(storedToken.expires); // bigint => number conversion

    assert(!!isWithinExpiration(tokenExpires), 'Expired token');

    return storedToken.user_id;
};

export const sendEmailVerificationLink = async (email: string, token: string) => {
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
        <p style="color: #8A8A8A;font-size:16px;font-weight: 600; margin-bottom:15px;">Click button below to verify your account</p>
            <a 
            style="background:#0284c7;color:#fff;padding:12px 20px; border-radius:3px;text-decoration:none;font-size:18px;"
             href="${SiteUrl}/verify-email/${token}">Verify Account</a>
        </body>
        </html>
    `;

    await sendMail({
        to: email,
        from: 'admin@gmail.com',
        subject: 'Verify Account - User Manage',
        html: htmlTemplate,
    });
};
