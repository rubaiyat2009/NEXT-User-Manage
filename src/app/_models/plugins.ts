import { CallbackWithoutResultAndOptionalError, plugin, Query, SaveOptions } from 'mongoose';
import { ForbiddenError, MongoAbility } from '@casl/ability';
import { ObjectId } from 'mongodb';

declare module 'mongoose' {
    interface SaveOptions {
        userAbilities?: MongoAbility<[any, any]>;
    }

    interface QueryOptions<DocType = unknown> extends PopulateOption, SessionOption {
        userAbilities?: MongoAbility<[any, any]>;
    }
}

plugin((schema) => {
    schema.pre('save', checkUserAbilities);
    schema.pre('find', castToObjectId);
    schema.pre('findOne', castToObjectId);
});

/**
 * Check user abilities before saving document.
 *
 * @param next
 * @param options
 */
function checkUserAbilities(
    this: any,
    next: CallbackWithoutResultAndOptionalError,
    options: SaveOptions,
) {
    try {
        if (!options?.userAbilities) {
            next();
            return;
        }

        const userAbilities = options.userAbilities;

        if (this.isNew) {
            ForbiddenError.from(userAbilities).throwUnlessCan('create', this);
            next();
            return;
        }

        const modifiedFields: string[] = this.modifiedPaths({ includeChildren: true });

        modifiedFields.forEach((field) => {
            ForbiddenError.from(userAbilities).throwUnlessCan('update', this, field);
        });

        next();
    } catch (e: any) {
        next(e);
    }
}

function castToObjectId(this: Query<any, any>, next: CallbackWithoutResultAndOptionalError) {
    function toObjectId(value?: Record<string, any> | Record<string, any>[] | null) {
        if (Array.isArray(value)) {
            value.forEach((item) => toObjectId(item));
        } else if (typeof value === 'object') {
            Object.keys(value ?? {}).forEach((key) => {
                if (Array.isArray(value?.[key])) {
                    toObjectId(value?.[key]);
                } else if (typeof value?.[key] === 'string' && ObjectId.isValid(value?.[key])) {
                    value[key] = new ObjectId(value[key]);
                }
            });
        }
    }

    try {
        toObjectId(this.getQuery());
        next();
    } catch (e: any) {
        next(e);
    }
}
