'use client';

import { createContext, PropsWithChildren, ReactNode, useContext, useMemo } from 'react';
import { createContextualCan } from '@casl/react';
import { MongoAbility } from '@casl/ability';
import defineAbilityForUser from '@/app/_lib/defineAbilityForUser';
import type { IUser } from '@/app/_models';
import { permittedFieldsOf } from '@casl/ability/extra';
import { intersection, xor } from 'lodash-es';

export const AbilityContext = createContext<MongoAbility<[Abilities.Actions, Abilities.Subjects]>>(
    {} as any,
);

export const Can = createContextualCan(AbilityContext.Consumer);

export type ProvideAbilityProps = PropsWithChildren<{ user: IUser }>;

export function useAbilities() {
    return useContext(AbilityContext);
}

export function ProvideAbility({ children, user }: ProvideAbilityProps) {
    return (
        <AbilityContext.Provider value={defineAbilityForUser(user)}>
            {children}
        </AbilityContext.Provider>
    );
}

export type WithAbilitiesProps = {
    children: (ability: MongoAbility<[Abilities.Actions, Abilities.Subjects]>) => ReactNode;
};

export function WithAbilities({ children }: WithAbilitiesProps) {
    const abilities = useAbilities();

    return <>{children(abilities)}</>;
}

export type CanActProps = PropsWithChildren<{
    I: Abilities.Actions;
    this: Abilities.Subjects;
    fields: string[];
    exact?: boolean;
    not?: boolean;
}>;

/**
 * This component is used to conditionally render children based on the user's ability to act on a subject.
 *  - If the user can act on the subject, children will be rendered.
 *  - If the user cannot act on the subject, children will not be rendered.
 *
 *  If `not` is true, the logic is reversed.
 *
 *  If `exact` is true, the user must be able to act on all fields in `fields` for children to be rendered.
 *
 * @param I
 * @param _this
 * @param children
 * @param fields
 * @param exact
 * @param not
 * @constructor
 */
export function CanAct({ I, this: _this, children, fields, exact, not }: CanActProps) {
    const ability = useAbilities();

    const show = useMemo(() => {
        if (ability.cannot(I, _this)) return false;

        const permittedFields = permittedFieldsOf(ability, I, _this, {
            fieldsFrom: (rule) => rule.fields ?? [],
        });

        if (exact) return xor(permittedFields, fields).length === 0;

        if (permittedFields.length === 0) return true;

        return intersection(permittedFields, fields).length === fields.length;
    }, [ability, I, _this, fields, exact]);

    return show ? (not ? null : children) : not ? children : null;
}
