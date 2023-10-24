'use client';

import { useForm } from 'react-hook-form';
import { cn } from '@/app/_lib/utils';
import { Button } from '@/app/_components/ui/button';
import NextImage from 'next/image';
import brand_dark from '@/app/_assets/brand_dark.png';
import { createOnSubmit } from '@/app/_lib/actionHandler';
import { resendVerificationEmail } from '@/app/_actions/resendVerificationEmail';
import { signOut } from '@/app/_actions/signOut';

export default function VerifyEmailForm() {
    const form = useForm({});
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
                    Verify your email
                </h1>

                <p className={cn('text-neutral-700', 'text-base', 'font-medium')}>
                    We have sent you an email. Check it & click on the link to activate your account
                </p>
            </div>
            <form
                className={cn('flex', 'flex-col', 'gap-3', 'items-start')}
                onSubmit={form.handleSubmit(onSubmit(resendVerificationEmail as any))}
                noValidate
            >
                <Button loading={form.formState.isSubmitting}>Resend Email</Button>
                <p
                    className={cn(
                        'text-neutral-700',
                        'text-sm',
                        'font-normal',
                        'text-center',
                        'md:text-left',
                    )}
                >
                    Already verified?{' '}
                    <span
                        onClick={() => signOut()}
                        className={cn('text-sky-600', 'text-sm', 'font-bold', 'cursor-pointer')}
                    >
                        Login here
                    </span>
                </p>
            </form>
        </div>
    );
}

const onSubmit = createOnSubmit(
    () => ({
        title: 'Verification email has been send',
    }),
    (_, error) => ({
        title: 'Verification email send failed',
        description: error.message,
        variant: 'destructive',
    }),
);
