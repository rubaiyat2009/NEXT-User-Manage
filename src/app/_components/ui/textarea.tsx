import * as React from 'react';
import { cva } from 'class-variance-authority';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, invalid, ...props }, ref) => {
        return <textarea {...props} className={input({ invalid, className })} ref={ref} />;
    },
);
Textarea.displayName = 'Textarea';

const input = cva(
    [
        'flex',
        'min-h-[150px]',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
        'text-sm',
        'ring-offset-background',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50',
    ],
    {
        variants: {
            invalid: {
                true: [
                    '!text-destructive',
                    '!border-destructive',
                    'active:text-destructive',
                    'active:border-destructive',
                    'active:ring-destructive',
                    'focus:text-destructive',
                    'focus:border-destructive',
                    'focus:!ring-destructive',
                    'placeholder:!text-destructive',
                ],
            },
        },
    },
);

export { Textarea };
