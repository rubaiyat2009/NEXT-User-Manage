import TextInput from '@/app/_components/TextInput';
import type { Meta, StoryObj } from '@storybook/react';
import { withForm } from '@/app/_lib/decorators';

const meta: Meta<typeof TextInput> = {
    component: TextInput,
    tags: ['autodocs'],
    args: {
        defaultValue: 'Test',
        name: 'value',
        rules: {
            required: {
                value: true,
                message: 'This field is required',
            },
        },
        placeholder: 'This is placeholder',
    },
    decorators: [withForm],
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Primary: Story = {};

export const Label: Story = {
    args: {
        label: 'Input Name',
    },
};

export const Invalid: Story = {
    args: {
        defaultValue: '',
        label: 'Input Name',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        label: 'Input Name',
    },
};
