import AppContent from '@/app/(app)/_components/AppContent';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AppContent> = {
    component: AppContent,
    tags: ['autodocs'],
    args: {
        breadcrumbs: ['Content'],
        children: <div>This is content</div>,
    },
};

export default meta;

type Story = StoryObj<typeof AppContent>;

export const Primary: Story = {};
