import { Calendar } from '@/app/_components/ui/calendar';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Calendar> = {
    component: Calendar,
    tags: ['autodocs'],
    args: {},
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Primary: Story = {
    args: {},
};

export const Invalid: Story = {
    args: {
        invalid: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};
