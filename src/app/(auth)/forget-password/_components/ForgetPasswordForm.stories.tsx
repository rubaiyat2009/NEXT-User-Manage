import type { Meta, StoryObj } from '@storybook/react';
import ForgetPasswordForm from './ForgetPasswordForm';

const meta: Meta<typeof ForgetPasswordForm> = {
    component: ForgetPasswordForm,
    tags: ['autodocs'],
    args: {},
};

export default meta;

type Story = StoryObj<typeof ForgetPasswordForm>;

export const Primary: Story = {};
