'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/app/_lib/utils';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

const RootContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

const Tabs = TabsPrimitive.Root;

Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    const composedRef = useComposedRefs(ref, nodeRef);

    return (
        <TabsPrimitive.List
            ref={composedRef}
            className={cn(
                'inline-flex',
                'h-10',
                'items-center',
                'justify-center',
                'rounded-md',
                'p-1',
                'relative',
                className,
            )}
            {...props}
        >
            <RootContext.Provider value={nodeRef}>{children}</RootContext.Provider>
            <div
                className={cn(
                    'h-[3px]',
                    'w-[--testset-tab-width]',
                    'left-[--testset-tab-left]',
                    'bg-primary',
                    'absolute',
                    'bottom-0',
                    'transition-all',
                )}
            />
        </TabsPrimitive.List>
    );
});

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
    const ctx = useContext(RootContext);

    const nodeRef = useRef<HTMLButtonElement>(null);

    const composedRef = useComposedRefs(ref, nodeRef);

    useEffect(() => {
        if (!ctx?.current) return;
        if (!nodeRef.current) return;

        function run() {
            if (!nodeRef.current) return;
            if (nodeRef.current.dataset.state !== 'active') return;

            ctx?.current?.style.setProperty(
                '--testset-tab-width',
                `${nodeRef.current.offsetWidth}px`,
            );
            ctx?.current?.style.setProperty(
                '--testset-tab-left',
                `${nodeRef.current.offsetLeft}px`,
            );
        }

        run();

        const observer = new MutationObserver(() => {
            run();
        });

        observer.observe(nodeRef.current, { attributeFilter: ['data-state'] });

        return () => {
            observer.disconnect();
        };
    }, [ctx]);

    return (
        <TabsPrimitive.Trigger
            ref={composedRef}
            className={cn(
                'inline-flex',
                'items-center',
                'justify-center',
                'whitespace-nowrap',
                'rounded-sm',
                'px-3',
                'py-1.5',
                'text-sm',
                'font-medium',
                'ring-offset-background',
                'transition-all',
                'focus-visible:outline-none',
                'disabled:pointer-events-none',
                'disabled:opacity-50',
                'data-[state=active]:text-foreground',
                className,
            )}
            {...props}
        />
    );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            'mt-2',
            'ring-offset-background',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring',
            'focus-visible:ring-offset-2',
            className,
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
