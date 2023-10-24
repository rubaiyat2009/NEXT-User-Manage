import { UpdateUserFormData } from '@/app/_schemas/UpdateUserFormDataSchema';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type UpdateUserDialogState = {
    open?: boolean;
    user?: UpdateUserFormData;
    openDialog: (user: UpdateUserFormData) => void;
    closeDialog: () => void;
};

const useUpdateUserDialog = create<UpdateUserDialogState>()(
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

export default useUpdateUserDialog;
