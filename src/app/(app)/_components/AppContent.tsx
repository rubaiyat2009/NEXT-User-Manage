import Header, { HeaderProps } from '@/app/(app)/_components/Header';
import { cn } from '@/app/_lib/utils';
import { PropsWithChildren } from 'react';

export type AppContentProps = PropsWithChildren<HeaderProps>;

export default function AppContent({
    children,
    breadcrumbs,
    rightSection,
    className,
    notification,
}: AppContentProps) {
    return (
        <>
            <Header
                breadcrumbs={breadcrumbs}
                rightSection={rightSection}
                notification={notification}
            />
            <div className={cn(notification ? 'py-12' : 'py-10')}>
                <div className={cn('User', className)}>{children}</div>
            </div>
        </>
    );
}
