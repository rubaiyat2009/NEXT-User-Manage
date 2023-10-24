import DatePickerInput from '@/app/_components/DatePickerInput';
import type { Meta, StoryObj } from '@storybook/react';
import { withForm } from '@/app/_lib/decorators';

const meta: Meta<typeof DatePickerInput> = {
    component: DatePickerInput,
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
        defaultValue: new Date(2023, 6, 1, 0, 0),
    },
    decorators: [withForm],
};

export default meta;

type Story = StoryObj<typeof DatePickerInput>;

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
