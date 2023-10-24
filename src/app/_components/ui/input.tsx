import * as React from 'react';
import { cn } from '@/app/_lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof input> {}

const input = cva(
    [
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
        'text-base',
        'font-normal',
        'ring-offset-background',
        'file:border-0',
        'file:bg-transparent',
        'file:text-base',
        'file:font-medium',
        'placeholder:text-muted-foreground',
        'placeholder:text-base',
        'placeholder:font-normal',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
        'disabled:bg-zinc-100',
        'appearance-none',
    ],
    {
        variants: {
            invalid: {
                true: [
                    'text-destructive',
                    'border-destructive',
                    'active:text-destructive',
                    'active:border-destructive',
                    'active:ring-destructive',
                    'focus:text-destructive',
                    'focus:border-destructive',
                    'focus:!ring-destructive',
                    'placeholder:text-destructive',
                ],
            },
        },
    },
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, invalid, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    input({
                        invalid,
                    }),
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);

Input.displayName = 'Input';

export { Input, input };
