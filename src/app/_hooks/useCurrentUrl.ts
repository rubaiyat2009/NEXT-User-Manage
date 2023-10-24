import { usePathname, useSearchParams } from 'next/navigation';
import { SiteUrl } from '@/app/_lib/Urls';

export default function useCurrentUrl() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    return `${SiteUrl}${pathname}?${searchParams}`;
}
