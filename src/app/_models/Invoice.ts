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
        Invoice: true;
    }
}

const InvoiceSchema = new Schema(
    {
        invoice_no: {
            type: String,
            required: true,
        },
        invoice_date: {
            type: Date,
            required: true,
        },
        due_date: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        pickup_requests: [
            {
                type: Schema.Types.ObjectId,
                ref: 'PickupRequest',
            },
        ],
        haulier: {
            type: Schema.Types.ObjectId,
            ref: 'Haulier',
        },
        Users: [
            {
                _id: Schema.Types.ObjectId,
                User_id: String,
            },
        ],
        remarks: String,
        status: {
            type: String,
            enum: ['INVOICED', 'COMPLETED'],
            default: 'INVOICED',
        },
    } as const,
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    } as const,
);

export type IInvoice = InferSchemaType<typeof InvoiceSchema> & {
    created_at?: Date;
    updated_at?: Date;
};

export type LeanInvoice = Require_id<FlattenMaps<IInvoice>>;

declare global {
    namespace Abilities {
        export interface SubjectMapping {
            Invoice: IInvoice;
        }
    }
}

if (models?.Invoice) deleteModel('Invoice');

export const Invoice = model('Invoice', InvoiceSchema);
