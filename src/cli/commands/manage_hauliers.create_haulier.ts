import { confirm } from '@inquirer/prompts';
import { Haulier } from '@/app/_models';
import { mongoosify } from '@/cli/utils';

export default async function command() {
    const result = await confirm({
        message: `Create haulier?`,
    });

    if (!result) return;

    await mongoosify(async () => {
        await Haulier.create({});
    });
}
