import { Label } from '@/app/_components/ui/label';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Label> = {
    component: Label,
    tags: ['autodocs'],
    args: {
        children: 'This is label',
    },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Primary: Story = {};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const Invalid: Story = {
    args: {
        invalid: true,
    },
};
