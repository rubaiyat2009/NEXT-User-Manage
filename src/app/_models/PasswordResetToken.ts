import { model, models, Schema } from 'mongoose';

const PasswordResetTokenSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    expires: {
        type: Number,
        required: true,
    },
} as const);

export const PasswordResetToken =
    models?.PasswordResetToken ?? model('PasswordResetToken', PasswordResetTokenSchema);
