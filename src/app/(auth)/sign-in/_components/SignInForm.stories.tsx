import SignInForm from '@/app/(auth)/sign-in/_components/SignInForm';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SignInForm> = {
    component: SignInForm,
    tags: ['autodocs'],
    args: {},
};

export default meta;

type Story = StoryObj<typeof SignInForm>;

export const Primary: Story = {};
