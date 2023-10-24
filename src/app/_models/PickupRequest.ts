import {
    deleteModel,
    FilterQuery,
    FlattenMaps,
    HydratedDocument,
    InferSchemaType,
    Model,
    model,
    models,
    QueryOptions,
    QueryWithHelpers,
    Require_id,
    Schema,
    Types,
    UnpackedIntersection,
} from 'mongoose';
import * as z from 'zod';
import { zodValidator } from '@/app/_lib/Models';
import { IBooking, LeanBooking } from '@/app/_models/Booking';
import { IDepot, LeanDepot } from '@/app/_models/Depot';
import { IOperationTimeSlot, LeanOperationTimeSlot } from '@/app/_models/OperationTimeSlot';
import { IExceptionTimeSlot, LeanExceptionTimeSlot } from '@/app/_models/ExceptionTimeSlot';
import { IUser, LeanUser } from '@/app/_models/User';
import { LeanShipper } from '@/app/_models/Shipper';
import { LeanDriver, LeanHaulierAdmin } from '@/app/_models/User';
import { LeanHaulier } from '@/app/_models/Haulier';
import { MongoAbility } from '@casl/ability';
import { accessibleBy } from '@casl/mongoose';

declare module '@casl/mongoose' {
    interface RecordTypes {
        PickupRequest: true;
        ScheduledPickupRequest: true;
        RescheduledPickupRequest: true;
        ArrivedPickupRequest: true;
        ReleasedPickupRequest: true;
        DroppedOffPickupRequest: true;
        InvoicedPickupRequest: true;
        CompletedPickupRequest: true;
        ReturnedPickupRequest: true;
    }
}

export type IBasePickupRequest = {
    booking: Types.ObjectId;
    haulier: Types.ObjectId;
   Manage: Types.ObjectId;
    plate_no: string;
    created_at?: Date;
    updated_at?: Date;
};

type _LeanPopulated<PR extends IBasePickupRequest> = UnpackedIntersection<
    Require_id<FlattenMaps<PR>>,
    {
        booking: UnpackedIntersection<
            LeanBooking,
            {
                shipper?: LeanShipper;
                consignee?: LeanShipper;
               Manage: UnpackedIntersection<
                    LeanDepot,
                    {
                        operation_time_slot: LeanOperationTimeSlot;
                        exception_time_slots: LeanExceptionTimeSlot[];
                    }
                >;
                Users: UnpackedIntersection<
                    LeanUser,
                    {
                        pickup_request?: LeanPickupRequest;
                    }
                >[];
            }
        >;
        Users: LeanUser[];
        driver: LeanDriver;
        haulier: UnpackedIntersection<
            LeanHaulier,
            {
                admin: LeanHaulierAdmin;
            }
        >;
       Manage: LeanDepot;
    }
>;

type _HydratedDocument<PR extends IBasePickupRequest> = UnpackedIntersection<
    HydratedDocument<PR>,
    {
        booking: UnpackedIntersection<
            HydratedDocument<IBooking>,
            {
               Manage: UnpackedIntersection<
                    HydratedDocument<IDepot>,
                    {
                        operation_time_slot: HydratedDocument<IOperationTimeSlot>;
                        exception_time_slots: Types.DocumentArray<IExceptionTimeSlot>;
                    }
                >;
            }
        >;
        Users: HydratedDocument<IUser>[];
    }
>;

interface QueryHelpers<PR extends IBasePickupRequest> {}

const PickupRequestSchema = new Schema<
    IPickupRequest,
    Model<IPickupRequest, QueryHelpers<IPickupRequest>>,
    {},
    QueryHelpers<IPickupRequest>
