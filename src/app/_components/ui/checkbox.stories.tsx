import { Checkbox } from '@/app/_components/ui/checkbox';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Checkbox> = {
    component: Checkbox,
    tags: ['autodocs'],
    args: {},
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {
    args: {
        value: 'This is input',
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
