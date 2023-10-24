import * as z from 'zod';

export const UpdateUserFormDataSchema = z.object({
    _id: z.string().or(z.object({})),
    disabled: z.boolean(),
} as const);

export type UpdateUserFormData = z.infer<typeof UpdateUserFormDataSchema>;
