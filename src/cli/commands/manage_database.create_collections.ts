import { mongoosify } from '@/cli/utils';
import * as _models from '@/app/_models';
import { confirm } from '@inquirer/prompts';
import { Model } from 'mongoose';

export default async function command() {
    const result = await confirm({
        message: 'Create all collections?',
    });

    if (!result) return;

    await mongoosify(async () => {
        await Promise.all(
            Object.values(_models)
                .filter((model): model is Model<any> => (model as any).createCollection)
                .map(async (model) => model.createCollection()),
        );
    });
}
