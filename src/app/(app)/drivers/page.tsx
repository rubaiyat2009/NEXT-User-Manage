import DriverTable from '@/app/(app)/drivers/_components/DriverTable';
import { Driver } from '@/app/_models';
import { getSession } from '@/app/_lib/sessions';
import { accessibleBy } from '@casl/mongoose';
import defineAbilityForUser from '@/app/_lib/defineAbilityForUser';
import { notFound } from 'next/navigation';
import { fromURLSearchParams } from '@/app/_lib/search';
import ControlledDriverDialog from '@/app/(app)/drivers/_components/ControlledDriverDialog';
import ControlledRemoveDriverDialog from '@/app/(app)/drivers/_components/ControlledRemoveDriverDialog';
import AppContent from '@/app/(app)/_components/AppContent';
import { Metadata } from 'next';

export type PageProps = {
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: PageProps) {
    const session = await getSession();

    const ability = defineAbilityForUser(session?.user);

    if (ability.cannot('supervise', 'Driver')) {
        notFound();
    }

    const q = fromURLSearchParams(searchParams);

    const filter = {
        $and: [accessibleBy(ability, 'read').Driver, q.filter],
    };

    const [drivers, total] = await Promise.all([
        Driver.find(filter).sort(q.sort).limit(q.limit).skip(q.skip).lean(),
        Driver.countDocuments(filter),
    ]);

    return (
        <AppContent breadcrumbs={['Manage drivers']}>
            <DriverTable drivers={drivers} q={q} total={total} />
            <ControlledDriverDialog />
            <ControlledRemoveDriverDialog />
        </AppContent>
    );
}

export const metadata: Metadata = {
    title: 'KarbonX :: Manage drivers',
    description: 'Manage drivers',
};
