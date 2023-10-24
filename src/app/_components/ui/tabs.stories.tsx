import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tabs> = {
    component: Tabs,
    tags: ['autodocs'],
    args: {},
    render: () => (
        <Tabs>
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Account</TabsContent>
            <TabsContent value="password">Password</TabsContent>
        </Tabs>
    ),
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Primary: Story = {};
