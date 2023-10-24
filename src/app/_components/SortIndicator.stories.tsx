import SortIndicator from '@/app/_components/SortIndicator';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SortIndicator> = {
    component: SortIndicator,
    tags: ['autodocs'],
    args: {},
};

export default meta;

type Story = StoryObj<typeof SortIndicator>;

export const Primary: Story = {};
