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
        ExceptionTimeSlot: true;
    }
}

export type IExceptionTimeSlot = InferSchemaType<typeof ExceptionTimeSlotSchema> & {
    created_at?: Date;
    updated_at?: Date;
};

export type LeanExceptionTimeSlot = Require_id<FlattenMaps<IExceptionTimeSlot>>;

const ExceptionTimeSlotSchema = new Schema(
    {
       Manage: {
            type: Schema.Types.ObjectId,
            ref: 'Depot',
            required: true,
        },
        start_datetime: {
            type: Date,
            required: true,
        },
        end_datetime: {
            type: Date,
            required: true,
        },
        announcement: {
            type: String,
            trim: true,
            default: '',
        },
    } as const,
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    } as const,
);

declare global {
    namespace Abilities {
        export interface SubjectMapping {
            ExceptionTimeSlot: IExceptionTimeSlot;
        }
    }
}

if (models?.ExceptionTimeSlot) deleteModel('ExceptionTimeSlot');

export const ExceptionTimeSlot = model('ExceptionTimeSlot', ExceptionTimeSlotSchema);
