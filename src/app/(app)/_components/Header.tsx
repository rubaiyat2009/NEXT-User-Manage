'use client';

import { cn } from '@/app/_lib/utils';
import { Button } from '@/app/_components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import {
    Sheet,
    SheetOverlay,
    SheetPortal,
    SheetTrigger,
    sheetVariants,
} from '@/app/_components/ui/sheet';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import Navigations, { NavigationsProps } from '@/app/(app)/_components/Navigations';
import { ReactNode, useMemo } from 'react';
import { flatten, range, zip } from 'lodash-es';

export type HeaderProps = NavigationsProps & {
    breadcrumbs: string[];
    rightSection?: ReactNode;
    className?: string;
    notification?: ReactNode;
};

export default function Header({
    breadcrumbs,
    rightSection,
    className,
    notification,
}: HeaderProps) {
    const nodes = useMemo(() => {
        const nodes = range(breadcrumbs.length - 1).map((index) => (
            <FontAwesomeIcon key={index} icon={faChevronRight} size="sm" />
        ));

        return flatten(
            zip(
                breadcrumbs.map((breadcrumb, index) => (
                    <span className={cn('first:!block', 'truncate')} key={breadcrumb + index}>
                        {breadcrumb}
                    </span>
                )),
                nodes,
            ),
        );
    }, [breadcrumbs]);

    return (
        <div>
            <div className={cn('bg-white', 'flex', 'items-center', 'px-3', className)}>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="link" className={cn('md:hidden')}>
                            <FontAwesomeIcon icon={faBars} size="xl" />
                        </Button>
                    </SheetTrigger>

                    <SheetPortal>
                        <SheetOverlay />
                        <SheetPrimitive.Content
                            className={cn(
                                sheetVariants({
                                    side: 'left',
                                }),
                                'bg-primary',
                                'px-0',
                                'data-[state=open]:max-w-[300px]',
                            )}
                        >
                            <SheetPrimitive.Close className={cn('px-6', 'my-6')}>
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    size="xl"
                                    className={cn('text-primary-foreground')}
                                />
                                <span className="sr-only">Close</span>
                            </SheetPrimitive.Close>
                            <Navigations />
                        </SheetPrimitive.Content>
                    </SheetPortal>
                </Sheet>
                <div className={cn('flex', 'justify-between', 'items-center', 'flex-auto')}>
                    <div
                        className={cn(
                            'text-primary',
                            'text-xl',
                            'md:text-2xl',
                            'font-semibold',
                            'my-7',
                            'md:ml-10',
                            'ml-3',
                            'gap-x-2',
                            'flex',
                            'items-center',
                            '[&>*]:!hidden',
                            'sm:[&>*]:!block',
                        )}
                    >
                        {nodes}
                    </div>
                    <div>{rightSection}</div>
                </div>
            </div>
            {notification}
        </div>
    );
}
