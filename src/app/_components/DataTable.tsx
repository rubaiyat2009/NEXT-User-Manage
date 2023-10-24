import {
    DataTablePagination,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/_components/ui/table';
import { cn } from '@/app/_lib/utils';
import { ColumnDef, flexRender } from '@tanstack/react-table';
import SortIndicator from '@/app/_components/SortIndicator';
import { Card } from '@/app/_components/ui/card';
import useControlledTable from '@/app/_hooks/useControlledTable';
import { QueryParams } from '@/app/_lib/search';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Button } from '@/app/_components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/_components/ui/tooltip';

export type DataTableProps<Data> = {
    data: Data[];
    q: QueryParams;
    total: number;
    columns: ColumnDef<Data>[];
    hideColumnVisibilityPicker?: boolean;
    hidePagination?: boolean;
};

export default function DataTable<Data>({
    data,
    columns,
    total,
    q,
    hideColumnVisibilityPicker,
    hidePagination,
}: DataTableProps<Data>) {
    const table = useControlledTable({
        data,
        columns,
        total,
        q,
    });

    return (
        <div className={cn('space-y-3')}>
            <div>
                {!hideColumnVisibilityPicker ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary">
                                Columns
                                <FontAwesomeIcon icon={faChevronDown} className={cn('ml-2')} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : null}
            </div>
            <Card>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className={cn('group')}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={cn(
                                            'font-semibold',
                                            'cursor-pointer',
                                            'relative',
                                        )}
                                        onClick={header.column.getToggleSortingHandler()}
                                        style={{
                                            width: header.getSize(),
                                        }}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <span
                                                className={cn(
                                                    'flex',
                                                    'gap-x-2',
                                                    'items-center',
                                                    'whitespace-nowrap',
                                                )}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                                {header.column.getCanSort() ? (
                                                    <SortIndicator
                                                        sort={header.column.getIsSorted()}
                                                        className={cn('group-hover:flex')}
                                                    />
                                                ) : null}
                                            </span>
                                        )}
                                        {header.column.getCanResize() ? (
                                            <Tooltip>
                                                <TooltipTrigger
                                                    className={cn(
                                                        'absolute',
                                                        'right-1',
                                                        'top-1/2',
                                                        '-translate-y-1/2',
                                                        'cursor-grab',
                                                        'select-none',
                                                        'touch-none',
                                                        'hidden',
                                                        'lg:group-hover:block',
                                                    )}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faGripVertical}
                                                        onMouseDown={header.getResizeHandler()}
                                                        onTouchStart={header.getResizeHandler()}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Drag to resize column</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : null}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className={cn('overflow-x-auto')}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={cn('text-black', 'text-sm', 'font-normal')}
                                        style={{
                                            width: cell.column.getSize(),
                                        }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {!hidePagination ? <DataTablePagination table={table} /> : null}
        </div>
    );
}
