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
        Haulier: true;
    }
}

const HaulierSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
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

HaulierSchema.virtual('admin', {
    justOne: true,
    ref: 'User',
    localField: '_id',
    foreignField: 'haulier',
});

export type IHaulier = InferSchemaType<typeof HaulierSchema> & {
    created_at?: Date;
    updated_at?: Date;
};

export type LeanHaulier = Require_id<FlattenMaps<IHaulier>>;

declare global {
    namespace Abilities {
        export interface SubjectMapping {
            Haulier: IHaulier;
        }
    }
}

if (models?.Haulier) deleteModel('Haulier');

export const Haulier = model('Haulier', HaulierSchema);
