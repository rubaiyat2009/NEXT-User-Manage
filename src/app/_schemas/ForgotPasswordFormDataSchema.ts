import * as z from 'zod';

export const ForgotPasswordFormDataSchema = z.object({
    email: z.string().trim().email().toLowerCase(),
});

export type ForgotPasswordData = z.infer<typeof ForgotPasswordFormDataSchema>;
