import Navigations from '@/app/(app)/_components/Navigations';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Navigations> = {
    component: Navigations,
    tags: ['autodocs'],
    args: {},
    parameters: {
        backgrounds: {
            default: 'dark',
        },
    },
};

export default meta;

type Story = StoryObj<typeof Navigations>;

export const Primary: Story = {};
