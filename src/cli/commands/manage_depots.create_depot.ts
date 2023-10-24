import { confirm, input } from '@inquirer/prompts';
import { mongoosify } from '@/cli/utils';
import {Manage } from '@/app/_models';

export default async function command() {
    const name = await input({
        message: "What's theManage name?",
    });

    const result = await confirm({
        message: `CreateManage "${name}"?`,
    });

    if (!result) return;

    await mongoosify(async () => {
        constManage = newManage({
            name,
        });
        awaitManage.save();
    });
}
