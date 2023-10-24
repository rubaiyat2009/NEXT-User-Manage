import { model, models, Schema } from 'mongoose';

const KeySchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        hashed_password: String,
    } as const,
    { _id: false },
);

export const Key = models?.Key ?? model('Key', KeySchema);
