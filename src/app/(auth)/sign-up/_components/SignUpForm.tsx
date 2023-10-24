'use client';

import TextInput from '@/app/_components/TextInput';
import { useForm } from 'react-hook-form';
import { cn } from '@/app/_lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Button } from '@/app/_components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { SignUpFormData, SignUpFormDataSchema } from '@/app/_schemas/SignUpFormDataSchema';
import NextImage from 'next/image';
import brand_dark from '@/app/_assets/brand_dark.png';
import { createOnSubmit } from '@/app/_lib/actionHandler';
import { signUp } from '@/app/_actions/signUp';

export type SignUpFormProps = {};

export default function SignUpForm({}: SignUpFormProps) {
    const form = useForm<SignUpFormData>({
        resolver: zodResolver(SignUpFormDataSchema),
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
                <h1 className={cn('text-primary', 'text-4xl', 'font-semibold')}>Create account</h1>

                <p className={cn('text-neutral-700', 'text-base', 'font-medium')}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                </p>
            </div>
            <form
                className={cn('grid', 'grid-cols-2', 'gap-y-5', 'gap-x-5')}
                onSubmit={form.handleSubmit(onSubmit(signUp))}
                noValidate
            >
                <TextInput
                    name="first_name"
                    control={form.control}
                    placeholder="First name"
                    className={cn('col-span-2', 'sm:col-span-1')}
                    defaultValue=""
                />
                <TextInput
                    name="last_name"
                    control={form.control}
                    placeholder="Last name"
                    className={cn('col-span-2', 'sm:col-span-1')}
                    defaultValue=""
                />
                <TextInput
                    name="company_name"
                    control={form.control}
                    placeholder="Company name"
                    className={cn('col-span-2')}
                    defaultValue=""
                    rules={{ required: false }}
                />
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
                    name="telephone"
                    control={form.control}
                    placeholder="Telephone"
                    className={cn('col-span-2', 'relative', '[&>input]:pl-10')}
                    defaultValue=""
                    autoComplete="telephone"
                >
                    <i
                        className={cn(
                            'fi',
                            'fi-rr-phone-flip',
                            'absolute',
                            'left-4',
                            'top-2',
                            'opacity-50',
                            'rotate-90',
                        )}
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
                    Create Account
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
                Already have an account?{' '}
                <Link href="/sign-in" className={cn('text-sky-600', 'text-sm', 'font-bold')}>
                    Login here
                </Link>
            </p>
        </div>
    );
}

const onSubmit = createOnSubmit<SignUpFormData>(
    () => ({
        title: 'Verification email has been send',
    }),
    (_, error) => ({
        title: 'Failed to send verification email',
        description: error.message,
        variant: 'destructive',
    }),
);
