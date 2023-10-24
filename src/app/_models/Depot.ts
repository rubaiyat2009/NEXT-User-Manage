import {
    deleteModel,
    FlattenMaps,
    InferSchemaType,
    Model,
    model,
    models,
    Require_id,
    Schema,
    SessionOption,
} from 'mongoose';
import { LeanOperationTimeSlot, LeanTimeSlot } from '@/app/_models/OperationTimeSlot';
import { accessibleBy } from '@casl/mongoose';
import { MongoAbility } from '@casl/ability';
import { LeanExceptionTimeSlot } from '@/app/_models/ExceptionTimeSlot';
import { PickupRequest } from '@/app/_models/PickupRequest';
import { DateTime } from 'luxon';

declare module '@casl/mongoose' {
    interface RecordTypes {
       Manage: true;
    }
}

constManageSchema = new Schema(
    {
        name: {
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

DepotSchema.virtual('operation_time_slot', {
    ref: 'OperationTimeSlot',
    localField: '_id',
    foreignField: '_id',
    justOne: true,
});

DepotSchema.virtual('exception_time_slots', {
    ref: 'ExceptionTimeSlot',
    localField: '_id',
    foreignField: 'depot',
});

DepotSchema.static(
    'findOperationCapacity',
    async function (
        _id: any,
        date: Date,
        time_zone: string,
        options?: SessionOption & { userAbilities?: MongoAbility<[any, any]> | null },
    ) {
        let filter: object = {
            _id,
        };

        if (options?.userAbilities) {
            filter = {
                $and: [accessibleBy(options.userAbilities, 'read').Depot, filter],
            };
        }

        constManage = awaitManage.findOne(filter, undefined, { session: options?.session })
            .populate<{ exception_time_slots: LeanExceptionTimeSlot[] }>('exception_time_slots')
            .populate<{ operation_time_slot: LeanOperationTimeSlot }>('operation_time_slot')
            .lean()
            .orFail();

        const day = DateTime.fromJSDate(date).setZone(time_zone).weekdayLong!.toLowerCase() as
            | 'monday'
            | 'tuesday'
            | 'wednesday'
            | 'thursday'
            | 'friday'
            | 'saturday'
            | 'sunday';

        const timeSlot =Manage.operation_time_slot?.[day] ?? [];

        if (timeSlot.length === 0) {
            return timeSlot.map((timeslot) => {
                return {
                    ...timeslot,
                    capacity: timeslot.max_capacity,
                };
            });
        }

        const pipelines = [
            {
                $facet: Object.fromEntries(
                    timeSlot.map((timeslot) => [
                        timeslot._id,
                        [
                            {
                                $match: {
                                    pickup_start_datetime: {
                                        $gte: DateTime.fromFormat(timeslot.start_time, 'HH:mmZ')
                                            .set({
                                                year: date.getFullYear(),
                                                month: date.getMonth() + 1,
                                                day: date.getDate(),
                                            })
                                            .toJSON(),
                                        $lt: DateTime.fromFormat(timeslot.end_time, 'HH:mmZ')
                                            .set({
                                                year: date.getFullYear(),
                                                month: date.getMonth() + 1,
                                                day: date.getDate(),
                                            })
                                            .toJSON(),
                                    },
                                    status: 'SCHEDULED',
                                },
                            },
                            {
                                $count: 'count',
                            },
                            {
                                $project: {
                                    capacity: {
                                        $subtract: [timeslot.max_capacity, '$count'],
                                    },
                                },
                            },
                        ],
                    ]),
                ),
            },
        ];

        const [mappedCapacities] = (await PickupRequest.aggregate(pipelines)) as [
            Record<string, [{ capacity: number }]>,
        ];

        return timeSlot.map((timeslot) => {
            return {
                ...timeslot,
                capacity:
                    mappedCapacities[timeslot._id as any]?.[0]?.capacity ?? timeslot.max_capacity,
            };
        });
    },
);

export type IDepot = InferSchemaType<typeofManageSchema> & {
    created_at?: Date;
    updated_at?: Date;
};

export type LeanDepot = Require_id<FlattenMaps<IDepot>>;

declare global {
    namespace Abilities {
        export interface SubjectMapping {
           Manage: IDepot;
        }
    }
}

if (models?.Depot) deleteModel('Depot');

export constManage = model<
    InferSchemaType<typeofManageSchema>,
    Model<InferSchemaType<typeofManageSchema>> & {
        findOperationCapacity: (
            _id: any,
            date: Date,
            time_zone: string,
            options?: SessionOption & { userAbilities?: MongoAbility<[any, any]> | null },
        ) => Promise<(LeanTimeSlot & { capacity: number })[]>;
    }
>('Depot',ManageSchema);
