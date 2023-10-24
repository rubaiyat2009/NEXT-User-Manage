import URLSafeSearchParams from '@/app/_lib/URLSafeSearchParams';
import { SortingState } from '@tanstack/react-table';
import { SortOrder } from 'mongoose';

export type QueryParams = {
    sorting: SortingState;
    sort: { [key: string]: SortOrder };
    pageSize: number;
    limit: number;
    skip: number;
    pageIndex: number;
    filter: Record<string, any>;
};

export function toURLSearchParams({
    sorting,
    pageSize,
    pageIndex,
    filter,
}: Pick<QueryParams, 'sorting' | 'pageSize' | 'pageIndex' | 'filter'>) {
    const { meta = '', json } = URLSafeSearchParams.serialize({
        sorting,
        pageSize,
        pageIndex,
        filter,
    });

    return {
        meta,
        json,
    };
}

export function fromURLSearchParams(searchParams: {
    [key: string]: string | string[] | undefined;
}): QueryParams {
    if (!('meta' in searchParams && 'q' in searchParams)) {
        return {
            sorting: [],
            sort: {
                updated_at: 'desc',
            },
            pageSize: 10,
            pageIndex: 0,
            limit: 10,
            skip: 0,
            filter: {},
        };
    }

    if (typeof searchParams.q !== 'string' || typeof searchParams.meta !== 'string') {
        return {
            sorting: [],
            sort: {
                updated_at: 'desc',
            },
            pageSize: 10,
            pageIndex: 0,
            limit: 10,
            skip: 0,
            filter: {},
        };
    }

    try {
        const params = URLSafeSearchParams.deserialize<QueryParams>({
            meta: searchParams.meta.trim() || undefined,
            json: searchParams.q,
        });

        return {
            sorting: params.sorting,
            sort: Object.fromEntries(
                params.sorting.map(({ id, desc }) => [id, desc ? 'desc' : 'asc']),
            ),
            pageSize: params.pageSize,
            pageIndex: params.pageIndex,
            limit: params.pageSize,
            skip: params.pageIndex * params.pageSize,
            filter: params.filter,
        };
    } catch (e) {
        console.error('unable to parse search params', e);
        return {
            sorting: [],
            sort: {
                updated_at: 'desc',
            },
            pageSize: 10,
            pageIndex: 0,
            limit: 10,
            skip: 0,
            filter: {},
        };
    }
}
