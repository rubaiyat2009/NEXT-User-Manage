import * as z from 'zod';

export const ResetPasswordDataSchema = z
    .object({
        password: z.string().trim().min(6).max(100),
        confirm_password: z.string().trim().min(6).max(100),
        token: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ['confirm_password'],
    });

export type ResetPasswordData = z.infer<typeof ResetPasswordDataSchema>;
