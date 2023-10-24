import 'lucia/polyfill/node';
import {
    deleteModel,
    FlattenMaps,
    HydratedDocument,
    InferSchemaType,
    Model,
    model,
    models,
    Require_id,
    Schema,
} from 'mongoose';
import { ForbiddenError, MongoAbility } from '@casl/ability';
import * as z from 'zod';
import { zodValidator } from '@/app/_lib/Models';
import { lucia } from 'lucia';
import { nextjs } from 'lucia/middleware';
import { mongoose } from '@lucia-auth/adapter-mongoose';
import { isPlainObject, memoize } from 'lodash-es';
import { ObjectId } from 'mongodb';

declare module '@casl/mongoose' {
    interface RecordTypes {
        User: true;
        Driver: true;
        HaulierAdmin: true;
        SuperAdmin: true;
       ManageAdmin: true;
    }
}

function objectIdToString(
    value?: Record<string, any> | Array<Record<string, any>> | null,
): Record<string, any> {
    if (Array.isArray(value)) {
        return value.map((item) => objectIdToString(item));
    } else if (typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value ?? {}).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return [key, value.map(objectIdToString)];
                } else if (isPlainObject(value)) {
                    return [key, objectIdToString(value)];
                } else if (value instanceof ObjectId && key === '_id') {
                    return [key, value.toString()];
                } else if (value instanceof ObjectId) {
                    return [key, { _id: value.toString() }];
                }
                return [key, value];
            }),
        );
    } else {
        return value ?? {};
    }
}

const auth = memoize(() => {
    return lucia({
        env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
        middleware: nextjs(),
        adapter: mongoose({
            Key: model('Key') as any,
            Session: model('Session') as any,
            User: model('User') as any,
        }),
        sessionCookie: {
            expires: false,
        },
        getUserAttributes: (attributes) => ({
            ...(objectIdToString(attributes) as any),
            __t: attributes.role,
        }),
        getSessionAttributes: (attributes) => ({
            ...(attributes as any),
        }),
    });
});

export type Auth = ReturnType<typeof auth>;

declare global {
    namespace Abilities {
        export interface SubjectMapping {
            Driver: IDriver;
            HaulierAdmin: IHaulierAdmin;
            SuperAdmin: ISuperAdmin;
           ManageAdmin: IDepotAdmin;
        }
    }
}

type UserMethods = {
    createOnBehalf(userAbilities: MongoAbility<[any, any]> | null, password: string): Promise<void>;
    auth(): Auth;
};

const UserSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate: zodValidator(z.string().email().trim().toLowerCase()),
        },
        email_verified: {
            type: Boolean,
            required: true,
            default: false,
        },
        first_name: {
            type: String,
            required: true,
            trim: true,
            validate: zodValidator(z.string().trim().min(1).max(100)),
        },
        last_name: {
            type: String,
            required: true,
            trim: true,
            validate: zodValidator(z.string().trim().min(1).max(100)),
        },
        telephone: {
            type: String,
            required: true,
            trim: true,
            validate: zodValidator(z.string().trim().min(6).max(100).regex(/\d+/)),
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    } as const,
    {
        _id: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        discriminatorKey: 'role',
        methods: {
            /**
             * Create a user on behalf of another user.
             *
             * @param userAbilities
             * @param password
             */

            async createOnBehalf(
                this: HydratedDocument<any>,
                userAbilities: MongoAbility<[any, any]> | null,
                password: string,
            ) {
                if (userAbilities) {
                    ForbiddenError.from(userAbilities).throwUnlessCan('create', this);
                }
                return await auth().createUser({
                    key: {
                        password,
                        providerId: 'email',
                        providerUserId: this.email,
                    },
                    attributes: this.toObject(),
                });
            },
            async resetPassword(providerId: string, providerUserId: string, password: string) {
                await auth().updateKeyPassword(providerId, providerUserId, password);
            },
            async invalidAllSession(user_id: string) {
                await auth().invalidateAllUserSessions(user_id);
            },
        },
        statics: {
            auth,
        },
    },
);

export type IBaseUser = InferSchemaType<typeof UserSchema> & {
    created_at?: Date;
    updated_at?: Date;
    id: string;
};

if (models?.User) deleteModel('User');

export const User = model('User', UserSchema);

if (models?.HaulierAdmin) deleteModel('HaulierAdmin');

const HaulierAdminSchema = new Schema({
    haulier: {
        ref: 'Haulier',
        type: Schema.Types.ObjectId,
        required: true,
    },
} as const);

export type IHaulierAdmin = InferSchemaType<typeof HaulierAdminSchema> &
    IBaseUser & {
        role: 'HaulierAdmin';
    };

export type LeanHaulierAdmin = Require_id<FlattenMaps<IHaulierAdmin>>;

export const HaulierAdmin = User.discriminator<
    IHaulierAdmin,
    Model<IHaulierAdmin, {}, UserMethods>
>('HaulierAdmin', HaulierAdminSchema);

if (models?.DepotAdmin) deleteModel('DepotAdmin');

constManageAdminSchema = new Schema({
   Manage: {
        ref: 'Depot',
        type: Schema.Types.ObjectId,
        required: true,
    },
} as const);

export type IDepotAdmin = InferSchemaType<typeofManageAdminSchema> &
    IBaseUser & {
        role: 'DepotAdmin';
    };

export type LeanDepotAdmin = Require_id<FlattenMaps<IDepotAdmin>>;

export constManageAdmin = User.discriminator<IDepotAdmin, Model<IDepotAdmin, {}, UserMethods>>(
    'DepotAdmin',
   ManageAdminSchema,
);

if (models?.SuperAdmin) deleteModel('SuperAdmin');

const SuperAdminSchema = new Schema({} as const);

export type ISuperAdmin = InferSchemaType<typeof SuperAdminSchema> &
    IBaseUser & {
        role: 'SuperAdmin';
    };

export type LeanSuperAdmin = Require_id<FlattenMaps<ISuperAdmin>>;

export const SuperAdmin = User.discriminator<ISuperAdmin, Model<ISuperAdmin, {}, UserMethods>>(
    'SuperAdmin',
    SuperAdminSchema,
);

if (models?.Driver) deleteModel('Driver');

const DriverSchema = new Schema({
    haulier: {
        ref: 'Haulier',
        type: Schema.Types.ObjectId,
        required: true,
    },
} as const);

export type IDriver = InferSchemaType<typeof DriverSchema> &
    IBaseUser & {
        role: 'Driver';
    };

export type LeanDriver = Require_id<FlattenMaps<IDriver>>;

export const Driver = User.discriminator<IDriver, Model<IDriver, {}, UserMethods>>(
    'Driver',
    DriverSchema,
);

export type IUser =
    | Require_id<IDriver>
    | Require_id<ISuperAdmin>
    | Require_id<IDepotAdmin>
    | Require_id<IHaulierAdmin>;

export type LeanUser = LeanDriver | LeanSuperAdmin | LeanDepotAdmin | LeanHaulierAdmin;
