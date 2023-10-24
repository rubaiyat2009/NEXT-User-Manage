'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/app/_lib/utils';
import TextInput from '@/app/_components/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Button } from '@/app/_components/ui/button';
import Link from 'next/link';
import NextImage from 'next/image';
import brand_dark from '@/app/_assets/brand_dark.png';
import {
    ForgetPasswordData,
    ForgetPasswordDataSchema,
} from '@/app/_schemas/ForgetPasswordDataSchema';
import { createOnSubmit } from '@/app/_lib/actionHandler';
import { forgotPassword } from '@/app/_actions/forgotPassword';

export type ForgetPasswordProps = {};

export default function ForgetPasswordForm({}: ForgetPasswordProps) {
    const form = useForm<ForgetPasswordData>({
        resolver: zodResolver(ForgetPasswordDataSchema),
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
                <h1 className={cn('text-primary', 'text-4xl', 'font-semibold')}>
                    Forgot your password?{' '}
                </h1>

                <p className={cn('text-neutral-700', 'text-base', 'font-medium')}>
                    We will help you reset it
                </p>
            </div>
            <form
                className={cn('grid', 'grid-cols-2', 'gap-y-5', 'gap-x-5')}
                onSubmit={form.handleSubmit(onSubmit(forgotPassword))}
                noValidate
            >
                <TextInput
                    name="email"
                    control={form.control}
                    placeholder="Email Address"
                    className={cn('col-span-2', 'relative', '[&>input]:pl-10')}
                    defaultValue=""
                    autoComplete="email"
                >
                    <FontAwesomeIcon
                        icon={faEnvelope}
                        className={cn('absolute', 'left-4', 'top-3', 'opacity-50')}
                    />
                </TextInput>
                <Button className={cn('col-span-2')} loading={form.formState.isSubmitting}>
                    Send reset link
                </Button>
            </form>

            <p
                className={cn(
                    'text-neutral-700',
                    'text-sm',
                    'font-normal',
                    'text-center',
                    'md:text-left',
                )}
            >
                Remember your password?{' '}
                <Link href="/sign-in" className={cn('text-sky-600', 'text-sm', 'font-bold')}>
                    Login here
                </Link>
            </p>
        </div>
    );
}

const onSubmit = createOnSubmit<ForgetPasswordData>(
    () => ({
        title: 'Password reset link has been send successfully',
    }),
    (_, error) => ({
        title: 'Failed to send password reset link',
        description: error.message,
        variant: 'destructive',
    }),
);
