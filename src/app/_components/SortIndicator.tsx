import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAsc, faSortDesc } from '@fortawesome/free-solid-svg-icons';
import { SortDirection } from '@tanstack/react-table';
import { cn } from '@/app/_lib/utils';

export type SortIndicatorProps = {
    sort: SortDirection | false;
    className?: string;
};

export default function SortIndicator({ sort, className }: SortIndicatorProps) {
    if (sort === 'desc') {
        return <FontAwesomeIcon icon={faSortDesc} size="sm" className={className} />;
    }

    if (sort === 'asc') {
        return <FontAwesomeIcon icon={faSortAsc} size="sm" className={className} />;
    }

    return (
        <div className={cn('-space-y-2.5', 'flex', 'flex-col', 'hidden', className)}>
            <FontAwesomeIcon icon={faSortAsc} size="sm" />
            <FontAwesomeIcon icon={faSortDesc} size="sm" />
        </div>
    );
}
