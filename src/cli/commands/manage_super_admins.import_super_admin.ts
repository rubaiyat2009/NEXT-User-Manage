import { input } from '@inquirer/prompts';
import { access, constants, readFile } from 'node:fs/promises';
import { ISuperAdmin, SuperAdmin } from '@/app/_models';
import { mongoosify } from '@/cli/utils';
import path from 'path';

export default async function command() {
    const result = await input({
        message: 'Where is the file located?',
        validate: async (value) => {
            try {
                await access(path.resolve(value), constants.F_OK);
                return true;
            } catch (e) {
                return "File doesn't exist";
            }
        },
        default: './dump/superadmins.json',
    });

    const content = await readFile(result, 'utf8');
    const users = JSON.parse(content) as (ISuperAdmin & { password: string })[];

    await mongoosify(async () => {
        await Promise.all(
            users.map(async ({ password, ...rest }) => {
                const user = new SuperAdmin(rest);
                await user.createOnBehalf(null, password);
            }),
        );
    });
}
