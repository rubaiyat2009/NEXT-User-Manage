'use client';

import RemoveUserDialog from '@/app/(app)/users/_components/RemoveUserDialog';
import useRemoveUserDialog from '@/app/(app)/users/_hooks/useRemoveUserDialog';

export type ControlledRemoveUserDialogProps = {};

export default function ControlledRemoveUserDialog({}: ControlledRemoveUserDialogProps) {
    const open = useRemoveUserDialog((state) => state.open);

    const user = useRemoveUserDialog((state) => state.user);

    const closeDialog = useRemoveUserDialog((state) => state.closeDialog);

    return <RemoveUserDialog open={open} user={user} onClose={closeDialog} />;
}
