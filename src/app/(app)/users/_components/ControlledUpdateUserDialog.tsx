'use client';

import useUpdateUserDialog from '../_hooks/useUpdateUserDialog';
import UpdateUserDialog from './UpdateUserDialog';

export type ControlledUpdateUserDialogProps = {};

export default function ControlledUpdateUserDialog({}: ControlledUpdateUserDialogProps) {
    const open = useUpdateUserDialog((state) => state.open);

    const user = useUpdateUserDialog((state) => state.user);

    const closeDialog = useUpdateUserDialog((state) => state.closeDialog);

    return <UpdateUserDialog open={open} user={user} onClose={closeDialog} />;
}
