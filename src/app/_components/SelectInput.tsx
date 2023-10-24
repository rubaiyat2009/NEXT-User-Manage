import { Select, SelectContent, SelectTrigger, SelectValue } from '@/app/_components/ui/select';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Label } from '@/app/_components/ui/label';
import { cn } from '@/app/_lib/utils';
import { ErrorMessage } from '@hookform/error-message';

export type SelectInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = PropsWithChildren<
    UseControllerProps<TFieldValues, TName> &
        Omit<SelectPrimitive.SelectProps, 'value'> & {
            transform?: {
                input?: (value: any) => string | null;
                output?: (value: string | null) => any;
            };
            label?: string;
            className?: string;
            placeholder?: string;
        }
>;

export default function SelectInput<
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
    children,
    transform,
    className,
    placeholder,
    ...rest
}: SelectInputProps<TFieldValues, TName>) {
    const { field, fieldState, formState } = useController({
        defaultValue,
        shouldUnregister,
        control,
        name,
        rules,
    });

    const selected = useMemo(() => {
        return transform?.input?.(field.value ?? null) ?? field.value ?? null;
    }, [transform, field.value]);

    const handleSelect = useCallback(
        (value: string | null) => {
            field.onChange(transform?.output?.(value ?? null) ?? value ?? null);
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
            <Select
                {...rest}
                disabled={!!disabled || formState.isSubmitting}
                value={selected || undefined}
                onValueChange={handleSelect}
            >
                <SelectTrigger invalid={fieldState.invalid}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>{children}</SelectContent>
            </Select>
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
