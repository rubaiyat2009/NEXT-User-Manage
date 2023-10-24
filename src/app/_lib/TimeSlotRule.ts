import {
    OperationTimeSlot,
    SaveOperationTimeSlots,
} from '@/app/_schemas/SaveOperationTimeSlotsSchema';
import { startCase } from 'lodash-es';
import { SaveExceptionTimeSlot } from '@/app/_schemas/SaveExceptionTimeSlotSchema';
import { DateTime, Interval } from 'luxon';

/**
 * Time slot rule. Used to validate time slot for pickup request.
 *
 */
export default class TimeSlotRule {
    workingDays: Record<string, boolean>;
    operatingTimeSlot?: Record<string, OperationTimeSlot[]> | null;
    exceptionTimeSlots: {
        [K in keyof Omit<
            SaveExceptionTimeSlot,
            '_id' | 'announcement'
        >]: SaveExceptionTimeSlot[K] extends Date ? DateTime : SaveExceptionTimeSlot[K];
    }[];

    constructor(
        operatingTimeSlot?: Omit<
            SaveOperationTimeSlots,
            '_id' | 'updated_at' | 'created_at'
        > | null,
        exceptionTimeSlots: Omit<SaveExceptionTimeSlot, '_id' | 'announcement'>[] = [],
    ) {
        if (operatingTimeSlot) {
            const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
                operatingTimeSlot;

            this.operatingTimeSlot = {
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday,
                sunday,
            };
        }

        this.workingDays = Object.fromEntries(
            Object.entries(
                this.operatingTimeSlot ?? {
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: [],
                    saturday: [],
                    sunday: [],
                },
            ).map(([day, slots]) => [startCase(day), !!slots.length]),
        );

        this.exceptionTimeSlots = exceptionTimeSlots.map(({ start_datetime, end_datetime }) => ({
            start_datetime: DateTime.fromJSDate(start_datetime),
            end_datetime: DateTime.fromJSDate(end_datetime),
        }));
    }

    /**
     * Validate date against operating time slots if any operating time slots are added.
     * @param date
     */
    public validate(date: Date) {
        if (!this.operatingTimeSlot) return true;

        const datetime = DateTime.fromJSDate(date);

        const intervals = Object.values(this.operatingTimeSlot).flatMap((slots) => {
            return slots.map(({ start_time, end_time }) => {
                return Interval.fromDateTimes(
                    DateTime.fromFormat(start_time, 'HH:mmZ').set({
                        year: datetime.year,
                        month: datetime.month,
                        day: datetime.day,
                    }),
                    DateTime.fromFormat(end_time, 'HH:mmZ').set({
                        year: datetime.year,
                        month: datetime.month,
                        day: datetime.day,
                    }),
                );
            });
        });

        const matched = !!intervals.find((interval) => interval.contains(datetime));

        if (!matched) {
            console.debug('TimeSlotRule.validate', 'no matching interval found');
            return false;
        }

        return !this.exceptionTimeSlots.find((interval) => {
            return Interval.fromDateTimes(interval.start_datetime, interval.end_datetime).contains(
                datetime,
            );
        });
    }

    /**
     * Check if date is a working day.
     * If no operating time slots are added, it is a working day.
     * If operating time slots are added, it is a working day if it is within the operating time slots.
     * Otherwise, it is not a working day.
     *
     * @param date
     */
    public isWorkingDay(date: Date) {
        if (!this.operatingTimeSlot) {
            return true;
        }

        const workingDay = DateTime.fromJSDate(date).weekdayLong!;

        const match = this.workingDays[workingDay];

        if (!match) {
            return false;
        }

        const datetime = DateTime.fromJSDate(date);

        const exceptions = this.exceptionTimeSlots.filter(({ start_datetime, end_datetime }) => {
            return Interval.fromDateTimes(
                start_datetime.startOf('day'),
                end_datetime.endOf('day'),
            ).contains(datetime);
        });

        if (!exceptions.length) {
            return true;
        }

        const operatingMinutes = this.operatingTimeSlot[workingDay.toLowerCase()]
            .map(({ start_time, end_time }) => {
                return DateTime.fromFormat(end_time, 'HH:mmZ')
                    .set({
                        year: datetime.year,
                        month: datetime.month,
                        day: datetime.day,
                    })
                    .diff(
                        DateTime.fromFormat(start_time, 'HH:mmZ').set({
                            year: datetime.year,
                            month: datetime.month,
                            day: datetime.day,
                        }),
                        ['minutes'],
                    )
                    .toObject().minutes!;
            })
            .reduce((acc, curr) => acc + curr, 0);

        const exceptionMinutes = exceptions
            .map(({ start_datetime, end_datetime }) => {
                return end_datetime.diff(start_datetime, ['minutes']).toObject().minutes!;
            })
            .reduce((acc, curr) => acc + curr, 0);

        return operatingMinutes > exceptionMinutes;
    }
}
