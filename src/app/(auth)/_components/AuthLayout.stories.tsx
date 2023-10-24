import AuthLayout from '@/app/(auth)/_components/AuthLayout';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AuthLayout> = {
    component: AuthLayout,
    tags: ['autodocs'],
    args: {},
};

export default meta;

type Story = StoryObj<typeof AuthLayout>;

export const Primary: Story = {};
