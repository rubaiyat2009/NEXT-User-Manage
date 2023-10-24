import SignUpForm from '@/app/(auth)/sign-up/_components/SignUpForm';
import { getSession } from '@/app/_lib/sessions';
import { redirect } from 'next/navigation';

export type PageProps = {};

export default async function Page({}: PageProps) {
    const session = await getSession();
    if (session && !session?.user?.email_verified) redirect('/verify-email');
    return <SignUpForm />;
}
