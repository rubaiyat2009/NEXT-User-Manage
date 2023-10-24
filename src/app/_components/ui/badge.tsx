import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/app/_lib/utils';

const badgeVariants = cva(
    'whitespace-nowrap inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                outline: 'text-foreground',
                ACTIVE: 'text-amber-400 border-transparent bg-amber-100 hover:bg-amber-100/80',
                SCHEDULED: 'text-blue-400 border-transparent bg-blue-100 hover:bg-blue-100/80',
                RESCHEDULED: 'text-blue-400 border-transparent bg-blue-100 hover:bg-blue-100/80',
                IMPORTED: 'text-blue-400 border-transparent bg-blue-100 hover:bg-blue-100/80',
                RELEASED: 'text-green-600 border-transparent bg-green-100 hover:bg-green-100/80',
                DROPPED_OFF: 'text-blue-400 border-transparent bg-blue-100 hover:bg-blue-100/80',
                INVOICED: 'text-green-600 border-transparent bg-green-100 hover:bg-green-100/80',
                ARRIVED: 'text-blue-400 border-transparent bg-blue-100 hover:bg-blue-100/80',
                COMPLETED: 'text-green-600 border-transparent bg-green-100 hover:bg-green-100/80',
                RETURNED: 'text-green-600 border-transparent bg-green-100 hover:bg-green-100/80',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
