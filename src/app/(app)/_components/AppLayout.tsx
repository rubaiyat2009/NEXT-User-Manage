'use client';
import { cn } from '@/app/_lib/utils';
import NextImage from 'next/image';
import brand from '@/app/_assets/brand.png';
import { ReactNode, useEffect } from 'react';
import { Button } from '@/app/_components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import Navigations, { NavigationsProps } from '@/app/(app)/_components/Navigations';
import { usePathname, useRouter } from 'next/navigation';

export type SidebarProps = {
    children?: ReactNode;
    session?: any;
} & NavigationsProps;

export default function AppLayout({ children, session }: SidebarProps) {
    const { push } = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (session?.user?.disabled && pathname !== '/blocked') {
            push('/blocked');
        }
        if (!session?.user?.disabled && pathname === '/blocked') {
            push('/');
        }
    }, [session?.user?.disabled, pathname, push]);
    return (
        <div>
            <input type="checkbox" className={cn('hidden', 'peer')} id="sidebar" />
            <div
                className={cn(
                    'grid',
                    'transition-all',
                    'grid-cols-[0px_100vw]',
                    'grid-rows-[80px_1fr]',
                    'md:grid-cols-[220px_calc(100vw-220px)]',
                    'md:peer-checked:grid-cols-[65px_calc(100vw-65px)]',
                    'md:peer-checked:[&_[alt=brand]]:hidden',
                    'md:peer-checked:[&_[data-icon=caret-left]]:hidden',
                    'md:peer-checked:[&_[data-icon=bars]]:!block',
                )}
            >
                <div
                    className={cn(
                        'sticky',
                        'top-0',
                        'self-start',
                        'md:min-h-screen',
                        'bg-primary',
                        'overflow-x-hidden',
                        'row-span-full',
                    )}
                >
                    <div
                        className={cn(
                            'mt-12',
                            'mb-16',
                            'mx-auto',
                            'flex',
                            'items-center',
                            'justify-between',
                        )}
                    >
                        <NextImage
                            src={brand}
                            alt="brand"
                            className={cn('w-28', 'flex-none', 'ml-6')}
                            priority
                        />
                        <Button className={cn('mx-3')} size="icon" asChild>
                            <label htmlFor="sidebar">
                                <FontAwesomeIcon icon={faCaretLeft} className={cn('text-white')} />
                                <FontAwesomeIcon
                                    icon={faBars}
                                    className={cn('text-white', '!hidden')}
                                />
                            </label>
                        </Button>
                    </div>

                    <Navigations />
                </div>

                {children}
            </div>
        </div>
    );
}
