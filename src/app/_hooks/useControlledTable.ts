import {
    ColumnDef,
    functionalUpdate,
    getCoreRowModel,
    getSortedRowModel,
    PaginationState,
    RowData,
    SortingState,
    Updater,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { QueryParams, toURLSearchParams } from '@/app/_lib/search';

export type ControlledTableProps<TData extends RowData> = {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    q: QueryParams;
    total: number;
};

export default function useControlledTable<TData extends RowData>({
    data,
    columns,
    q,
    total,
}: ControlledTableProps<TData>) {
    const { sorting, pageSize, pageIndex, filter } = q;

    const router = useRouter();

    const pathname = usePathname();

    const onSortingChange = useCallback(
        (updater: Updater<SortingState>) => {
            const newSorting = functionalUpdate(updater, sorting);

            const { meta, json } = toURLSearchParams({
                sorting: newSorting,
                pageSize,
                pageIndex,
                filter,
            });

            router.push(`${pathname}?meta=${meta}&q=${json}`);
        },
        [pathname, router, sorting, pageIndex, pageSize, filter],
    );

    const onPaginationChange = useCallback(
        (updater: Updater<PaginationState>) => {
            const newPageSize = functionalUpdate(updater, { pageIndex, pageSize });

            const { meta, json } = toURLSearchParams({
                sorting,
                filter,
                ...newPageSize,
            });

            router.push(`${pathname}?meta=${meta}&q=${json}`);
        },
        [pathname, router, sorting, pageIndex, pageSize, filter],
    );

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    return useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        state: {
            sorting,
            pagination: {
                pageSize,
                pageIndex,
            },
            columnVisibility,
        },
        onSortingChange,
        pageCount: Math.ceil(total / pageSize),
        onPaginationChange,
        onColumnVisibilityChange: setColumnVisibility,
        columnResizeMode: 'onChange',
    });
}
