import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/_lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const loader = cva(['text-primary', 'absolute', 'inset-0', 'm-auto']);

const buttonUser = cva(
    [
        'group',
        'relative',
        'inline-block',
        'disabled:pointer-events-none',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
    ],
    {
        variants: {
            size: {
                default: ['h-10'],
                sm: ['h-9'],
                lg: ['h-11'],
                icon: 'h-10 w-10',
            },
            variant: {
                default: [],
                destructive: [],
                secondary: [],
                ghost: [],
                link: [],
                outline: [],
                icon: [],
            },
        },
        defaultVariants: {
            size: 'default',
        },
    },
);

const buttonVariants = cva(
    [
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded',
        'text-sm',
        'font-semibold',
        'ring-offset-background',
        'transition-colors',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'relative',
        'cursor-pointer',
        'w-full',
        'h-full',
        'group-disabled:pointer-events-none',
        'group-disabled:cursor-not-allowed',
    ],
    {
        variants: {
            variant: {
                default: ['bg-primary', 'text-primary-foreground', 'hover:bg-sky-700'],
                destructive: [
                    'bg-destructive',
                    'text-destructive-foreground',
                    'hover:bg-destructive/90',
                ],
                outline: [
                    'border',
                    'border-input',
                    'border-primary',
                    'bg-transparent',
                    'text-primary',
                ],
                secondary: [
                    'bg-secondary',
                    'text-secondary-foreground',
                    'hover:bg-secondary/80',
                    'border',
                    'border-zinc-400',
                ],
                ghost: ['hover:bg-accent', 'hover:text-accent-foreground'],
                icon: [],
                link: ['text-primary', 'underline-offset-4', 'hover:underline'],
            },
            loading: {
                true: ['invisible'],
            },
            size: {
                default: ['px-4', 'py-2'],
                sm: ['rounded-md', 'px-3'],
                lg: ['rounded-md', 'px-8'],
                icon: [],
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants>,
        VariantProps<typeof buttonUser> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, children, disabled, loading, ...props }, ref) => {
        const Comp = asChild ? Slot : 'span';

        return (
            <button
                className={buttonUser({ size, className })}
                disabled={disabled || !!loading}
                {...props}
            >
                {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin size="2xl" className={loader()} />
                ) : null}
                <Comp className={cn(buttonVariants({ variant, loading, size }))} ref={ref}>
                    {children}
                </Comp>
            </button>
        );
    },
);

Button.displayName = 'Button';

export { Button, buttonVariants, buttonUser };
