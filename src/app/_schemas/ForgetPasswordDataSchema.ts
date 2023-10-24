import * as z from 'zod';

export const ForgetPasswordDataSchema = z.object({
    email: z.string().trim().email().toLowerCase(),
});

export type ForgetPasswordData = z.infer<typeof ForgetPasswordDataSchema>;
