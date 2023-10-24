import { connect, disconnect } from 'mongoose';

export async function mongoosify(fn: () => Promise<void>) {
    await connect(process.env.MONGODB_URI!, {
        bufferCommands: false,
    });

    try {
        await fn();
    } finally {
        await disconnect();
    }
}
