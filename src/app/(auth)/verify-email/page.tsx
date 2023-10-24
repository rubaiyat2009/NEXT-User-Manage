import { redirect } from 'next/navigation';
import VerifyEmailForm from './_components/VerifyEmailForm';
import { getSession } from '@/app/_lib/sessions';

export type PageProps = {};

export default async function Page({}: PageProps) {
    const session = await getSession();
    if (!session) redirect('/sign-in');
    if (session.user.email_verified) redirect('/overview');

    return <VerifyEmailForm />;
}
