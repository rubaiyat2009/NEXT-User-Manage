'use client';

import { cn } from '@/app/_lib/utils';
import { Label } from '@/app/_components/ui/label';
import { Textarea, TextareaProps } from '@/app/_components/ui/textarea';
import { ErrorMessage } from '@hookform/error-message';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { PropsWithChildren, useId } from 'react';

export type TextAreaInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = PropsWithChildren<
    UseControllerProps<TFieldValues, TName> & {
        label?: string;
        helperText?: string;
    } & Pick<TextareaProps, 'placeholder' | 'disabled' | 'className' | 'autoComplete' | 'rows'>
>;

export default function TextareaInput<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    defaultValue,
    label,
    shouldUnregister,
    control,
    name,
    rules,
    disabled,
    placeholder,
    className,
    children,
    helperText,
    ...rest
}: TextAreaInputProps<TFieldValues, TName>) {
    const { field, formState, fieldState } = useController({
        defaultValue,
        shouldUnregister,
        control,
        name,
        rules,
    });

    const id = useId();

    return (
        <label
            className={cn(
                'block',
                'group',
                {
                    'text-destructive': fieldState.invalid,
                },
                className,
            )}
            htmlFor={id}
        >
            {label ? (
                <Label
                    asChild
                    className={cn('mb-4', 'ml-1')}
                    disabled={!!disabled || formState.isSubmitting}
                    invalid={fieldState.invalid}
                >
                    <div>
                        {label}
                        {helperText ? (
                            <div className={cn('text-zinc-500', 'text-sm', 'font-normal')}>
                                {helperText}
                            </div>
                        ) : null}
                    </div>
                </Label>
            ) : null}
            <Textarea
                {...rest}
                id={id}
                {...field}
                aria-invalid={fieldState.invalid}
                disabled={!!disabled || formState.isSubmitting}
                placeholder={placeholder}
                value={field.value ?? ''}
                invalid={fieldState.invalid}
            />
            {children}
            <ErrorMessage
                errors={formState.errors}
                name={name as any}
                render={({ message }) => (
                    <div
                        role="alert"
                        className={cn(
                            'absolute',
                            'z-40',
                            'mt-1.5',
                            'hidden',
                            'rounded',
                            'bg-destructive',
                            'px-2',
                            'py-1',
                            'text-xs',
                            'md:text-sm',
                            'font-semibold',
                            'text-destructive-foreground',
                            'transition',
                            'group-hover:block',
                            'normal-case',
                        )}
                    >
                        {message}
                    </div>
                )}
            />
        </label>
    );
}
