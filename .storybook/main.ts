import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    webpackFinal: async (config, { configType }) => {
        config.resolve!.alias = {
            ...config.resolve!.alias,
            '@/app/_actions': path.resolve(__dirname, '../__mocks__/app/_actions'),
            '@/app/(app)/_actions': path.resolve(__dirname, '../__mocks__/app/(app)/_actions'),
            '@/app/_lib/actionHandler': path.resolve(
                __dirname,
                '../__mocks__/app/_lib/actionHandler',
            ),
            '@': path.resolve(__dirname, '../src'),
        };

        return config;
    },
};
export default config;
