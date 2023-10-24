'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/app/_lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { cva, VariantProps } from 'class-variance-authority';

const checkbox = cva(
    [
        'peer',
        'h-4',
        'w-4',
        'shrink-0',
        'bg-white',
        'rounded',
        'border',
        'border-zinc-400',
        'text-primary',
        'ring-offset-background',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
        'disabled:text-zinc-400',
    ],
    {
        variants: {
            invalid: {
                true: ['!text-destructive', '!border-destructive'],
            },
        },
    },
);

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkbox>
>(({ className, invalid, ...props }, ref) => (
    <CheckboxPrimitive.Root ref={ref} className={checkbox({ className, invalid })} {...props}>
        <CheckboxPrimitive.Indicator
            className={cn('flex', 'items-center', 'justify-center', 'text-current')}
        >
            <FontAwesomeIcon icon={faSquare} size="sm" fixedWidth />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
