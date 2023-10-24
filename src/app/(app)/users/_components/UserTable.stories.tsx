import UserTable from '@/app/(app)/users/_components/UserTable';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof UserTable> = {
    component: UserTable,
    tags: ['autodocs'],
    args: {
        users: [
            {
                email: 'test@gmail.com',
                telephone: '1234567890',
                last_name: 'San',
                first_name: 'Sham',
               Manage: {
                    _id: 'abc123',
                } as any,
                email_verified: false,
                role: 'DepotAdmin',
                _id: 'abc123',
                created_at: new Date(),
                updated_at: new Date(),
                id: 'abc123a',
                disabled: false,
            },
            {
                email: 'test@gmail.com',
                telephone: '1234567890',
                last_name: 'San',
                first_name: 'Sham',
                email_verified: false,
                role: 'SuperAdmin',
                _id: 'abc123',
                created_at: new Date(),
                updated_at: new Date(),
                id: 'abc123',
                disabled: false,
            },
        ],
        total: 2,
        q: {
            sorting: [],
            pageIndex: 0,
            pageSize: 10,
            skip: 0,
            limit: 10,
            sort: {},
            filter: {},
        },
    },
};

export default meta;

type Story = StoryObj<typeof UserTable>;

export const Primary: Story = {};
