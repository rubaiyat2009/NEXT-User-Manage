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
        Shipper: true;
    }
}

declare global {
    namespace Abilities {
        export interface SubjectMapping {
            Shipper: IShipper;
        }
    }
}

const ShipperSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        telephone: {
            type: String,
            required: true,
            trim: true,
        },
    } as const,
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    } as const,
);

export type IShipper = InferSchemaType<typeof ShipperSchema> & {
    created_at?: Date;
    updated_at?: Date;
};

export type LeanShipper = Require_id<FlattenMaps<IShipper>>;

if (models?.Shipper) deleteModel('Shipper');

export const Shipper = model<IShipper>('Shipper', ShipperSchema);
