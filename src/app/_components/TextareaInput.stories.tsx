import TextareaInput from '@/app/_components/TextareaInput';
import type { Meta, StoryObj } from '@storybook/react';
import { withForm } from '@/app/_lib/decorators';

const meta: Meta<typeof TextareaInput> = {
    component: TextareaInput,
    tags: ['autodocs'],
    args: {
        label: 'This is label',
        name: 'value',
        rules: {
            required: {
                value: true,
                message: 'This field is required',
            },
        },
        defaultValue: 'This is default value',
    },
    decorators: [withForm],
};

export default meta;

type Story = StoryObj<typeof TextareaInput>;

export const Primary: Story = {};

export const Invalid: Story = {
    args: {
        defaultValue: null,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};
