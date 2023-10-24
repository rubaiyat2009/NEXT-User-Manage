import { confirm, input, password } from '@inquirer/prompts';
import { SuperAdmin } from '@/app/_models';
import { mongoosify } from '@/cli/utils';
import * as z from 'zod';

export default async function command() {
    const first_name = await input({
        message: 'What is the first name of the super admin?',
        validate: (value) =>
            SuperAdmin.schema
                .path('first_name')
                .validators.every((validator) => validator.validator?.(value)),
    });

    const last_name = await input({
        message: 'What is the last name of the super admin?',
        validate: (value) =>
            SuperAdmin.schema
                .path('last_name')
                .validators.every((validator) => validator.validator?.(value)),
    });

    const email = await input({
        message: 'What is the email of the super admin?',
        validate: (value) =>
            SuperAdmin.schema
                .path('email')
                .validators.every((validator) => validator.validator?.(value)),
    });

    const telephone = await input({
        message: 'What is the telephone of the super admin?',
        validate: (value) =>
            SuperAdmin.schema
                .path('telephone')
                .validators.every((validator) => validator.validator?.(value)),
    });

    const email_verified = await confirm({
        message: 'Is the email verified?',
    });

    const _password = await password({
        message: 'What is the password of the super admin?',
        validate: (value) => {
            const result = z.string().trim().min(6).max(100).safeParse(value);
            return result.success;
        },
    });

    await mongoosify(async () => {
        const user = new SuperAdmin({
            first_name,
            last_name,
            email,
            telephone,
            email_verified,
        });

        await user.createOnBehalf(null, _password);
    });
}
