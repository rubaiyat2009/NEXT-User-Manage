import SignInForm from '@/app/(auth)/sign-in/_components/SignInForm';
import { getSession } from '@/app/_lib/sessions';
import { redirect } from 'next/navigation';

export type PageProps = {};

export default async function Page({}: PageProps) {
    const session = await getSession();
    if (session && !session?.user?.email_verified) redirect('/verify-email');

    return <SignInForm />;
}
