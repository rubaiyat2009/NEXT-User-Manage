import { input } from '@inquirer/prompts';
import { access, constants, readFile } from 'node:fs/promises';
import { Haulier, IHaulier } from '@/app/_models';
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
        default: './dump/hauliers.json',
    });

    const content = await readFile(result, 'utf8');
    const hauliers = JSON.parse(content) as IHaulier[];

    await mongoosify(async () => {
        await Haulier.insertMany(hauliers);
    });
}
