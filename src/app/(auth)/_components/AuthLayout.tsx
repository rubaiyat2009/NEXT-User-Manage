import { cn } from '@/app/_lib/utils';
import NextImage from 'next/image';
import background from '@/app/(auth)/_assets/background.png';
import layer1 from '@/app/(auth)/_assets/layer1.png';
import brand from '@/app/_assets/brand.png';
import { PropsWithChildren } from 'react';

export type LayoutProps = PropsWithChildren;

export default function AuthLayout({ children }: LayoutProps) {
    return (
        <div className={cn('flex')}>
            <div className={cn('hidden', 'lg:block', 'w-[400px]', 'relative')}>
                <NextImage
                    src={background}
                    alt="background"
                    className={cn('h-screen', 'object-cover')}
                    priority
                />
                <div
                    className={cn(
                        'w-full',
                        'h-full',
                        'absolute',
                        'top-0',
                        'left-0',
                        'opacity-80',
                        'bg-primary',
                    )}
                />
                <NextImage
                    src={layer1}
                    alt="layer"
                    className={cn(
                        'absolute',
                        'top-1/2',
                        '-translate-y-1/2',
                        'w-72',
                        '-translate-x-1/2',
                        'left-1/2',
                    )}
                    priority
                />
                <NextImage
                    src={brand}
                    alt="brand: Continer Depo"
                    className={cn(
                        'absolute',
                        'top-0',
                        'w-36',
                        'translate-x-1/2',
                        'right-1/2',
                        'top-9',
                    )}
                    priority
                />
            </div>
            <div className={cn('mx-auto', 'flex', 'items-center', 'justify-center')}>
                {children}
            </div>
        </div>
    );
}