>(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        haulier: {
            type: Schema.Types.ObjectId,
            ref: 'Haulier',
            required: true,
        },
       Manage: {
            type: Schema.Types.ObjectId,
            ref: 'Depot',
            required: true,
        },
        plate_no: {
            type: String,
            required: true,
            validate: zodValidator(z.string().min(1).max(20)),
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

PickupRequestSchema.virtual('Users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'pickup_request',
});

interface QueryHelpers<PR extends IBasePickupRequest> {
    deepLeanPopulate<multi extends boolean = true>(
        this: QueryWithHelpers<any, HydratedDocument<any>, QueryHelpers<any>>,
    ): QueryWithHelpers<
        multi extends true ? _LeanPopulated<PR>[] : _LeanPopulated<PR> | null,
        _LeanPopulated<PR>,
        QueryHelpers<PR>
    >;
}

PickupRequestSchema.query.deepLeanPopulate = function () {
    return this.populate({
        path: 'booking',
        populate: [
            {
                path: 'shipper',
                select: ['name', '_id'],
                strictPopulate: false,
            },
            {
                path: 'consignee',
                select: ['name', '_id'],
                strictPopulate: false,
            },
            {
                path: 'depot',
                select: ['name', '_id'],
                populate: [
                    {
                        path: 'operation_time_slot',
                    },
                    {
                        path: 'exception_time_slots',
                    },
                ],
            },
            {
                path: 'Users',
                select: ['_id', 'User_id'],
                populate: {
                    path: 'pickup_request',
                    select: ['_id'],
                },
                options: {
                    sort: {
                        _id: 'asc',
                    },
                },
            },
        ],
    })
        .populate({
            path: 'Users',
            select: ['_id', 'User_id'],
            options: {
                sort: {
                    _id: 'asc',
                },
            },
        })
        .populate({
            path: 'driver',
            select: ['_id', 'first_name', 'last_name'],
        })
        .populate({
            path: 'haulier',
            select: ['_id', 'name'],
            populate: {
                path: 'admin',
                select: ['_id', 'first_name', 'last_name', 'email', 'telephone'],
            },
        })
        .populate({
            path: 'depot',
        })
        .lean() as any;
};

interface QueryHelpers<PR extends IBasePickupRequest> {
    deepPopulate<multi extends boolean = true>(
        this: QueryWithHelpers<any, HydratedDocument<any>, QueryHelpers<any>>,
    ): QueryWithHelpers<
        multi extends true ? _HydratedDocument<PR>[] : _HydratedDocument<PR> | null,
        _HydratedDocument<PR>,
        QueryHelpers<PR>
    >;
}

PickupRequestSchema.query.deepPopulate = function () {
    return this.populate([
        {
            path: 'booking',
            populate: {
                path: 'depot',
                select: ['name', '_id'],
                populate: [
                    {
                        path: 'operation_time_slot',
                    },
                    {
                        path: 'exception_time_slots',
                    },
                ],
            },
        },
        {
            path: 'Users',
        },
    ]) as any;
};

interface PickupRequestStatics {
    countOnBehalf(
        ability: MongoAbility<[any, any]>,
        filter?: FilterQuery<IPickupRequest>,
    ): Promise<number>;
}

PickupRequestSchema.static('countOnBehalf', function (ability, filter = {}) {
    const _filter = {
        $and: [
            {
                $or: [
                    accessibleBy(ability, 'read').ScheduledPickupRequest,
                    accessibleBy(ability, 'read').RescheduledPickupRequest,
                    accessibleBy(ability, 'read').ArrivedPickupRequest,
                    accessibleBy(ability, 'read').ReleasedPickupRequest,
                    accessibleBy(ability, 'read').InvoicedPickupRequest,
                    accessibleBy(ability, 'read').CompletedPickupRequest,
                    accessibleBy(ability, 'read').ReturnedPickupRequest,
                    accessibleBy(ability, 'read').DroppedOffPickupRequest,
                ],
            },
            filter,
        ],
    };

    return PickupRequest.countDocuments(_filter);
} as PickupRequestStatics['countOnBehalf']);

declare global {
    export namespace Abilities {
        export interface SubjectMapping {
            PickupRequest: IPickupRequest;
            ScheduledPickupRequest: IScheduledPickupRequest;
            RescheduledPickupRequest: IRescheduledPickupRequest;
            ArrivedPickupRequest: IArrivedPickupRequest;
            ReleasedPickupRequest: IReleasedPickupRequest;
            DroppedOffPickupRequest: IDroppedOffPickupRequest;
            InvoicedPickupRequest: IInvoicedPickupRequest;
            CompletedPickupRequest: ICompletedPickupRequest;
            ReturnedPickupRequest: IReturnedPickupRequest;
        }
    }
}

if (models?.PickupRequest) deleteModel('PickupRequest');

export const PickupRequest = model<
    IPickupRequest,
    Model<IPickupRequest, QueryHelpers<IPickupRequest>> & PickupRequestStatics,
    QueryHelpers<IPickupRequest>
>('PickupRequest', PickupRequestSchema);

const ScheduledPickupRequestSchema = new Schema({
    pickup_start_datetime: {
        type: Date,
        required: true,
    },
    pickup_end_datetime: {
        type: Date,
        required: true,
    },
    driver: {
        type: String,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['SCHEDULED'],
        required: true,
        default: 'SCHEDULED',
    },
    scheduled_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
} as const);

interface ScheduledPickupRequestMethods {
    reschedule(
        this: HydratedDocument<IScheduledPickupRequest>,
        formData?: { rescheduled_at?: Date; reschedule_reason?: string },
        options?: QueryOptions<any>,
    ): Promise<HydratedDocument<IRescheduledPickupRequest>>;
}

ScheduledPickupRequestSchema.method('reschedule', function (
    { rescheduled_at = new Date(), reschedule_reason } = {},
    options?,
) {
    return ScheduledPickupRequest.findOneAndUpdate(
        { _id: this._id },
        {
            rescheduled_at,
            reschedule_reason,
            __t: 'RescheduledPickupRequest',
            status: 'RESCHEDULED',
        },
        { ...options, overwriteDiscriminatorKey: true, new: true },
    );
} as ScheduledPickupRequestMethods['reschedule']);

export type IScheduledPickupRequest = IBasePickupRequest &
    InferSchemaType<typeof ScheduledPickupRequestSchema>;

export type LeanScheduledPickupRequest = Require_id<FlattenMaps<IScheduledPickupRequest>>;

if (models?.ScheduledPickupRequest) deleteModel('ScheduledPickupRequest');

export const ScheduledPickupRequest = PickupRequest.discriminator<
    IScheduledPickupRequest,
    Model<
        IScheduledPickupRequest,
        QueryHelpers<IScheduledPickupRequest>,
        ScheduledPickupRequestMethods
    >
>('ScheduledPickupRequest', ScheduledPickupRequestSchema);

const RescheduledPickupRequestSchema = new Schema({
    driver: {
        type: String,
        ref: 'User',
        required: true,
    },
    pickup_start_datetime: {
        type: Date,
        required: true,
    },
    pickup_end_datetime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['RESCHEDULED'],
        required: true,
    },
    reschedule_reason: {
        type: String,
        default: '',
    },
    rescheduled_at: {
        type: Date,
        default: () => new Date(),
    },
    scheduled_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
} as const);

