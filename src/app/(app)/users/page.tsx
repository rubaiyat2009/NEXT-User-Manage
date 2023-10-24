import { LeanUser, User } from '@/app/_models';
import UserTable from '@/app/(app)/users/_components/UserTable';
import { accessibleBy } from '@casl/mongoose';
import defineAbilityForUser from '@/app/_lib/defineAbilityForUser';
import { getSession } from '@/app/_lib/sessions';
import { notFound } from 'next/navigation';
import { fromURLSearchParams } from '@/app/_lib/search';
import { every } from 'lodash-es';
import ControlledRemoveUserDialog from '@/app/(app)/users/_components/ControlledRemoveUserDialog';
import AppContent from '@/app/(app)/_components/AppContent';
import ControlledUpdateUserDialog from './_components/ControlledUpdateUserDialog';
import { Metadata } from 'next';

export type PageProps = {
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: PageProps) {
    const session = await getSession();

    const ability = defineAbilityForUser(session?.user);

    const nonAllowed = every([
        ability.cannot('supervise', 'DepotAdmin'),
        ability.cannot('supervise', 'HaulierAdmin'),
        ability.cannot('supervise', 'SuperAdmin'),
    ]);

    if (nonAllowed) {
        notFound();
    }

    const q = fromURLSearchParams(searchParams);

    const filter = {
        $and: [
            q.filter,
            ...(session?.user?.role === 'SuperAdmin'
                ? [
                      {
                          role: { $ne: 'Driver' },
                      },
                  ]
                : [
                      {
                          $or: [
                              accessibleBy(ability, 'read').DepotAdmin,
                              accessibleBy(ability, 'read').HaulierAdmin,
                              accessibleBy(ability, 'read').SuperAdmin,
                          ],
                      },
                  ]),
        ],
    };

    const [users, total] = await Promise.all([
        User.find(filter).sort(q.sort).limit(q.limit).skip(q.skip).lean<LeanUser[]>(),
        User.countDocuments(filter),
    ]);

    return (
        <AppContent breadcrumbs={['Manage users']}>
            <UserTable users={users} q={q} total={total} />
            <ControlledRemoveUserDialog />
            <ControlledUpdateUserDialog />
        </AppContent>
    );
}

export const metadata: Metadata = {
    title: 'KarbonX :: Manage users',
    description: 'Manage users',
};
