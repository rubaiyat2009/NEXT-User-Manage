'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/app/_components/ui/skeleton';
import { cn } from '@/app/_lib/utils';
import { DateTime } from 'luxon';

export type DateFormatterProps = {
    date?: string | Date | null | undefined | DateTime;
    format?: string;
    defaultText?: string;
};

export default function DateFormatter({
    date,
    format = 'dd/MM/yyyy',
    defaultText = 'N/A',
}: DateFormatterProps) {
    const [formatted, setFormatted] = useState('');

    useEffect(() => {
        if (!date) {
            setFormatted(defaultText);
            return;
        }
        if (date instanceof Date) {
            setFormatted(DateTime.fromJSDate(date).toFormat(format));
            return;
        }
        if (DateTime.isDateTime(date)) {
            setFormatted(date.toFormat(format));
            return;
        }
        setFormatted(DateTime.fromISO(date).toFormat(format));
    }, [date, format, defaultText]);

    if (!formatted) {
        return <Skeleton className={cn('h-3', 'w-[80px]', 'inline-block')} />;
    }

    return <>{formatted}</>;
}
