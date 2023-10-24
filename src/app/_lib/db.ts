import '@/app/_models';
import { connect as _connect, ConnectOptions } from 'mongoose';

declare global {
    var mongoose: {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null;
    };
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function db() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts: ConnectOptions = {
            bufferCommands: process.env.NODE_ENV === 'development',
            retryWrites: true,
        };

        cached.promise = _connect(process.env.MONGODB_URI!, opts);
    }

    try {
        cached.conn = await cached.promise;
        cached.conn.connection.on('error', (error) => {
            console.error('mongoose_error', error);
        });
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}
