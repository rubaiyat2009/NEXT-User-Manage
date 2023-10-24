const { camelCase } = require('lodash');

module.exports = (plop) => {
    plop.setHelper('substring', function (text, start, end) {
        if (typeof end === 'number') {
            return text.substring(start, end);
        }
        return text.substring(start);
    });

    plop.setHelper('camelCase', function (text) {
        return camelCase(text);
    });

    plop.setGenerator('component', {
        description: 'React Component',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'React component directory',
            },
            {
                type: 'input',
                name: 'name',
                message: 'React component name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/_components/{{name}}.tsx',
                template: `export type {{name}}Props = {};

export default function {{name}}({}: {{name}}Props) {
    return null;
}
                `,
                abortOnFail: false,
            },
            {
                type: 'add',
                path: '{{dir}}/_components/{{name}}.stories.tsx',
                template: `import {{name}} from "@/{{substring dir 6}}/_components/{{name}}";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof {{name}}> = {
    component: {{name}},
    tags: ["autodocs"],
    args: {},
};

export default meta;

type Story = StoryObj<typeof {{name}}>;

export const Primary: Story = {};
                `,
            },
        ],
    });

    plop.setGenerator('page', {
        description: 'Page',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'React component directory',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/page.tsx',
                template: `export type PageProps = {};

export default function Page({}: PageProps) {
    return null;
}
                `,
                abortOnFail: false,
            },
        ],
    });

    plop.setGenerator('loading', {
        description: 'Loading',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'React component directory',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/loading.tsx',
                template: `export type LoadingProps = {};

export default function Loading({}: LoadingProps) {
    return null;
}
                `,
                abortOnFail: false,
            },
            {
                type: 'add',
                path: '{{dir}}/loading.stories.tsx',
                template: `import Loading from "@/{{substring dir 6}}/loading";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Loading> = {
    component: Loading,
    tags: ["autodocs"],
    args: {},
};

export default meta;

type Story = StoryObj<typeof Loading>;

export const Primary: Story = {};
                `,
            },
        ],
    });

    plop.setGenerator('default', {
        description: 'Default',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'React component directory',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/default.tsx',
                template: `export type DefaultProps = {};

export default function Default({}: DefaultProps) {
    return null;
}
                `,
                abortOnFail: false,
            },
        ],
    });

    plop.setGenerator('layout', {
        description: 'Layout',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'React component directory',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/layout.tsx',
                template: `export type LayoutProps = {};

export default function Layout({}: LayoutProps) {
    return null;
}
                `,
                abortOnFail: false,
            },
            {
                type: 'add',
                path: '{{dir}}/layout.stories.tsx',
                template: `import Layout from "@/{{substring dir 6}}/layout";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Layout> = {
    component: Layout,
    tags: ["autodocs"],
    args: {},
};

export default meta;

type Story = StoryObj<typeof Layout>;

export const Primary: Story = {};
                `,
            },
        ],
    });

    plop.setGenerator('hook', {
        description: 'Hook',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'React component directory',
            },
            {
                type: 'input',
                name: 'name',
                message: 'React component name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/_hooks/use{{name}}.ts',
                template: `export default function use{{name}}() {
    return null;
}
                `,
                abortOnFail: false,
            },
        ],
    });

    plop.setGenerator('model', {
        description: 'Model',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Model name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/app/_models/{{name}}.ts',
                template: `import {
    deleteModel,
    FlattenMaps,
    InferSchemaType,
    model,
    models,
    Require_id,
    Schema,
} from 'mongoose';

declare module '@casl/mongoose' {
    interface RecordTypes {
        {{name}}: true;
    }
}

export type I{{name}} =  InferSchemaType<typeof {{name}}Schema> & {
    created_at?: Date;
    updated_at?: Date;
    _id?: string;
};

export type Lean{{name}} = Require_id<FlattenMaps<I{{name}}>>;

const {{name}}Schema = new Schema({} as const ,     {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    } as const);
    
declare global {
    namespace Abilities {
        export interface SubjectMapping {
            {{name}}: I{{name}};
        }
    }
}

if (models?.{{name}}) deleteModel('{{name}}');

export const {{name}} = model('{{name}}', {{name}}Schema);
                `,
                abortOnFail: false,
            },
            {
                type: 'append',
                path: 'src/app/_models/index.ts',
                template: `export * from '@/app/_models/{{name}}';`,
                abortOnFail: false,
                pattern: '// Append model here',
                unique: true,
            },
        ],
    });

    plop.setGenerator('schema', {
        description: 'Schema',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'React component directory',
            },
            {
                type: 'input',
                name: 'name',
                message: 'Schema name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/_schemas/{{name}}Schema.ts',
                template: `import * as z from "zod";

export const {{name}}Schema = z.object({
} as const);

export type {{name}} = z.infer<typeof {{name}}Schema>;
                `,
                abortOnFail: false,
            },
            {
                type: 'add',
                path: '{{dir}}/_schemas/{{name}}Schema.test.ts',
                template: `import { {{name}}Schema } from '@/{{substring dir 6}}/_schemas/{{name}}Schema';
                
test('should validate {{name}}', () => {
    expect({{name}}Schema.parse({})).toEqual({});
});
                `,
                abortOnFail: false,
            },
        ],
    });

    plop.setGenerator('action', {
        description: 'Actions',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'Action directory',
            },
            {
                type: 'input',
                name: 'name',
                message: 'Action name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/_actions/{{name}}.ts',
                template: `'use server';

import serverAction from '@/app/_lib/serverAction';
import { cookies } from 'next/headers';

export const {{name}} = serverAction(async ({ userAbilities }) => {
    throw new Error("Not implemented");
}, { cookies, });
                `,
                abortOnFail: false,
            },
            {
                type: 'add',
                path: './__mocks__/{{substring dir 6}}/_actions/{{name}}.js',
                template: `import { jest } from '@storybook/jest';

export const {{name}} = jest.fn().mockResolvedValue(undefined);
                `,
            },
        ],
    });

    plop.setGenerator('command', {
        description: 'Command',
        prompts: [
            {
                type: 'input',
                name: 'part',
                message: 'Command file name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: './src/cli/commands/{{part}}.ts',
                template: `
export default async function command() {
}
                `,
            },
        ],
    });

    plop.setGenerator('remove-dialog', {
        description: 'Remove dialog',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'Action directory',
            },
            {
                type: 'input',
                name: 'name',
                message: 'Action name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/_actions/remove{{name}}.ts',
                template: `'use server';

import serverAction from '@/app/_lib/serverAction';
import { cookies } from 'next/headers';
import { Remove{{name}}FormDataSchema } from '@/{{substring dir 6}}/_schemas/Remove{{name}}FormDataSchema';
import { {{name}} } from '@/app/_models';
import { ForbiddenError } from '@casl/ability';
import assert from 'node:assert/strict';
import { revalidatePath } from 'next/cache';

export const remove{{name}} = serverAction(
    async ({ userAbilities, session }, { _id }) => {
        const user = session.user;

        ForbiddenError.from(userAbilities).throwUnlessCan('delete', '{{name}}');

        const filter: Record<string, any> = {
            _id,
        };

        await {{name}}.findOneAndRemove(filter).orFail();

        revalidatePath('/');
    },
    { cookies, schema: Remove{{name}}FormDataSchema },
);
`,
            },
            {
                type: 'add',
                path: '{{dir}}/_schemas/Remove{{name}}FormDataSchema.ts',
                template: `import * as z from 'zod';

export const Remove{{name}}FormDataSchema = z.object({
} as const);

export type Remove{{name}}FormData = z.infer<typeof Remove{{name}}FormDataSchema>;
`,
            },
            {
                type: 'add',
                path: '{{dir}}/_hooks/useRemove{{name}}Dialog.ts',
                template: `import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Remove{{name}}FormData } from '@/{{substring dir 6}}/_schemas/Remove{{name}}FormDataSchema';

export type Remove{{name}}DialogState = {
    open?: boolean;
    {{camelCase name }}?: Remove{{name}}FormData;
    openDialog: (driver: Remove{{name}}FormData) => void;
    closeDialog: () => void;
};

const useRemove{{name}}Dialog = create<Remove{{name}}DialogState>()(
    immer((set) => ({
        openDialog: ({{camelCase name }}) =>
            set((draft) => {
                draft.open = true;
                draft.{{camelCase name }} = {{camelCase name }};
            }),
        closeDialog: () =>
            set((draft) => {
                draft.open = false;
                draft.{{camelCase name }} = undefined;
            }),
    })),
);

export default useRemove{{name}}Dialog;
`,
            },
            {
                type: 'add',
                path: '{{dir}}/_components/ControlledRemove{{name}}Dialog.tsx',
                template: `'use client';

import Remove{{name}}Dialog, {
    Remove{{name}}DialogProps,
} from '@/{{substring dir 6}}/_components/Remove{{name}}Dialog';
import useRemove{{name}}Dialog from '@/{{substring dir 6}}/_hooks/useRemove{{name}}Dialog';

export type ControlledRemove{{name}}DialogProps = Pick<Remove{{name}}DialogProps, 'onRemove{{name}}'>;

export default function ControlledRemove{{name}}Dialog({
    onRemove{{name}},
}: ControlledRemove{{name}}DialogProps) {
    const open = useRemove{{name}}Dialog((state) => state.open);

    const {{camelCase name}} = useRemove{{name}}Dialog((state) => state.{{camelCase name}});

    const closeDialog = useRemove{{name}}Dialog((state) => state.closeDialog);

    return (
        <Remove{{name}}Dialog
            open={open}
            {{camelCase name}}={ {{camelCase name}} }
            onRemove{{name}}={ onRemove{{name}} }
            onClose={closeDialog}
        />
    );
}

`,
            },
            {
                type: 'add',
                path: '{{dir}}/_components/Remove{{name}}Dialog.stories.tsx',
                template: `import Remove{{name}}Dialog from '@/{{substring dir 6}}/_components/Remove{{name}}Dialog';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Remove{{name}}Dialog> = {
    component: Remove{{name}}Dialog,
    tags: ['autodocs'],
    args: {
        open: true,
        {{camelCase name }}: {},
    },
};

export default meta;

type Story = StoryObj<typeof Remove{{name}}Dialog>;

export const Primary: Story = {};
`,
            },
            {
                type: 'add',
                path: '{{dir}}/_components/Remove{{name}}Dialog.tsx',
                template: `
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/app/_components/ui/alert-dialog';
import { Button } from '@/app/_components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/app/_lib/utils';
import { useForm } from 'react-hook-form';
import {
    Remove{{ name }}FormData,
    Remove{{ name }}FormDataSchema,
} from '@/{{substring dir 6}}/_schemas/Remove{{ name }}FormDataSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOnSubmit } from '@/app/_lib/actionHandler';

export type Remove{{ name }}DialogProps = {
    open?: boolean;
    {{camelCase name }}?: Remove{{ name }}FormData;
    onRemove{{ name }}: (driver: Remove{{ name }}FormData) => Promise<void>;
    onClose: () => void;
};

export default function Remove{{ name }}Dialog({
    open,
    {{camelCase name }},
    onRemove{{ name }},
    onClose,
}: Remove{{ name }}DialogProps) {
    const form = useForm({
        resolver: zodResolver(Remove{{ name }}FormDataSchema),
        values: {{camelCase name }},
    });

    return (
        <AlertDialog open={open}>
            <AlertDialogContent asChild>
                <form
                    noValidate
                    onSubmit={form.handleSubmit(onSubmit(onRemove{{ name }}, onClose), (errors) => {
                        console.error(errors);
                    })}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                             {/*  Placeholder  */}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                             {/*  Placeholder  */}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button
                                variant="link"
                                type="button"
                                disabled={form.formState.isSubmitting}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                type="submit"
                                variant="outline"
                                className={cn(
                                    '[&_span]:text-destructive',
                                    '[&_span]:border-destructive',
                                )}
                                loading={form.formState.isSubmitting}
                            >
                                <FontAwesomeIcon icon={faTrash} className={cn('mr-2')} size="xs" />
                                <span>{/*  Placeholder  */}</span>
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const onSubmit = createOnSubmit<Remove{{ name }}FormData>();
                `,
            },
        ],
    });

    plop.setGenerator('zustand', {
        description: 'Zustand',
        prompts: [
            {
                type: 'input',
                name: 'dir',
                message: 'React component directory',
            },
            {
                type: 'input',
                name: 'name',
                message: 'React component name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '{{dir}}/_hooks/use{{name}}.ts',
                template: `import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
        
export type {{name}}State = {
};
        
const use{{name}} = create<{{name}}State>()(
    immer((set) => ({
    })),
);

export default use{{name}};
                `,
                abortOnFail: false,
            },
        ],
    });
};
