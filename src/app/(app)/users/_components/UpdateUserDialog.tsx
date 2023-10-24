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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOnSubmit } from '@/app/_lib/actionHandler';
import { updateUser } from '@/app/_actions/updateUser';
import {
    UpdateUserFormData,
    UpdateUserFormDataSchema,
} from '@/app/_schemas/UpdateUserFormDataSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/app/_lib/utils';

export type UpdateUserDialogProps = {
    open?: boolean;
    user?: UpdateUserFormData;
    onClose: () => void;
};

export default function UpdateUserDialog({ open, user, onClose }: UpdateUserDialogProps) {
    const form = useForm({
        resolver: zodResolver(UpdateUserFormDataSchema),
        values: { ...user, disabled: !user?.disabled },
    });

    return (
        <AlertDialog open={open}>
            <AlertDialogContent asChild>
                <form
                    noValidate
                    // @ts-ignore
                    onSubmit={form.handleSubmit(onSubmit(updateUser, onClose), (errors) => {
                        console.error(errors);
                    })}
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {user?.disabled ? 'Enable' : 'Disable'} User ID {user?._id as string}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You&apos;re about to {user?.disabled ? 'enable' : 'disable'} this user.
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
                                <FontAwesomeIcon icon={faBan} className={cn('mr-2')} size="xs" />
                                <span>{user?.disabled ? 'Enable' : 'Disable'}</span>
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const onSubmit = createOnSubmit<UpdateUserFormData>(
    (value) => ({
        title: `User ID ${value._id} has been updated`,
        variant: 'default',
    }),
    (value, error) => ({
        title: `Failed to update user ID ${value._id}`,
        variant: 'destructive',
        description: error.message,
    }),
);
