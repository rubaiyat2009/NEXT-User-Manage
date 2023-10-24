import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/_lib/sessions';
import AppLayout from '@/app/(app)/_components/AppLayout';
import { ProvideAbility } from '@/app/_components/Ability';
import { cn } from '@/app/_lib/utils';
import { Toaster } from '@/app/_components/ui/toaster';
import * as Fonts from '@/app/_lib/Fonts';
import { TooltipProvider } from '@/app/_components/ui/tooltip';
import ConfirmDialog from '@/app/_components/ConfirmDialog';
import ControlledPickupRequestDialog from '@/app/(app)/_components/ControlledPickupRequestDialog';
import QueryClientProvider from '@/app/_components/QueryClientProvider';
import ControlledBookingDialog from '@/app/(app)/bookings/_components/ControlledBookingDialog';
import ControlledShipperDialog from './shippers/_components/ControlledShipperDialog';

export type LayoutProps = PropsWithChildren;

export default async function Layout({ children }: LayoutProps) {
    const session = await getSession();

    if (!session) {
        redirect('/sign-in');
    }
    if (!session.user.email_verified) redirect('/verify-email');
    return (
        <html lang="en" className={cn(Fonts.inter.variable, 'antialiased', 'bg-muted')}>
            <body>
                <Toaster />
                <QueryClientProvider>
                    <TooltipProvider>
                        <ProvideAbility user={session.user}>
                            <AppLayout session={session}>
                                <ControlledPickupRequestDialog />
                                <ControlledBookingDialog />
                                <ControlledShipperDialog />
                                {children}
                            </AppLayout>
                        </ProvideAbility>
                        <ConfirmDialog />
                    </TooltipProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
