import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import type { StoryContext } from '@storybook/react';
import { ProvideAbility } from '@/app/_components/Ability';

function WithForm({ children, ...rest }: PropsWithChildren & UseFormProps) {
    const form = useForm(rest);

    useEffect(() => {
        void form.trigger();
    }, [form]);

    return <FormProvider {...form}>{children}</FormProvider>;
}

const withForm = (Story: any, ctx: StoryContext) => {
    return (
        <WithForm {...ctx?.parameters?.form}>
            <Story />
        </WithForm>
    );
};

declare module '@storybook/react' {
    interface Parameters {
        form?: UseFormProps;
    }
}

const withAbility = (Story: any, ctx: StoryContext) => {
    const user = {
        role: 'SuperAdmin',
        first_name: 'Sham',
        last_name: 'San',
        ...ctx?.parameters?.user,
    };

    return (
        <ProvideAbility user={user}>
            <Story />
        </ProvideAbility>
    );
};

export { withForm, withAbility };
