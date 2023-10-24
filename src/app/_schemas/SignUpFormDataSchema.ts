import * as z from 'zod';

export const SignUpFormDataSchema = z.object({
    first_name: z.string().trim().min(5).max(100),
    last_name: z.string().trim().min(5).max(100),
    company_name: z.string().trim().min(0).max(100),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().trim().min(6).max(100),
    telephone: z.string().trim().min(6).max(100).regex(/\d+/),
});

export type SignUpFormData = z.infer<typeof SignUpFormDataSchema>;
