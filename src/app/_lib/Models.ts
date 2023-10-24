import * as z from 'zod';

export function zodValidator(schema: z.ZodSchema<any>) {
    return (value: any) => {
        const validated = schema.safeParse(value);
        return validated.success;
    };
}
