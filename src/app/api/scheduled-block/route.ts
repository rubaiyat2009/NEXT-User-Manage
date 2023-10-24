import blockedUser from '@/app/_lib/blockUser';
import db from '@/app/_lib/db';
export const GET = async () => {
    try {
        await db();
        await blockedUser();
        return new Response('Success', {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response('Failed to block user', {
            status: 400,
        });
    }
};