export type IRescheduledPickupRequest = IBasePickupRequest &
    InferSchemaType<typeof RescheduledPickupRequestSchema>;

export type LeanRescheduledPickupRequest = Require_id<FlattenMaps<IRescheduledPickupRequest>>;

if (models?.RescheduledPickupRequest) deleteModel('RescheduledPickupRequest');

export const RescheduledPickupRequest = PickupRequest.discriminator<
    IRescheduledPickupRequest,
    Model<IRescheduledPickupRequest, QueryHelpers<IRescheduledPickupRequest>>
>('RescheduledPickupRequest', RescheduledPickupRequestSchema);

const ArrivedPickupRequestSchema = new Schema({
    driver: {
        type: String,
        ref: 'User',
        required: true,
    },
    pickup_start_datetime: {
        type: Date,
        required: true,
    },
    pickup_end_datetime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['ARRIVED'],
        required: true,
    },
    arrived_at: {
        type: Date,
        default: () => new Date(),
    },
    scheduled_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
} as const);

export type IArrivedPickupRequest = IBasePickupRequest &
    InferSchemaType<typeof ArrivedPickupRequestSchema>;

export type LeanArrivedPickupRequest = Require_id<FlattenMaps<IArrivedPickupRequest>>;

if (models?.ArrivedPickupRequest) deleteModel('ArrivedPickupRequest');

export const ArrivedPickupRequest = PickupRequest.discriminator<
    IArrivedPickupRequest,
    Model<IArrivedPickupRequest, QueryHelpers<IArrivedPickupRequest>>
>('ArrivedPickupRequest', ArrivedPickupRequestSchema);

const ReleasedPickupRequestSchema = new Schema({
    driver: {
        type: String,
        ref: 'User',
        required: true,
    },
    pickup_start_datetime: {
        type: Date,
        required: true,
    },
    pickup_end_datetime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['RELEASED'],
        required: true,
    },
    arrived_at: {
        type: Date,
        default: () => new Date(),
    },
    scheduled_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    released_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
} as const);

export type IReleasedPickupRequest = IBasePickupRequest &
    InferSchemaType<typeof ReleasedPickupRequestSchema>;

export type LeanReleasedPickupRequest = Require_id<FlattenMaps<IReleasedPickupRequest>>;

if (models?.ReleasedPickupRequest) deleteModel('ReleasedPickupRequest');

export const ReleasedPickupRequest = PickupRequest.discriminator<
    IReleasedPickupRequest,
    Model<IReleasedPickupRequest, QueryHelpers<IReleasedPickupRequest>>
>('ReleasedPickupRequest', ReleasedPickupRequestSchema);

const InvoicedPickupRequestSchema = new Schema({
    driver: {
        type: String,
        ref: 'User',
        required: true,
    },
    pickup_start_datetime: {
        type: Date,
        required: true,
    },
    pickup_end_datetime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['INVOICED'],
        required: true,
    },
    arrived_at: {
        type: Date,
        default: () => new Date(),
    },
    scheduled_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    released_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    invoiced_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
} as const);

