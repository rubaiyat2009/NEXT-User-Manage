import {
    deleteModel,
    FlattenMaps,
    InferSchemaType,
    model,
    models,
    Require_id,
    Schema,
} from 'mongoose';
import { zodValidator } from '@/app/_lib/Models';
import { OperationTimeSlotSchema as _TimeSlotSchema } from '@/app/_schemas/SaveOperationTimeSlotsSchema';

declare module '@casl/mongoose' {
    interface RecordTypes {
        OperationTimeSlot: true;
    }
}

export type ITimeSlot = InferSchemaType<typeof TimeSlotSchema> & {
    created_at?: Date;
    updated_at?: Date;
    _id?: string;
};

export type LeanTimeSlot = Require_id<FlattenMaps<ITimeSlot>>;

export const TimeSlotSchema = new Schema(
    {
        start_time: {
            type: String,
            required: true,
            trim: true,
            validate: zodValidator(_TimeSlotSchema.shape.start_time),
        },
        end_time: {
            type: String,
            required: true,
            trim: true,
            validate: zodValidator(_TimeSlotSchema.shape.end_time),
        },
        max_capacity: {
            type: Number,
            min: 1,
            required: true,
            default: 1,
            validate: zodValidator(_TimeSlotSchema.shape.max_capacity),
        },
    } as const,
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    } as const,
);

export type IOperationTimeSlot = InferSchemaType<typeof OperationTimeSlotSchema> & {
    created_at?: Date;
    updated_at?: Date;
    _id?: string;
};

export type LeanOperationTimeSlot = Require_id<FlattenMaps<IOperationTimeSlot>>;

const OperationTimeSlotSchema = new Schema(
    {
        monday: {
            type: [TimeSlotSchema],
            default: () => [],
        },
        tuesday: {
            type: [TimeSlotSchema],
            default: () => [],
        },
        wednesday: {
            type: [TimeSlotSchema],
            default: () => [],
        },
        thursday: {
            type: [TimeSlotSchema],
            default: () => [],
        },
        friday: {
            type: [TimeSlotSchema],
            default: () => [],
        },
        saturday: {
            type: [TimeSlotSchema],
            default: () => [],
        },
        sunday: {
            type: [TimeSlotSchema],
            default: () => [],
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
            OperationTimeSlot: IOperationTimeSlot;
        }
    }
}

if (models?.OperationTimeSlot) deleteModel('OperationTimeSlot');

export const OperationTimeSlot = model('OperationTimeSlot', OperationTimeSlotSchema);
