import type { LeanPopulatedPickupRequest } from '@/app/_models';

export function hasScheduleDate(
    value: any,
): value is Exclude<LeanPopulatedPickupRequest, { status: 'RESCHEDULED' | 'DROPPED_OFF' }> {
    return !['RESCHEDULED', 'DROPPED_OFF'].includes(value.status);
}
