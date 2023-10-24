import { cn } from '@/app/_lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <span className={cn('animate-pulse rounded-md bg-zinc-200', className)} {...props} />;
}

export { Skeleton };
