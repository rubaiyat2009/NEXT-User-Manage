import SelectInput from '@/app/_components/SelectInput';
import type { Meta, StoryObj } from '@storybook/react';
import { withForm } from '@/app/_lib/decorators';
import { SelectGroup, SelectItem, SelectLabel } from '@/app/_components/ui/select';

const meta: Meta<typeof SelectInput> = {
    component: SelectInput,
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
        defaultValue: 'pineapple',
        children: (
            <SelectGroup>
                <SelectLabel>Select a fruit</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
        ),
        placeholder: 'This is placeholder',
    },
    decorators: [withForm],
};

export default meta;

type Story = StoryObj<typeof SelectInput>;

export const Primary: Story = {};

export const Invalid: Story = {
    args: {
        defaultValue: null,
    },
};
