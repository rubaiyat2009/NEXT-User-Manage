'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/app/_lib/utils';
import TextInput from '@/app/_components/TextInput';
import { Button } from '@/app/_components/ui/button';
import NextImage from 'next/image';
import brand_dark from '@/app/_assets/brand_dark.png';
import { createOnSubmit } from '@/app/_lib/actionHandler';
import { ResetPasswordData, ResetPasswordDataSchema } from '@/app/_schemas/ResetPasswordDataSchema';
import { resetPassword } from '@/app/_actions/resetPassword';
import { useParams } from 'next/navigation';

export type ResetPasswordFormProps = {};

export default function ResetPasswordForm({}: ResetPasswordFormProps) {
    const { token } = useParams();

    const form = useForm<ResetPasswordData>({
        resolver: zodResolver(ResetPasswordDataSchema),
        defaultValues: {
            token: token as string,
        },
    });

    return (
        <div
            className={cn(
                'flex',
                'md:w-screen',
                'max-w-xl',
                'mx-4',
                'pb-36',
                'pt-10',
                'flex-col',
                'gap-y-7',
            )}
        >
            <NextImage
                src={brand_dark}
                alt="User Manage"
                className={cn('w-32', 'object-cover', 'lg:hidden')}
            />

            <div className={cn('space-y-1')}>
                <h1 className={cn('text-primary', 'text-4xl', 'font-semibold')}>Reset password</h1>

                <p className={cn('text-neutral-700', 'text-base', 'font-medium')}>
                    Set your new password
                </p>
            </div>
            <form
                className={cn('grid', 'grid-cols-2', 'gap-y-5', 'gap-x-5')}
                onSubmit={form.handleSubmit(onSubmit(resetPassword))}
                noValidate
            >
                <TextInput
                    name="password"
                    type="password"
                    control={form.control}
                    placeholder="Password"
                    className={cn('col-span-2', 'relative', '[&>input]:pl-10')}
                    defaultValue=""
                    autoComplete="new-password"
                >
                    <i
                        className={cn(
                            'fi',
                            'fi-rr-lock',
                            'absolute',
                            'left-4',
                            'top-2',
                            'opacity-50',
                        )}
                    />
                </TextInput>
                <TextInput
                    name="confirm_password"
                    type="password"
                    control={form.control}
                    placeholder="Confirm Password"
                    className={cn('col-span-2', 'relative', '[&>input]:pl-10')}
                    defaultValue=""
                    autoComplete="new-password"
                >
                    <i
                        className={cn(
                            'fi',
                            'fi-rr-lock',
                            'absolute',
                            'left-4',
                            'top-2',
                            'opacity-50',
                        )}
                    />
                </TextInput>

                <Button className={cn('col-span-2')} loading={form.formState.isSubmitting}>
                    Reset password
                </Button>
            </form>
        </div>
    );
}

const onSubmit = createOnSubmit<ResetPasswordData>(
    () => ({
        title: 'Password successfully changed',
    }),
    (_, error) => ({
        title: 'Password reset failed',
        description: error.message,
        variant: 'destructive',
    }),
);
