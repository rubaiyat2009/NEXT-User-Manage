import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/app/_components/ui/select';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Select> = {
    component: Select,
    tags: ['autodocs'],
    args: {},
    render: (args) => (
        <Select {...args}>
            <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select a fruit</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Primary: Story = {};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const Invalid: Story = {
    render: (args) => (
        <Select {...args}>
            <SelectTrigger invalid>
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select a fruit</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};