export type IInvoicedPickupRequest = IBasePickupRequest &
    InferSchemaType<typeof InvoicedPickupRequestSchema>;

export type LeanInvoicedPickupRequest = Require_id<FlattenMaps<IInvoicedPickupRequest>>;

if (models?.InvoicedPickupRequest) deleteModel('InvoicedPickupRequest');

export const InvoicedPickupRequest = PickupRequest.discriminator<
    IInvoicedPickupRequest,
    Model<IInvoicedPickupRequest, QueryHelpers<IInvoicedPickupRequest>>
>('InvoicedPickupRequest', InvoicedPickupRequestSchema);

const CompletedPickupRequestSchema = new Schema({
    driver: {
        type: String,
        ref: 'User',
        required: true,
    },
    pickup_start_datetime: {
        type: Date,
        required: true,
    },
    pickup_end_datetime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['COMPLETED'],
        required: true,
    },
    arrived_at: {
        type: Date,
        default: () => new Date(),
    },
    scheduled_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    released_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    invoiced_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    completed_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
} as const);

export type ICompletedPickupRequest = IBasePickupRequest &
    InferSchemaType<typeof CompletedPickupRequestSchema>;

export type LeanCompletedPickupRequest = Require_id<FlattenMaps<ICompletedPickupRequest>>;

if (models?.CompletedPickupRequest) deleteModel('CompletedPickupRequest');

export const CompletedPickupRequest = PickupRequest.discriminator<
    ICompletedPickupRequest,
    Model<ICompletedPickupRequest, QueryHelpers<ICompletedPickupRequest>>
>('CompletedPickupRequest', CompletedPickupRequestSchema);

const ReturnedPickupRequestSchema = new Schema({
    driver: {
        type: String,
        ref: 'User',
        required: true,
    },
    pickup_start_datetime: {
        type: Date,
        required: true,
    },
    pickup_end_datetime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['RETURNED'],
        required: true,
    },
    arrived_at: {
        type: Date,
        default: () => new Date(),
    },
    scheduled_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    released_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    invoiced_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    completed_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    returned_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
} as const);

export type IReturnedPickupRequest = IBasePickupRequest &
    InferSchemaType<typeof ReturnedPickupRequestSchema>;

export type LeanReturnedPickupRequest = Require_id<FlattenMaps<IReturnedPickupRequest>>;

if (models?.ReturnedPickupRequest) deleteModel('ReturnedPickupRequest');

export const ReturnedPickupRequest = PickupRequest.discriminator<
    IReturnedPickupRequest,
    Model<IReturnedPickupRequest, QueryHelpers<IReturnedPickupRequest>>
>('ReturnedPickupRequest', ReturnedPickupRequestSchema);

const DroppedOffPickupRequestSchema = new Schema({
    status: {
        type: String,
        enum: ['DROPPED_OFF'],
        required: true,
        default: 'DROPPED_OFF',
    },
    pickup_start_datetime: {
        type: Date,
        default: () => new Date(),
        required: true,
    },
    dropped_off_at: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
} as const);

export type IDroppedOffPickupRequest = IBasePickupRequest &
    InferSchemaType<typeof DroppedOffPickupRequestSchema>;

export type LeanDroppedOffPickupRequest = Require_id<FlattenMaps<IDroppedOffPickupRequest>>;

if (models?.DroppedOffPickupRequest) deleteModel('DroppedOffPickupRequest');

export const DroppedOffPickupRequest = PickupRequest.discriminator<
    IDroppedOffPickupRequest,
    Model<IDroppedOffPickupRequest, QueryHelpers<IDroppedOffPickupRequest>>
>('DroppedOffPickupRequest', DroppedOffPickupRequestSchema);

export type IPickupRequest =
    | Require_id<IScheduledPickupRequest>
    | Require_id<IRescheduledPickupRequest>
    | Require_id<IArrivedPickupRequest>
    | Require_id<IReleasedPickupRequest>
    | Require_id<IInvoicedPickupRequest>
    | Require_id<ICompletedPickupRequest>
    | Require_id<IReturnedPickupRequest>
    | Require_id<IDroppedOffPickupRequest>;

export type LeanPickupRequest =
    | LeanScheduledPickupRequest
    | LeanRescheduledPickupRequest
    | LeanArrivedPickupRequest
    | LeanReleasedPickupRequest
    | LeanDroppedOffPickupRequest
    | LeanInvoicedPickupRequest
    | LeanCompletedPickupRequest
    | LeanReturnedPickupRequest;

export type LeanPopulatedPickupRequest = _LeanPopulated<LeanPickupRequest>;
