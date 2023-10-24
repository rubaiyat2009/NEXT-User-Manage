import RemoveUserDialog from '@/app/(app)/users/_components/RemoveUserDialog';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof RemoveUserDialog> = {
    component: RemoveUserDialog,
    tags: ['autodocs'],
    args: {
        open: true,
        user: {
            _id: 'ABC123',
        },
    },
};

export default meta;

type Story = StoryObj<typeof RemoveUserDialog>;

export const Primary: Story = {};
