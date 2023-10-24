import * as z from 'zod';

export const RemoveUserFormDataSchema = z.object({
    _id: z.string().or(z.object({})),
} as const);

export type RemoveUserFormData = z.infer<typeof RemoveUserFormDataSchema>;
