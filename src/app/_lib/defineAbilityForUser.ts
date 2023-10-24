import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { memoize } from 'lodash-es';
import { IUser } from '@/app/_models';

const defineAbilityForUser = memoize((user?: IUser | null | undefined) => {
    const { can, build } = new AbilityBuilder<
        MongoAbility<[Abilities.Actions, Abilities.Subjects]>
    >(createMongoAbility);

    if (!!user) {
        switch (user.role) {
            case 'SuperAdmin': {
                can(['supervise', 'update', 'delete', 'read'], 'PickupRequest');
                can(['supervise', 'update', 'delete', 'read'], 'ImportBooking');
                can(['supervise', 'update', 'delete', 'read'], 'ExportBooking');
                can('manage', 'HaulierAdmin', { role: 'HaulierAdmin' });
                can('manage', 'SuperAdmin', { role: 'SuperAdmin' });
                can('manage', 'DepotAdmin', { role: 'DepotAdmin' });
                can('manage', 'Shipper');
                can('manage', 'Depot');
                can('manage', 'Haulier');
                can(['supervise', 'read', 'delete'], 'Driver', { role: 'Driver' });
                can(
                    'update',
                    'Driver',
                    [
                        'plate_no',
                        'last_name',
                        'telephone',
                        'first_name',
                        'truck_id',
                        'updated_at',
                        'password',
                        'disabled',
                    ],
                    { role: 'Driver' },
                );
                can('read', 'OperationTimeSlot');
                can('read', 'ExceptionTimeSlot');
                break;
            }
            case 'DepotAdmin': {
                can('manage', 'DepotAdmin', {
                   Manage: user.depot._id,
                    role: 'DepotAdmin',
                });
                can('manage', 'DepotAdmin', {
                    'depot._id': user.depot._id,
                    role: 'DepotAdmin',
                });
                can('manage', 'ImportBooking', {
                   Manage: user.depot._id,
                    variant: 'IMPORT',
                });
                can('manage', 'ImportBooking', {
                    'depot._id': user.depot._id,
                    variant: 'IMPORT',
                });
                can('manage', 'ExportBooking', {
                   Manage: user.depot._id,
                    variant: 'EXPORT',
                });
                can('manage', 'ExportBooking', {
                    'depot._id': user.depot._id,
                    variant: 'EXPORT',
                });
                can('read', 'Shipper', ['_id', 'name']);
                can('read', 'Haulier', ['_id', 'name']);
                can('manage', 'OperationTimeSlot', { _id: user.depot._id });
                can('manage', 'ExceptionTimeSlot', {Manage: user.depot._id });
                can('manage', 'ExceptionTimeSlot', { 'depot._id': user.depot._id });
                can(['supervise', 'read'], 'ScheduledPickupRequest', {
                   Manage: user.depot._id,
                    status: 'SCHEDULED',
                });
                can(['supervise', 'read'], 'ScheduledPickupRequest', {
                    'depot._id': user.depot._id,
                    status: 'SCHEDULED',
                });
                can(['supervise', 'read', 'create'], 'RescheduledPickupRequest', {
                   Manage: user.depot._id,
                    status: 'RESCHEDULED',
                });
                can(['supervise', 'read', 'create'], 'RescheduledPickupRequest', {
                    'depot._id': user.depot._id,
                    status: 'RESCHEDULED',
                });
                can(['supervise', 'read', 'create'], 'ArrivedPickupRequest', {
                   Manage: user.depot._id,
                    status: 'ARRIVED',
                });
                can(['supervise', 'read', 'create'], 'ArrivedPickupRequest', {
                    'depot._id': user.depot._id,
                    status: 'ARRIVED',
                });
                can(['supervise', 'read', 'create'], 'ReleasedPickupRequest', {
                   Manage: user.depot._id,
                    status: 'RELEASED',
                });
                can(['supervise', 'read', 'create'], 'ReleasedPickupRequest', {
                    'depot._id': user.depot._id,
                    status: 'RELEASED',
                });
                can(['supervise', 'read', 'create'], 'DroppedOffPickupRequest', {
                    'depot._id': user.depot._id,
                    status: 'DROPPED_OFF',
                });
                can(['supervise', 'read', 'create'], 'DroppedOffPickupRequest', {
                   Manage: user.depot._id,
                    status: 'DROPPED_OFF',
                });
                can(['supervise', 'read', 'create'], 'InvoicedPickupRequest', {
                   Manage: user.depot._id,
                    status: 'INVOICED',
                });
                can(['supervise', 'read', 'create'], 'InvoicedPickupRequest', {
                    'depot._id': user.depot._id,
                    status: 'INVOICED',
                });
                can(['supervise', 'read', 'create'], 'CompletedPickupRequest', {
                   Manage: user.depot._id,
                    status: 'COMPLETED',
                });
                can(['supervise', 'read', 'create'], 'CompletedPickupRequest', {
                    'depot._id': user.depot._id,
                    status: 'COMPLETED',
                });
                can(['supervise', 'read', 'create'], 'ReturnedPickupRequest', {
                   Manage: user.depot._id,
                    status: 'RETURNED',
                });
                can(['supervise', 'read', 'create'], 'ReturnedPickupRequest', {
                    'depot._id': user.depot._id,
                    status: 'RETURNED',
                });
                can(['supervise', 'read', 'create', 'update'], 'Invoice');
                break;
            }
            case 'HaulierAdmin': {
                can('manage', 'Shipper');
                can('manage', 'HaulierAdmin', {
                    haulier: user.haulier._id,
                    role: 'HaulierAdmin',
                });
                can('manage', 'HaulierAdmin', {
                    'haulier._id': user.haulier._id,
                    role: 'HaulierAdmin',
                });
                can(['supervise', 'read', 'delete', 'create'], 'Driver', {
                    'haulier._id': user.haulier._id,
                    role: 'Driver',
                });
                can(['supervise', 'read', 'delete', 'create'], 'Driver', {
                    haulier: user.haulier._id,
                    role: 'Driver',
                });
                can(['supervise', 'read'], 'ExportBooking', {
                    [`viewed_hauliers.${[user.haulier._id]}`]: user.haulier._id,
                    variant: 'EXPORT',
                });
                can(['supervise', 'read'], 'ImportBooking', {
                    [`viewed_hauliers.${[user.haulier._id]}`]: user.haulier._id,
                    variant: 'IMPORT',
                });
                can(
                    'update',
                    'Driver',
                    [
                        'plate_no',
                        'last_name',
                        'telephone',
                        'first_name',
                        'truck_id',
                        'updated_at',
                        'password',
                        'disabled',
                    ],
                    {
                        haulier: user.haulier._id,
                        role: 'Driver',
                    },
                );
                can(
                    'update',
                    'Driver',
                    [
                        'plate_no',
                        'last_name',
                        'telephone',
                        'first_name',
                        'truck_id',
                        'updated_at',
                        'password',
                    ],
                    {
                        'haulier._id': user.haulier._id,
                        role: 'Driver',
                    },
                );
                can('read', 'Shipper', ['_id', 'name']);
                can('read', 'Depot');
                can('manage', 'ScheduledPickupRequest', {
                    haulier: user.haulier._id,
                    status: 'SCHEDULED',
                });
                can('manage', 'ScheduledPickupRequest', {
                    'haulier._id': user.haulier._id,
                    status: 'SCHEDULED',
                });
                can(['supervise', 'read', 'update', 'delete'], 'RescheduledPickupRequest', {
                    haulier: user.haulier._id,
                    status: 'RESCHEDULED',
                });
                can(['supervise', 'read', 'update', 'delete'], 'RescheduledPickupRequest', {
                    'haulier._id': user.haulier._id,
                    status: 'RESCHEDULED',
                });
                can(['supervise', 'read'], 'ArrivedPickupRequest', {
                    haulier: user.haulier._id,
                    status: 'ARRIVED',
                });
                can(['supervise', 'read'], 'ArrivedPickupRequest', {
                    'haulier._id': user.haulier._id,
                    status: 'ARRIVED',
                });
                can(['supervise', 'read'], 'ReleasedPickupRequest', {
                    haulier: user.haulier._id,
                    status: 'RELEASED',
                });
                can(['supervise', 'read'], 'ReleasedPickupRequest', {
                    'haulier._id': user.haulier._id,
                    status: 'RELEASED',
                });
                can(['supervise', 'read'], 'InvoicedPickupRequest', {
                    haulier: user.haulier._id,
                    status: 'INVOICED',
                });
                can(['supervise', 'read'], 'InvoicedPickupRequest', {
                    'haulier._id': user.haulier._id,
                    status: 'INVOICED',
                });
                can(['supervise', 'read'], 'CompletedPickupRequest', {
                    haulier: user.haulier._id,
                    status: 'COMPLETED',
                });
                can(['supervise', 'read'], 'CompletedPickupRequest', {
                    'haulier._id': user.haulier._id,
                    status: 'COMPLETED',
                });
                can(['supervise', 'read'], 'ReturnedPickupRequest', {
                    haulier: user.haulier._id,
                    status: 'RETURNED',
                });
                can(['supervise', 'read'], 'ReturnedPickupRequest', {
                    'haulier._id': user.haulier._id,
                    status: 'RETURNED',
                });
                can(['supervise', 'read'], 'DroppedOffPickupRequest', {
                    haulier: user.haulier._id,
                    status: 'DROPPED_OFF',
                });
                can(['supervise', 'read'], 'DroppedOffPickupRequest', {
                    'haulier._id': user.haulier._id,
                    status: 'DROPPED_OFF',
                });
                can('read', 'OperationTimeSlot');
                can('read', 'ExceptionTimeSlot');
                break;
            }
            case 'Driver': {
                can(['supervise', 'read'], 'ScheduledPickupRequest', {
                    driver: user.id,
                    status: 'SCHEDULED',
                });
                can(['supervise', 'read'], 'ScheduledPickupRequest', {
                    'driver._id': user.id,
                    status: 'SCHEDULED',
                });
                can(['supervise', 'read'], 'RescheduledPickupRequest', {
                    driver: user.id,
                    status: 'RESCHEDULED',
                });
                can(['supervise', 'read'], 'RescheduledPickupRequest', {
                    'driver._id': user.id,
                    status: 'RESCHEDULED',
                });
                can(['supervise', 'read'], 'ArrivedPickupRequest', {
                    driver: user.id,
                    status: 'ARRIVED',
                });
                can(['supervise', 'read'], 'ArrivedPickupRequest', {
                    'driver._id': user.id,
                    status: 'ARRIVED',
                });
                can(['supervise', 'read'], 'ReleasedPickupRequest', {
                    driver: user.id,
                    status: 'RELEASED',
                });
                can(['supervise', 'read'], 'ReleasedPickupRequest', {
                    'driver._id': user.id,
                    status: 'RELEASED',
                });
                can('read', 'OperationTimeSlot');
                can('read', 'ExceptionTimeSlot');
                break;
            }
        }
    } else {
        can('create', 'HaulierAdmin', { role: 'HaulierAdmin' });
    }

    return build({
        detectSubjectType: (object: any) => {
            return object.role ?? object.__t ?? object.constructor?.modelName;
        },
    });
});

export default defineAbilityForUser;
