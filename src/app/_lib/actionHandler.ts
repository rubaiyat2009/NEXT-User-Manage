import { toast } from '@/app/_components/ui/use-toast';
import superjson from 'superjson';
import useConfirmDialog from '@/app/_hooks/useConfirmDialog';

type ToastProp = Parameters<typeof toast>[number];

/**
 * Creates an action handler that handles the toast when a request is fulfilled or rejected. Form data and result are
 * serialized and deserialized using superjson.
 *
 * @param onFulfilled
 * @param onRejected
 * @param confirm
 */
export function createOnSubmit<FORM_DATA, RESULT = void>(
    onFulfilled: (value: FORM_DATA, result?: RESULT) => ToastProp = () => ({
        variant: 'default',
        title: 'Request fulfilled',
    }),
    onRejected: (value: FORM_DATA, error: Error) => ToastProp = (_, error) => ({
        variant: 'destructive',
        title: 'Request rejected',
        description: error.message,
    }),
    confirm?: (value: FORM_DATA) => {
        title: string;
        description: string;
    },
) {
    return (
        fn: (value: FORM_DATA) => Promise<RESULT>,
        onSuccess?: (value: FORM_DATA, result?: RESULT) => void,
        onFailed?: () => void,
    ) => {
        return async (value: FORM_DATA) => {
            try {
                const _fn = async () => {
                    const { meta, json } = superjson.serialize(value);

                    const result = (await fn({
                        meta,
                        json,
                    } as any)) as any;

                    const deserialized: RESULT | undefined = result
                        ? superjson.deserialize(result)
                        : undefined;

                    if (deserialized instanceof Error) {
                        throw deserialized;
                    } else {
                        toast(onFulfilled(value, deserialized));
                        onSuccess?.(value, deserialized);
                    }
                };

                if (confirm) {
                    const { title, description } = confirm(value);
                    await useConfirmDialog.getState().confirm(title, description, _fn);
                } else {
                    await _fn();
                }
            } catch (e: any) {
                console.error(e, value);
                toast(onRejected(value, e));
                onFailed?.();
            }
        };
    };
}

export function createHandler<FORM_DATA, RESULT>(fn: (value: FORM_DATA) => Promise<RESULT>) {
    return async (value: FORM_DATA) => {
        const { meta, json } = superjson.serialize(value);

        const result = (await fn({
            meta,
            json,
        } as any)) as any;

        const deserialized: RESULT = superjson.deserialize(result);

        if (deserialized instanceof Error) {
            throw deserialized;
        }

        return deserialized;
    };
}
