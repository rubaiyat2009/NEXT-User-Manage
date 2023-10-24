import { ChangeEvent, PropsWithChildren, useCallback, useId, useMemo } from 'react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { cn } from '@/app/_lib/utils';
import { Input, InputProps } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { ErrorMessage } from '@hookform/error-message';

export type TextInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = PropsWithChildren<
    UseControllerProps<TFieldValues, TName> & {
        label?: string;
        transform?: {
            input?: (value: any) => string | null;
            output?: (value: string | null) => any;
        };
    } & Pick<
            InputProps,
            | 'placeholder'
            | 'disabled'
            | 'className'
            | 'type'
            | 'step'
            | 'list'
            | 'autoComplete'
            | 'pattern'
            | 'min'
            | 'max'
        >
>;

export default function TextInput<
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
    type,
    step,
    list,
    children,
    transform,
    ...rest
}: TextInputProps<TFieldValues, TName>) {
    const { field, formState, fieldState } = useController({
        defaultValue,
        shouldUnregister,
        control,
        name,
        rules,
    });

    const id = useId();

    const value = useMemo(() => {
        return transform?.input?.(field.value ?? '') ?? field.value ?? '';
    }, [transform, field.value]);

    const handleChange = useCallback(
        (value: ChangeEvent<HTMLInputElement>) => {
            field.onChange(transform?.output?.(value.target.value ?? '') ?? value ?? '');
        },
        [field, transform],
    );

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
                    <div>{label}</div>
                </Label>
            ) : null}
            <Input
                {...rest}
                id={id}
                type={type}
                step={step}
                list={list}
                {...field}
                aria-invalid={fieldState.invalid}
                disabled={!!disabled || formState.isSubmitting}
                placeholder={placeholder}
                value={value}
                invalid={fieldState.invalid}
                onChange={handleChange}
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
