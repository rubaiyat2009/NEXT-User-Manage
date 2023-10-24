import DataTable from '@/app/_components/DataTable';
import type { Meta, StoryObj } from '@storybook/react';
import { Types } from 'mongoose';

const meta: Meta<typeof DataTable> = {
    component: DataTable,
    tags: ['autodocs'],
    args: {
        data: [
            {
                email: 'test@gmail.com',
                telephone: '1234567890',
                last_name: 'San',
                first_name: 'Sham',
                haulier: new Types.ObjectId(),
                email_verified: false,
                role: 'Driver',
                _id: 'abc123',
                created_at: new Date(),
                updated_at: new Date(),
                plate_no: 'WPH280',
                truck_id: '12431',
            },
            {
                email: 'test@gmail.com',
                telephone: '1234567890',
                last_name: 'San',
                first_name: 'Sham',
                email_verified: false,
                role: 'Driver',
                _id: 'abc123',
                created_at: new Date(),
                updated_at: new Date(),
                plate_no: 'WUM5716',
                truck_id: '43666',
                haulier: new Types.ObjectId(),
            },
        ],
        columns: [
            {
                id: 'Name',
                header: 'Name',
                accessorFn: (row: any) => `${row.first_name} ${row.last_name}`,
            },
            {
                id: 'Email',
                accessorKey: 'email',
                header: 'Email',
                cell: (info) => info.getValue(),
            },
            {
                id: 'Telephone',
                accessorKey: 'telephone',
                header: 'Telephone',
                cell: (info) => info.getValue(),
            },
            {
                id: 'Truck ID',
                accessorKey: 'truck_id',
                header: 'Truck ID',
                cell: (info) => info.getValue(),
                enableHiding: false,
            },
            {
                id: 'Plate no.',
                accessorKey: 'plate_no',
                header: 'Plate no.',
                cell: (info) => info.getValue(),
                enableResizing: false,
            },
        ],
        total: 2,
        q: {
            sorting: [],
            pageIndex: 0,
            pageSize: 10,
            skip: 0,
            limit: 10,
            sort: {},
            filter: {},
        },
    },
};

export default meta;

type Story = StoryObj<typeof DataTable>;

export const Primary: Story = {};
