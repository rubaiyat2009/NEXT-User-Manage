'use client';

import { cn } from '@/app/_lib/utils';
import blockIcon from './../../../_assets/icons/blocked.svg';
import Image from 'next/image';
export default function BlockNotificationDialog() {
    return (
        <div
            className={cn(
                'bg-[#9E9E9E9E]',
                'fixed',
                'h-screen',
                'w-screen',
                'top-0',
                'left-0',
                'flex',
                'justify-center',
                'items-center',
            )}
        >
            <div
                className={cn(
                    'bg-white',
                    'max-w-2xl',
                    'w-screen',
                    'rounded',
                    'p-10',
                    'md:p-24',
                    'flex',
                    'flex-col',
                    'justify-center',
                    'items-center',
                    'text-center',
                    'gap-3',
                )}
            >
                <Image height={82} width={94} src={blockIcon} alt="blocked" />
                <h2 className={cn('font-bold', 'text-lg', 'text-[#F12525]')}>Account Disabled</h2>
                <p className="text-[#363636]">
                    This account has been temporarily disabled due to unforeseen circumstances.
                    Please reach out to KarbonX for further information or if you require any
                    assistance.
                </p>
            </div>
        </div>
    );
}
