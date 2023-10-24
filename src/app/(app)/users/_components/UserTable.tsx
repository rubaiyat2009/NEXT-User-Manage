'use client';

import type { LeanUser } from '@/app/_models';
import { ColumnDef } from '@tanstack/react-table';
import DateFormatter from '@/app/_components/DateFormatter';
import { cn } from '@/app/_lib/utils';
import { QueryParams } from '@/app/_lib/search';
import DataTable from '@/app/_components/DataTable';
import { Can } from '@/app/_components/Ability';
import { Button } from '@/app/_components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useRemoveUserDialog from '@/app/(app)/users/_hooks/useRemoveUserDialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import useUpdateUserDialog from '../_hooks/useUpdateUserDialog';

export type UserTableProps = {
    users: LeanUser[];
    q: QueryParams;
    total: number;
};

export default function UserTable({ users, q, total }: UserTableProps) {
    return <DataTable data={users} q={q} total={total} columns={columns} />;
}

const columns = [
    {
        id: 'Name',
        header: 'Name',
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    },
    {
        id: 'Email',
        accessorKey: 'email',
        header: 'Email',
    },
    {
        id: 'Role',
        accessorKey: 'role',
        header: 'Role',
    },
    {
        id: 'Status',
        accessorKey: 'email_verified',
        header: 'Status',
        cell: (info) => (
            <span
                className={cn({
                    'text-green-500': info.getValue(),
                    'text-yellow-400': !info.getValue(),
                })}
            >
                {info.getValue() ? 'Verified' : 'Unverified'}
            </span>
        ),
    },
    {
        id: 'Date added',
        accessorKey: 'created_at',
        header: 'Date added',
        cell: (info) => <DateFormatter date={info.getValue<Date>()} />,
    },
    {
        enableHiding: false,
        enableResizing: false,
        header: 'Actions',
        cell: (info) => {
            return (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="icon" size="icon">
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => {
                                    useUpdateUserDialog.getState().openDialog(info.row.original);
                                }}
                            >
                                {info.row.original.disabled ? 'Enable' : 'Disable'}
                            </DropdownMenuItem>

                            <Can I="delete" this={info.row.original}>
                                <DropdownMenuItem
                                    onClick={() =>
                                        useRemoveUserDialog.getState().openDialog(info.row.original)
                                    }
                                >
                                    Delete
                                </DropdownMenuItem>
                            </Can>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
] satisfies ColumnDef<LeanUser>[];
