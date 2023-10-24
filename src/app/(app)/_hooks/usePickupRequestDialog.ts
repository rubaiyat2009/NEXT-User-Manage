import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { DeepPartial } from 'react-hook-form';
import { SchedulePickupRequestFormData } from '@/app/_schemas/SchedulePickupRequestFormDataSchema';

export type PickupRequestDialogState = {
    open?: boolean;
    pickupRequest?: DeepPartial<SchedulePickupRequestFormData>;
    openDialog: (pickupRequest: DeepPartial<SchedulePickupRequestFormData>) => void;
    closeDialog: () => void;
};

const usePickupRequestDialog = create<PickupRequestDialogState>()(
    immer((set) => ({
        step: 0,
        closeDialog: () =>
            set((draft) => {
                draft.open = false;
            }),
        openDialog: (pickupRequest) =>
            set((draft) => {
                draft.open = true;
                draft.pickupRequest = pickupRequest;
            }),
    })),
);

export default usePickupRequestDialog;
