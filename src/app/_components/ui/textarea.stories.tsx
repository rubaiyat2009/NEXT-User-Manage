import { Textarea } from '@/app/_components/ui/textarea';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Textarea> = {
    component: Textarea,
    tags: ['autodocs'],
    args: {
        placeholder: 'This is placeholder',
    },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

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
