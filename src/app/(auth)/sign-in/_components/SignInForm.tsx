'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/app/_lib/utils';
import TextInput from '@/app/_components/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Button } from '@/app/_components/ui/button';
import Link from 'next/link';
import { SignInFormData, SignInFormDataSchema } from '@/app/_schemas/SignInFormDataSchema';
import NextImage from 'next/image';
import brand_dark from '@/app/_assets/brand_dark.png';
import { createOnSubmit } from '@/app/_lib/actionHandler';
import { signIn } from '@/app/_actions/signIn';

export type SignInFormProps = {};

export default function SignInForm({}: SignInFormProps) {
    const form = useForm<SignInFormData>({
        resolver: zodResolver(SignInFormDataSchema),
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
                <h1 className={cn('text-primary', 'text-4xl', 'font-semibold')}>Welcome back</h1>

                <p className={cn('text-neutral-700', 'text-base', 'font-medium')}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                </p>
            </div>
            <form
                className={cn('grid', 'grid-cols-2', 'gap-y-5', 'gap-x-5')}
                onSubmit={form.handleSubmit(onSubmit(signIn))}
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

                <Button className={cn('col-span-2')} loading={form.formState.isSubmitting}>
                    Login
                </Button>
            </form>
            <p
                className={cn(
                    'text-neutral-700',
                    'text-sm',
                    'font-normal',
                    'text-center',
                    'md:text-left',
                    'flex',
                    'justify-end',
                )}
            >
                {/* <label className={cn('flex', 'items-center', 'gap-2', 'cursor-pointer')}>
                    <input type="checkbox" />
                    Remember me
                </label> */}
                <Link
                    href="/forget-password"
                    className={cn('text-sky-600', 'text-sm', 'font-bold')}
                >
                    Recovery Password
                </Link>
            </p>
            <p
                className={cn(
                    'text-neutral-700',
                    'text-sm',
                    'font-normal',
                    'text-center',
                    'md:text-left',
                )}
            >
                Don&apos;t have an account?{' '}
                <Link href="/sign-up" className={cn('text-sky-600', 'text-sm', 'font-bold')}>
                    Sign up now!
                </Link>
            </p>
        </div>
    );
}

const onSubmit = createOnSubmit<SignInFormData>(
    () => ({
        title: 'Sign in success',
    }),
    (_, error) => ({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
    }),
);
