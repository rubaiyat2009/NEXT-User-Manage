import {
    deleteModel,
    FilterQuery,
    FlattenMaps,
    HydratedDocument,
    InferSchemaType,
    Model,
    model,
    models,
    QueryWithHelpers,
    Require_id,
    Schema,
    SessionOption,
    Types,
    UnpackedIntersection,
} from 'mongoose';
import { LeanShipper } from '@/app/_models/Shipper';
import { IDepot, LeanDepot } from '@/app/_models/Depot';
import { IOperationTimeSlot, LeanOperationTimeSlot } from '@/app/_models/OperationTimeSlot';
import { IExceptionTimeSlot, LeanExceptionTimeSlot } from '@/app/_models/ExceptionTimeSlot';
import { User, IUser, LeanUser } from '@/app/_models/User';
import { LeanPickupRequest } from '@/app/_models/PickupRequest';
import * as UserTypes from '@/app/_lib/UserTypes';
import * as ShippingLines from '@/app/_lib/ShippingLines';
import { LeanHaulier } from '@/app/_models/Haulier';
import { differenceWith, intersectionWith, map, partition } from 'lodash-es';
import assert from 'node:assert/strict';
import { MongoAbility } from '@casl/ability';
import { accessibleBy } from '@casl/mongoose';

declare module '@casl/mongoose' {
    interface RecordTypes {
        Booking: true;
        ImportBooking: true;
        ExportBooking: true;
    }
}

export type IBaseBooking = {
    booking_id: string;
    type: (typeof UserTypes.Values)[number];
   Manage: Types.ObjectId;
    viewed_hauliers: Record<string, Types.ObjectId>;
    created_at?: Date;
    updated_at?: Date;
};

type _LeanPopulated<PR extends IBaseBooking> = UnpackedIntersection<
    Require_id<FlattenMaps<PR>>,
    {
       Manage: UnpackedIntersection<
            LeanDepot,
            {
                operation_time_slot: LeanOperationTimeSlot;
                exception_time_slots: LeanExceptionTimeSlot[];
            }
        >;
        shipper?: LeanShipper;
        consignee?: LeanShipper;
        Users: UnpackedIntersection<
            LeanUser,
            {
                pickup_request: LeanPickupRequest;
            }
        >[];
        pickup_requests: UnpackedIntersection<
            LeanPickupRequest,
            {
                haulier: LeanHaulier;
            }
        >[];
    }
>;

type _HydratedDocument<PR extends IBaseBooking> = UnpackedIntersection<
    HydratedDocument<PR>,
    {
        Users: Types.DocumentArray<IUser>;
       Manage: UnpackedIntersection<
            HydratedDocument<IDepot>,
            {
                operation_time_slot: HydratedDocument<IOperationTimeSlot>;
                exception_time_slots: Types.DocumentArray<IExceptionTimeSlot>;
            }
        >;
    }
>;

interface QueryHelpers<PR extends IBaseBooking> {}

const BookingSchema = new Schema<
    IBooking,
    Model<IBooking, QueryHelpers<IBooking>>,
    {},
    QueryHelpers<IBooking>
>(
    {
        type: {
            type: String,
            required: true,
            enum: UserTypes.Values,
        },
       Manage: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Depot',
        },
        viewed_hauliers: {
            type: Map,
            of: Types.ObjectId,
            default: () => new Map(),
        },
        booking_id: {
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

interface BookingStatics {
    countBookingByVariantOnBehalf(
        ability: MongoAbility<[any, any]>,
        filter?: FilterQuery<IBooking>,
    ): Promise<[] | [{ importBookingCount: number; exportBookingCount: number }]>;
}

BookingSchema.static('countBookingByVariantOnBehalf', async function (
    ability,
    variant,
    filter = {},
) {
    return Booking.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            accessibleBy(ability, 'read').ImportBooking,
                            accessibleBy(ability, 'read').ExportBooking,
                        ],
                    },
                    filter,
                ],
            },
        },
        {
            $group: {
                _id: null,
                importBookingCount: {
                    $sum: {
                        $cond: {
                            if: {
                                $eq: ['$variant', 'IMPORT'],
                            },
                            then: 1,
                            else: 0,
                        },
                    },
                },
                exportBookingCount: {
                    $sum: {
                        $cond: {
                            if: {
                                $eq: ['$variant', 'EXPORT'],
                            },
                            then: 1,
                            else: 0,
                        },
                    },
                },
            },
        },
    ]);
} as BookingStatics['countBookingByVariantOnBehalf']);

