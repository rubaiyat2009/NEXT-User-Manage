import SignUpForm from '@/app/(auth)/sign-up/_components/SignUpForm';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SignUpForm> = {
    component: SignUpForm,
    tags: ['autodocs'],
    args: {},
    parameters: {
        layout: 'centered',
    },
};

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const Primary: Story = {};
