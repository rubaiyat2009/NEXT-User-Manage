import { ReactNode } from 'react';
import AuthLayout from '@/app/(auth)/_components/AuthLayout';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/_lib/sessions';
import { cn } from '@/app/_lib/utils';
import * as Fonts from '@/app/_lib/Fonts';
import { Toaster } from '@/app/_components/ui/toaster';
import { TooltipProvider } from '@/app/_components/ui/tooltip';

export type LayoutProps = {
    children: ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
    const session = await getSession();

    if (session?.user?.email_verified) redirect('/overview');

    return (
        <html lang="en" className={cn(Fonts.inter.variable, 'antialiased')}>
            <body>
                <TooltipProvider>
                    <AuthLayout>{children}</AuthLayout>
                    <Toaster />
                </TooltipProvider>
            </body>
        </html>
    );
}
