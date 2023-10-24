import { InferSchemaType, model, models, Schema } from 'mongoose';

const SessionSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        active_expires: {
            type: Number,
            required: true,
        },
        idle_expires: {
            type: Number,
            required: true,
        },
    } as const,
    {
        _id: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    },
);

export type ISession = InferSchemaType<typeof SessionSchema> & {
    created_at?: Date;
    updated_at?: Date;
};

export const Session = models?.Session ?? model('Session', SessionSchema);
