import { ClearIndicatorProps, components, DropdownIndicatorProps, GroupBase } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/app/_lib/utils';
import { cva } from 'class-variance-authority';
import * as React from 'react';

export function ClearIndicator<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: ClearIndicatorProps<Option, IsMulti, Group>,
) {
    return (
        <components.ClearIndicator {...props}>
            <FontAwesomeIcon icon={faXmark} size="sm" className={cn('text-neutral-500')} />
        </components.ClearIndicator>
    );
}

export function DropdownIndicator<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: DropdownIndicatorProps<Option, IsMulti, Group>,
) {
    return (
        <components.DropdownIndicator {...props}>
            <FontAwesomeIcon icon={faChevronDown} size="sm" className={cn('text-neutral-500')} />
        </components.DropdownIndicator>
    );
}

export const select = cva(
    [
        String.raw`[&_.rs\_\_value-User]:px-3`,
        String.raw`[&_.rs\_\_value-User]:py-1`,
        String.raw`[&_.rs\_\_value-User]:gap-x-1`,
        String.raw`[&_.rs\_\_value-User]:gap-y-0.5`,
        String.raw`[&_.rs\_\_value-User]:cursor-pointer`,

        String.raw`[&_.rs\_\_input]:outline-none`,
        String.raw`[&_.rs\_\_input]:shadow-none`,
        String.raw`focus:[&_.rs\_\_input]:outline-none`,
        String.raw`focus:[&_.rs\_\_input]:shadow-none`,
        String.raw`focus:[&_.rs\_\_input]:ring-0`,
        String.raw`active:[&_.rs\_\_input]:outline-none`,
        String.raw`active:[&_.rs\_\_input]:shadow-none`,
        String.raw`active:[&_.rs\_\_input]:ring-0`,

        String.raw`[&_.rs\_\_control]:w-full`,
        String.raw`[&_.rs\_\_control]:h-10`,
        String.raw`[&_.rs\_\_control]:rounded-md`,
        String.raw`[&_.rs\_\_control]:border`,
        String.raw`[&_.rs\_\_control]:border-input`,
        String.raw`[&_.rs\_\_control]:bg-background`,
        String.raw`[&_.rs\_\_control]:text-sm`,
        String.raw`[&_.rs\_\_control]:font-normal`,
        String.raw`[&_.rs\_\_control]:ring-offset-background`,
        String.raw`[&_.rs\_\_control--is-focused:not(.rs\_\_control--menu-is-open)]:outline-none`,
        String.raw`[&_.rs\_\_control--is-focused:not(.rs\_\_control--menu-is-open)]:ring-2`,
        String.raw`[&_.rs\_\_control--is-focused:not(.rs\_\_control--menu-is-open)]:ring-ring`,
        String.raw`[&_.rs\_\_control--is-focused:not(.rs\_\_control--menu-is-open)]:ring-offset-2`,
        String.raw`[&_.rs\_\_control--is-disabled]:cursor-not-allowed`,
        String.raw`[&_.rs\_\_control--is-disabled]:opacity-50`,

        String.raw`[&_.rs\_\_placeholder]:text-sm`,
        String.raw`[&_.rs\_\_placeholder]:text-muted-foreground`,
        String.raw`[&_.rs\_\_placeholder]:font-normal`,

        String.raw`[&_.rs\_\_dropdown-indicator]:px-3`,
        String.raw`[&_.rs\_\_clear-indicator]:px-1`,
        String.raw`[&_.rs\_\_indicator]:cursor-pointer`,
    ],
    {
        variants: {
            invalid: {
                true: [
                    String.raw`[&_.rs\_\_control]:!text-destructive`,
                    String.raw`[&_.rs\_\_control]:!border-destructive`,
                    String.raw`[&_.rs\_\_placeholder]:!text-destructive`,
                ],
            },
        },
    },
);

export const menu = cva([
    String.raw`[&.rs\_\_menu]:pointer-events-auto`,
    String.raw`[&.rs\_\_menu]:relative`,
    String.raw`[&.rs\_\_menu]:min-w-[8rem]`,
    String.raw`[&.rs\_\_menu]:overflow-hidden`,
    String.raw`[&.rs\_\_menu]:rounded-md`,
    String.raw`[&.rs\_\_menu]:border`,
    String.raw`[&.rs\_\_menu]:bg-popover`,
    String.raw`[&.rs\_\_menu]:text-popover-foreground`,
    String.raw`[&.rs\_\_menu]:shadow-md`,
    String.raw`[&.rs\_\_menu]:translate-y-1`,
    String.raw`[&.rs\_\_menu]:animate-in`,
    String.raw`[&.rs\_\_menu]:fade-in-0`,
    String.raw`[&.rs\_\_menu]:zoom-in-95`,
    String.raw`[&.rs\_\_menu]:slide-in-from-top-2`,

    String.raw`[&_.rs\_\_menu-list]:p-1`,

    String.raw`[&_.rs\_\_group-heading]:py-1.5`,
    String.raw`[&_.rs\_\_group-heading]:pl-8`,
    String.raw`[&_.rs\_\_group-heading]:pr-2`,
    String.raw`[&_.rs\_\_group-heading]:text-sm`,
    String.raw`[&_.rs\_\_group-heading]:font-semibold`,

    String.raw`[&_.rs\_\_option]:cursor-pointer`,
    String.raw`[&_.rs\_\_option]:relative`,
    String.raw`[&_.rs\_\_option]:flex`,
    String.raw`[&_.rs\_\_option]:w-full`,
    String.raw`[&_.rs\_\_option]:cursor-default`,
    String.raw`[&_.rs\_\_option]:select-none`,
    String.raw`[&_.rs\_\_option]:items-center`,
    String.raw`[&_.rs\_\_option]:rounded-sm`,
    String.raw`[&_.rs\_\_option]:py-1.5`,
    String.raw`[&_.rs\_\_option]:pl-8`,
    String.raw`[&_.rs\_\_option]:pr-2`,
    String.raw`[&_.rs\_\_option]:text-sm`,
    String.raw`[&_.rs\_\_option]:outline-none`,

    String.raw`[&_.rs\_\_option--is-focused]:bg-accent`,
    String.raw`[&_.rs\_\_option--is-focused]:text-accent-foreground`,

    String.raw`[&_.rs\_\_menu-notice]:py-1.5`,
    String.raw`[&_.rs\_\_menu-notice]:px-2`,
    String.raw`[&_.rs\_\_menu-notice]:text-sm`,
    String.raw`[&_.rs\_\_menu-notice]:leading-none`,
    String.raw`[&_.rs\_\_menu-notice]:font-normal`,
]);

export const ClassNames = {
    menu: () => menu({}),
    menuPortal: () => `!z-50`,
};
