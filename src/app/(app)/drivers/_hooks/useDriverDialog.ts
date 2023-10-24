import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { DeepPartial } from 'react-hook-form';
import { SaveDriverFormData } from '@/app/_schemas/SaveDriverFormDataSchema';

export type DriverDialogState = {
    open?: boolean;
    driver?: DeepPartial<SaveDriverFormData>;
    openDialog: (driver?: DeepPartial<SaveDriverFormData>) => void;
    closeDialog: () => void;
};

const useDriverDialog = create<DriverDialogState>()(
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

export default useDriverDialog;
