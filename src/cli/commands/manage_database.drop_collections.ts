import { mongoosify } from '@/cli/utils';
import { confirm } from '@inquirer/prompts';
import { connection } from 'mongoose';

export default async function command() {
    const result = await confirm({
        message: 'Drop all collections?',
    });

    if (!result) return;

    await mongoosify(async () => {
        const collections = await connection.db.collections();
        await Promise.all(collections.map((collection) => collection.drop()));
    });
}
