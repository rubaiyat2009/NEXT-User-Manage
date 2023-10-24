'use client';

import { cn } from '@/app/_lib/utils';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Button } from '@/app/_components/ui/button';
import { cva } from 'class-variance-authority';
import { usePathname } from 'next/navigation';
import { Can, useAbilities } from '@/app/_components/Ability';
import { some } from 'lodash-es';
import { signOut } from '@/app/_actions/signOut';

export type NavigationsProps = {};

export default function Navigations({}: NavigationsProps) {
    const pathname = usePathname();

    const abilities = useAbilities();

    return (
        <nav>
            <ul className={cn('flex', 'flex-col', 'items-stretch')}>
                <Link
                    href="/overview"
                    className={link({
                        active: pathname.startsWith('/overview'),
                    })}
                >
                    <i
                        className={cn(
                            'fi',
                            'fi-rr-layout-fluid',
                            'text-base',
                            'translate-y-0.5',
                            'translate-x-0.5',
                        )}
                    />
                    <span>Overview</span>
                </Link>

                {some([
                    abilities.can('supervise', 'ExportBooking'),
                    abilities.can('supervise', 'ImportBooking'),
                ]) ? (
                    <Link
                        href="/bookings"
                        className={link({
                            active: pathname.startsWith('/bookings'),
                        })}
                    >
                        <i
                            className={cn(
                                'fi',
                                'fi-rr-calendar-pen',
                                'text-base',
                                'translate-y-0.5',
                                'translate-x-0.5',
                            )}
                        />
                        <span>Bookings</span>
                    </Link>
                ) : null}

                {some([
                    abilities.can('supervise', 'ScheduledPickupRequest'),
                    abilities.can('supervise', 'RescheduledPickupRequest'),
                    abilities.can('supervise', 'ArrivedPickupRequest'),
                    abilities.can('supervise', 'ReleasedPickupRequest'),
                    abilities.can('supervise', 'InvoicedPickupRequest'),
                    abilities.can('supervise', 'CompletedPickupRequest'),
                    abilities.can('supervise', 'ReturnedPickupRequest'),
                ]) ? (
                    <Link
                        href="/pickup-requests"
                        className={link({
                            active: pathname.startsWith('/pickup-requests'),
                        })}
                    >
                        <i
                            className={cn(
                                'fi',
                                'fi-rr-hand-paper',
                                'text-base',
                                'translate-y-0.5',
                                'translate-x-0.5',
                            )}
                        />
                        <span>Pickup requests</span>
                    </Link>
                ) : null}

                <Can I="supervise" a="Invoice">
                    <Link
                        href="/invoicing"
                        className={link({
                            active: pathname.startsWith('/invoicing'),
                        })}
                    >
                        <i
                            className={cn(
                                'fi',
                                'fi-rs-receipt',
                                'text-base',
                                'translate-y-0.5',
                                'translate-x-0.5',
                            )}
                        />
                        <span>Invoicing</span>
                    </Link>
                </Can>
                {some([
                    abilities.can('supervise', 'SuperAdmin'),
                    abilities.can('supervise', 'HaulierAdmin'),
                    abilities.can('supervise', 'DepotAdmin'),
                ]) ? (
                    <Link
                        href="/users"
                        className={link({
                            active: pathname.startsWith('/users'),
                        })}
                    >
                        <FontAwesomeIcon
                            icon={faUser}
                            className={cn('text-base', 'translate-x-0.5')}
                        />
                        <span>Users</span>
                    </Link>
                ) : null}

                <Can I="supervise" a="Driver">
                    <Link
                        href="/drivers"
                        className={link({
                            active: pathname.startsWith('/drivers'),
                        })}
                    >
                        <i
                            className={cn(
                                'fi',
                                'fi-ss-steering-wheel',
                                'text-base',
                                'translate-y-0.5',
                                'translate-x-0.5',
                            )}
                        />
                        <span>Drivers</span>
                    </Link>
                </Can>

                <Can I="supervise" a="Shipper">
                    <Link
                        href="/shippers"
                        className={link({
                            active: pathname.startsWith('/shippers'),
                        })}
                    >
                        <i
                            className={cn(
                                'fi',
                                'fi-rs-truck-side',
                                'text-base',
                                'translate-y-0.5',
                                'translate-x-0.5',
                            )}
                        />
                        <span>Shippers/Consignee</span>
                    </Link>
                </Can>

                <Can I="supervise" a="OperationTimeSlot">
                    <Link
                        href="/time-slots"
                        className={link({
                            active: pathname.startsWith('/time-slots'),
                        })}
                    >
                        <i
                            className={cn(
                                'fi',
                                'fi-rs-calendar',
                                'text-base',
                                'translate-y-0.5',
                                'translate-x-0.5',
                            )}
                        />
                        <span>Time slots</span>
                    </Link>
                </Can>

                <Button
                    onClick={() => signOut()}
                    className={cn(
                        'flex',
                        'items-center',
                        'gap-x-6',
                        'h-fit',
                        '[&>span]:rounded-none',
                        '[&>span]:text-primary-foreground',
                        '[&>span]:text-sm',
                        '[&>span]:font-normal',
                        '[&>span]:cursor-pointer',
                        '[&>span]:hover:bg-sky-700',
                        '[&>span]:gap-x-7',
                        '[&>span]:flex',
                        '[&>span]:items-center',
                        '[&>span]:justify-start',
                        '[&>span]:!py-4',
                        '[&>span]:px-6',
                    )}
                >
                    <i
                        className={cn(
                            'fi',
                            'fi-rr-sign-out-alt',
                            'text-base',
                            'translate-y-0.5',
                            'translate-x-0.5',
                        )}
                    />
                    <span>Logout</span>
                </Button>
            </ul>
        </nav>
    );
}

const link = cva(
    [
        'text-primary-foreground',
        'text-sm',
        'font-normal',
        'cursor-pointer',
        'hover:bg-sky-700',
        'gap-x-7',
        'flex',
        'items-center',
        'justify-start',
        '!py-4',
        'px-6',
        'whitespace-nowrap',
    ],
    {
        variants: {
            active: {
                true: ['bg-sky-700'],
            },
        },
    },
);
