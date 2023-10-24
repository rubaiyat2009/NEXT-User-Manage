import AppLayout from '@/app/(app)/_components/AppLayout';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AppLayout> = {
    component: AppLayout,
    tags: ['autodocs'],
    args: {},
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

type Story = StoryObj<typeof AppLayout>;

export const Primary: Story = {};
