import {
    deleteModel,
    FlattenMaps,
    InferSchemaType,
    model,
    models,
    Require_id,
    Schema,
} from 'mongoose';

declare module '@casl/mongoose' {
    interface RecordTypes {
        User: true;
    }
}

const UserSchema = new Schema(
    {
        User_id: {
            type: String,
            default: '',
            trim: true,
        },
        pickup_request: {
            type: Schema.Types.ObjectId,
            ref: 'PickupRequest',
        },
        booking: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
    } as const,
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    } as const,
);

export type IUser = InferSchemaType<typeof UserSchema> & {
    created_at?: Date;
    updated_at?: Date;
};

export type LeanUser = Require_id<FlattenMaps<IUser>>;

declare global {
    namespace Abilities {
        export interface SubjectMapping {
            User: IUser;
        }
    }
}

if (models?.User) deleteModel('User');

export const User = model('User', UserSchema);
