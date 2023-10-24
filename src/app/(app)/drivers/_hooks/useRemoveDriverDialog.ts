import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { RemoveUserFormData } from '@/app/_schemas/RemoveUserFormDataSchema';

export type RemoveDriverDialogState = {
    open?: boolean;
    driver?: RemoveUserFormData;
    openDialog: (driver: RemoveUserFormData) => void;
    closeDialog: () => void;
};

const useRemoveDriverDialog = create<RemoveDriverDialogState>()(
    immer((set) => ({
        openDialog: (driver) =>
            set((draft) => {
                draft.open = true;
                draft.driver = driver;
            }),
        closeDialog: () =>
            set((draft) => {
                draft.open = false;
                draft.driver = undefined;
            }),
    })),
);

export default useRemoveDriverDialog;
