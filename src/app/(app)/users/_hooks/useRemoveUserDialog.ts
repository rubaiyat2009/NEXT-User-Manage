import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { RemoveUserFormData } from '@/app/_schemas/RemoveUserFormDataSchema';

export type RemoveUserDialogState = {
    open?: boolean;
    user?: RemoveUserFormData;
    openDialog: (driver: RemoveUserFormData) => void;
    closeDialog: () => void;
};

const useRemoveUserDialog = create<RemoveUserDialogState>()(
    immer((set) => ({
        openDialog: (user) =>
            set((draft) => {
                draft.open = true;
                draft.user = user;
            }),
        closeDialog: () =>
            set((draft) => {
                draft.open = false;
                draft.user = undefined;
            }),
    })),
);

export default useRemoveUserDialog;
