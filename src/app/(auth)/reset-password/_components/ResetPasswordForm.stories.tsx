import ResetPasswordForm from '@/app/(auth)/reset-password/_components/ResetPasswordForm';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ResetPasswordForm> = {
    component: ResetPasswordForm,
    tags: ['autodocs'],
    args: {},
};

export default meta;

type Story = StoryObj<typeof ResetPasswordForm>;

export const Primary: Story = {};
