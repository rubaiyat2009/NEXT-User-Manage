import type { Preview } from '@storybook/react';
import { Inter } from 'next/font/google';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@/app/globals.css';
import { withAbility } from '@/app/_lib/decorators';
import { TooltipProvider } from '@/app/_components/ui/tooltip';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
            exclude: ['name', 'rules', 'shouldUnregister', 'control', 'transform', 'children'],
        },
        nextjs: {
            appDirectory: true,
        },
    },
    decorators: [
        (Story) => {
            // @ts-ignore
            document.body.classList.add('antialiased', inter.className);
            return <Story />;
        },
        (Story) => {
            return (
                <TooltipProvider>
                    <Story />
                </TooltipProvider>
            );
        },
        withAbility,
    ],
};

export default preview;
