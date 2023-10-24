import * as z from 'zod';

export const SignInFormDataSchema = z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().trim().min(6).max(100),
});

export type SignInFormData = z.infer<typeof SignInFormDataSchema>;
