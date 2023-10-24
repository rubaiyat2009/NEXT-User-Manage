import { Button } from '@/app/_components/ui/button';
import type { Meta, StoryObj } from '@storybook/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';

const meta: Meta<typeof Button> = {
    component: Button,
    tags: ['autodocs'],
    args: {
        children: 'This is button',
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const PrimaryDisabled: Story = {
    args: {
        disabled: true,
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
    },
};

export const OutlineDisabled: Story = {
    args: {
        variant: 'outline',
        disabled: true,
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
    },
};

export const Sm: Story = {
    args: {
        size: 'sm',
    },
};

export const Lg: Story = {
    args: {
        size: 'lg',
    },
};

export const Icon: Story = {
    args: {
        size: 'icon',
        children: <FontAwesomeIcon icon={faCircleNotch} />,
    },
};

export const Loading: Story = {
    args: {
        loading: true,
    },
};