interface QueryHelpers<PR extends IBaseBooking> {
    deepLeanPopulate<multi extends boolean = true>(): QueryWithHelpers<
        multi extends true ? _LeanPopulated<PR>[] : _LeanPopulated<PR> | null,
        _LeanPopulated<PR>,
        QueryHelpers<PR>
    >;
}

BookingSchema.query.deepLeanPopulate = function (
    this: QueryWithHelpers<any, HydratedDocument<any>, QueryHelpers<any>>,
) {
    return this.populate([
        {
            path: 'depot',
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
            path: 'pickup_requests',
            populate: [
                {
                    path: 'haulier',
                },
            ],
        },
        {
            path: 'Users',
            populate: [
                {
                    path: 'pickup_request',
                },
            ],
        },
    ]).lean() as any;
};

interface BookingStatics {
    countOnBehalf(
        ability: MongoAbility<[any, any]>,
        filter?: FilterQuery<IBooking>,
    ): Promise<number>;
}

BookingSchema.static('countOnBehalf', function (ability, filter = {}) {
    const _filter = {
        $and: [
            {
                $or: [
                    accessibleBy(ability, 'read').ImportBooking,
                    accessibleBy(ability, 'read').ExportBooking,
                ],
            },
            filter,
        ],
    };

    return Booking.countDocuments(_filter);
} as BookingStatics['countOnBehalf']);

interface QueryHelpers<PR extends IBaseBooking> {
    deepPopulate<multi extends boolean = true>(
        this: QueryWithHelpers<any, HydratedDocument<any>, QueryHelpers<any>>,
    ): QueryWithHelpers<
        multi extends true ? _HydratedDocument<PR>[] : _HydratedDocument<PR> | null,
        _HydratedDocument<PR>,
        QueryHelpers<PR>
    >;
}

BookingSchema.query.deepPopulate = function () {
    return this.populate([
        {
            path: 'Users',
        },
        {
            path: 'depot',
            populate: [
                {
                    path: 'operation_time_slot',
                },
                {
                    path: 'exception_time_slots',
                },
            ],
        },
    ]) as any;
};

BookingSchema.virtual('Users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'booking',
});

BookingSchema.virtual('pickup_requests', {
    ref: 'PickupRequest',
    localField: '_id',
    foreignField: 'booking',
});

declare global {
    namespace Abilities {
        export interface SubjectMapping {
            Booking: IBooking;
            ExportBooking: IExportBooking;
            ImportBooking: IImportBooking;
        }
    }
}

if (models?.Booking) deleteModel('Booking');

export const Booking = model<
    IBooking,
    Model<IBooking, QueryHelpers<IBooking>> & BookingStatics,
    QueryHelpers<IBooking>
>('Booking', BookingSchema);

const ExportBookingSchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: ['ACTIVE'],
        default: 'ACTIVE',
    },
    closing_date: {
        type: Date,
        required: true,
    },
    shipping_line: {
        type: String,
        enum: ShippingLines.Values,
    },
    remark: {
        type: String,
        default: '',
        trim: true,
    },
    variant: {
        type: String,
        required: true,
        enum: ['EXPORT'],
        default: 'EXPORT',
    },
    shipper: {
        type: Schema.Types.ObjectId,
        ref: 'Shipper',
    },
} as const);

interface ExportBookingMethods {
    saveUsers(
        this: HydratedDocument<any>,
        Users: Array<{ User_id: string; _id?: any }>,
        options?: SessionOption,
    ): Promise<void>;
}

