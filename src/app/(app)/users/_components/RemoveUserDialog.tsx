import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/app/_components/ui/alert-dialog';
import { Button } from '@/app/_components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/app/_lib/utils';
import { useForm } from 'react-hook-form';
import {
    RemoveUserFormData,
    RemoveUserFormDataSchema,
} from '@/app/_schemas/RemoveUserFormDataSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOnSubmit } from '@/app/_lib/actionHandler';
import { removeUser } from '@/app/_actions/removeUser';

export type RemoveUserDialogProps = {
    open?: boolean;
    user?: RemoveUserFormData;
    onClose: () => void;
};

export default function RemoveUserDialog({ open, user, onClose }: RemoveUserDialogProps) {
    const form = useForm({
        resolver: zodResolver(RemoveUserFormDataSchema),
        values: user,
    });

    return (
        <AlertDialog open={open}>
            <AlertDialogContent asChild>
                <form
                    noValidate
                    onSubmit={form.handleSubmit(onSubmit(removeUser, onClose), (errors) => {
                        console.error(errors);
                    })}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove User ID {user?._id as string}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You&apos;re about to remove this user. This action can&apos;t be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button
                                variant="link"
                                type="button"
                                disabled={form.formState.isSubmitting}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                type="submit"
                                variant="outline"
                                className={cn(
                                    '[&_span]:text-destructive',
                                    '[&_span]:border-destructive',
                                )}
                                loading={form.formState.isSubmitting}
                            >
                                <FontAwesomeIcon icon={faTrash} className={cn('mr-2')} size="xs" />
                                <span>Remove user</span>
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const onSubmit = createOnSubmit<RemoveUserFormData>(
    (value) => ({
        title: `User ID ${value._id} has been removed`,
        variant: 'default',
    }),
    (value, error) => ({
        title: `Failed to remove user ID ${value._id}`,
        variant: 'destructive',
        description: error.message,
    }),
);
