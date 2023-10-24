import { model, models, Schema } from 'mongoose';

const EmailVerificationTokenSchema = new Schema({
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

export const EmailVerificationToken =
    models?.EmailVerificationToken ?? model('EmailVerificationToken', EmailVerificationTokenSchema);
