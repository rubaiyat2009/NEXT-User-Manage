import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ConfirmDialogState = {
    open?: boolean;
    confirm: (title: string, description: string, fn: () => Promise<void>) => Promise<void>;
    title?: string;
    description?: string;
    loading?: boolean;
    no: () => void;
    yes: () => void;
    resolve?: (value: boolean) => void;
};

const useConfirmDialog = create<ConfirmDialogState>()(
    immer((set, get) => ({
        confirm: async (title, description, fn) => {
            const confirm = await new Promise<boolean>((resolve) => {
                set((draft) => {
                    draft.open = true;
                    draft.title = title;
                    draft.description = description;
                    draft.resolve = resolve;
                });
            });

            try {
                if (!confirm) return;
                set((draft) => {
                    draft.loading = true;
                });
                await fn();
            } finally {
                set((draft) => {
                    draft.loading = undefined;
                    draft.open = false;
                    draft.title = undefined;
                    draft.description = undefined;
                });
            }
        },
        no: () =>
            set((draft) => {
                draft.open = false;
                draft.title = undefined;
                draft.description = undefined;
                get().resolve?.(false);
            }),
        yes: () =>
            set((draft) => {
                draft.open = false;
                draft.title = undefined;
                draft.description = undefined;
                get().resolve?.(true);
            }),
    })),
);

export default useConfirmDialog;
