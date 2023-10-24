import {Manage,ManageAdmin } from '@/app/_models';
import { mongoosify } from '@/cli/utils';
import { confirm, input, password, select } from '@inquirer/prompts';
import * as z from 'zod';

export default async function command() {
    const first_name = await input({
        message: 'What is the first name of theManage admin?',
        validate: (value) =>
           ManageAdmin.schema
                .path('first_name')
                .validators.every((validator) => validator.validator?.(value)),
    });

    const last_name = await input({
        message: 'What is the last name of theManage admin?',
        validate: (value) =>
           ManageAdmin.schema
                .path('last_name')
                .validators.every((validator) => validator.validator?.(value)),
    });

    const email = await input({
        message: 'What is the email of theManage admin?',
        validate: (value) =>
           ManageAdmin.schema
                .path('email')
                .validators.every((validator) => validator.validator?.(value)),
    });

    const telephone = await input({
        message: 'What is the telephone of theManage admin?',
        validate: (value) =>
           ManageAdmin.schema
                .path('telephone')
                .validators.every((validator) => validator.validator?.(value)),
    });

    const email_verified = await confirm({
        message: 'Is the email verified?',
    });

    const _password = await password({
        message: 'What is the password of theManage admin?',
        validate: (value) => {
            const result = z.string().trim().min(6).max(100).safeParse(value);
            return result.success;
        },
    });

    await mongoosify(async () => {
        constManages = awaitManage.find({}).lean();

        const choice = await select({
            message: 'WhichManage should thisManageAdmin manage?',
            choices:Manages.map((depot) => ({ name:Manage.name, value:Manage._id })),
        });

        const user = newManageAdmin({
            first_name,
            last_name,
            email,
            telephone,
            email_verified,
           Manage: choice,
        });

        await user.createOnBehalf(null, _password);
    });
}
