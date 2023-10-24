import { Input } from '@/app/_components/ui/input';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
    component: Input,
    tags: ['autodocs'],
    args: {},
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Primary: Story = {
    args: {
        value: 'This is input',
    },
};

export const File: Story = {
    args: {
        type: 'file',
    },
};

export const Invalid: Story = {
    args: {
        invalid: true,
        value: 'This is invalid input',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        value: 'This is disabled input',
    },
};
