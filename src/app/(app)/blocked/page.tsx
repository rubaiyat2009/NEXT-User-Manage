import AppContent from '@/app/(app)/_components/AppContent';
import BlockNotificationDialog from './_components/BlockNotificationDialog';

export default async function Page() {
    return (
        <AppContent breadcrumbs={['Blocked']}>
            <BlockNotificationDialog />
        </AppContent>
    );
}
