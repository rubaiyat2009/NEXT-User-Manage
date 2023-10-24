'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/_lib/utils';

const labelVariants = cva(['text-neutral-700', 'font-semibold', 'leading-normal', 'text-sm'], {
    variants: {
        disabled: {
            true: ['cursor-not-allowed', 'opacity-70'],
        },
        invalid: {
            true: ['text-destructive'],
        },
    },
});

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, disabled, invalid, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants({ disabled, invalid }), className)}
        {...props}
    />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
