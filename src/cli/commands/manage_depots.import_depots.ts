import { input } from '@inquirer/prompts';
import { access, constants, readFile } from 'node:fs/promises';
import {Manage, IDepot } from '@/app/_models';
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
        default: './dump/depots.json',
    });

    const content = await readFile(result, 'utf8');
    constManages = JSON.parse(content) as IDepot[];

    await mongoosify(async () => {
        awaitManage.insertMany(depots);
    });
}