ExportBookingSchema.method('saveUsers', async function (Users, options) {
    assert(
        !!this._id,
        "Booking doesn't have _id. Provide _id while creating new booking or save booking before saving Users",
    );

    const session = options?.session;

    if (!this.populated('Users')) {
        await this.populate('Users');
    }

    const [existingUserFormData, newUserFormData] = partition(Users, '_id' as any);

    const newUsers = newUserFormData.map(
        (User: any) =>
            new User({
                ...User,
                booking: this._id,
            }),
    );

    const removedUsersIds = map(
        differenceWith(
            this.Users,
            existingUserFormData,
            (left: any, right) => left.id === right._id,
        ),
        'id',
    );

    const updateUsers = intersectionWith(
        existingUserFormData,
        this.Users,
        (left, right: any) => left._id === right.id,
    ).map((UserFormData) => {
        const User = this.Users.find(
            (User: any) => User.id === UserFormData._id,
        )!;
        User.User_id = UserFormData.User_id;
        return User.save({ session });
    });

    await Promise.all([
        (function () {
            if (!newUsers.length) return;
            return User.insertMany(newUsers, { session });
        })(),
        (function () {
            if (!removedUsersIds.length) return;
            return User.deleteMany({ _id: { $in: removedUsersIds } }, { session });
        })(),
        ...updateUsers,
    ]);
} as ExportBookingMethods['saveUsers']);

export type IExportBooking = IBaseBooking & InferSchemaType<typeof ExportBookingSchema>;

export type LeanExportBooking = Require_id<FlattenMaps<IExportBooking>>;

if (models?.ExportBooking) deleteModel('ExportBooking');

export const ExportBooking = Booking.discriminator<
    IExportBooking,
    Model<IExportBooking, QueryHelpers<IExportBooking>, ExportBookingMethods>
>('ExportBooking', ExportBookingSchema);

const ImportBookingSchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: ['DROPPED_OFF'],
        default: 'DROPPED_OFF',
    },
    variant: {
        type: String,
        required: true,
        enum: ['IMPORT'],
        default: 'IMPORT',
    },
    consignee: {
        type: Schema.Types.ObjectId,
        ref: 'Shipper',
        required: true,
    },
    shipping_line: {
        type: String,
        enum: ShippingLines.Values,
        required: true,
    },
});

interface ImportBookingMethods {
    saveUsers(
        this: HydratedDocument<any>,
        Users: Array<{ User_id: string; _id?: any }>,
        options?: SessionOption,
    ): Promise<void>;
}

ImportBookingSchema.method('saveUsers', async function (Users, options) {
    assert(
        !!this._id,
        "Booking doesn't have _id. Provide _id while creating new booking or save booking before saving Users",
    );

    const session = options?.session;

    if (!this.populated('Users')) {
        await this.populate('Users');
    }

    const [existingUserFormData, newUserFormData] = partition(Users, '_id' as any);

    const newUsers = newUserFormData.map(
        (User: any) =>
            new User({
                ...User,
                booking: this._id,
                pickup_request: this._id,
            }),
    );

    const removedUsersIds = map(
        differenceWith(
            this.Users,
            existingUserFormData,
            (left: any, right) => left.id === right._id,
        ),
        'id',
    );

    const updateUsers = intersectionWith(
        existingUserFormData,
        this.Users,
        (left, right: any) => left._id === right.id,
    ).map((UserFormData) => {
        const User = this.Users.find(
            (User: any) => User.id === UserFormData._id,
        )!;
        User.User_id = UserFormData.User_id;
        User.pickup_request = this._id;
        return User.save({ session });
    });

    await Promise.all([
        (function () {
            if (!newUsers.length) return;
            return User.insertMany(newUsers, { session });
        })(),
        (function () {
            if (!removedUsersIds.length) return;
            return User.deleteMany({ _id: { $in: removedUsersIds } }, { session });
        })(),
        ...updateUsers,
    ]);
} as ImportBookingMethods['saveUsers']);

export type IImportBooking = IBaseBooking & InferSchemaType<typeof ImportBookingSchema>;

export type LeanImportBooking = Require_id<FlattenMaps<IImportBooking>>;

if (models?.ImportBooking) deleteModel('ImportBooking');

export const ImportBooking = Booking.discriminator<
    IImportBooking,
    Model<IImportBooking, QueryHelpers<IImportBooking>, ImportBookingMethods>
>('ImportBooking', ImportBookingSchema);

export type IBooking = IExportBooking | IImportBooking;

export type LeanBooking = LeanExportBooking | LeanImportBooking;

export type LeanPopulatedBooking = _LeanPopulated<LeanBooking>;
