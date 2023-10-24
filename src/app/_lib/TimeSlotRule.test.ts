import TimeSlotRule from '@/app/_lib/TimeSlotRule';
import { DateTime } from 'luxon';

test('should be working days when no working timeslot provided', () => {
    const rule = new TimeSlotRule();
    expect(rule.validate(DateTime.fromISO('2021-01-01T00:00:00.000Z').toJSDate())).toBe(true);
});

test('should validate date is within time slot', () => {
    const rule = new TimeSlotRule(
        {
            monday: [
                {
                    start_time: '08:00+08',
                    end_time: '17:00+08',
                    max_capacity: 1,
                },
            ],
            friday: [
                {
                    start_time: '08:00+08',
                    end_time: '17:00+08',
                    max_capacity: 1,
                },
            ],
            saturday: [],
            sunday: [],
            thursday: [],
            tuesday: [],
            wednesday: [],
        },
        [
            {
                start_datetime: DateTime.fromISO('2023-10-02T00:00:00+08').toJSDate(),
                end_datetime: DateTime.fromISO('2023-10-02T24:00:00+08').toJSDate(),
            },
            {
                start_datetime: DateTime.fromISO('2023-10-06T08:00:00+08').toJSDate(),
                end_datetime: DateTime.fromISO('2023-10-06T10:00:00+08').toJSDate(),
            },
        ],
    );
    expect(rule.validate(DateTime.fromISO('2023-09-29T08:00:00+08').toJSDate())).toBe(true);
    expect(rule.validate(DateTime.fromISO('2023-09-29T20:00:00.000Z').toJSDate())).toBe(false);
    expect(rule.validate(DateTime.fromISO('2023-10-06T09:00:00+08').toJSDate())).toBe(false);
});

test.skip('should be working days when date has time slot', () => {
    const rule = new TimeSlotRule(
        {
            monday: [
                {
                    start_time: '08:00+08',
                    end_time: '17:00+08',
                    max_capacity: 1,
                },
            ],
            friday: [
                {
                    start_time: '08:00+08',
                    end_time: '17:00+08',
                    max_capacity: 1,
                },
            ],
            saturday: [],
            sunday: [],
            thursday: [],
            tuesday: [],
            wednesday: [],
        },
        [
            {
                start_datetime: DateTime.fromISO('2023-10-02T00:00:00+08').toJSDate(),
                end_datetime: DateTime.fromISO('2023-10-02T24:00:00+08').toJSDate(),
            },
            {
                start_datetime: DateTime.fromISO('2023-10-06T08:00:00+08').toJSDate(),
                end_datetime: DateTime.fromISO('2023-10-06T10:00:00+08').toJSDate(),
            },
        ],
    );

    expect(rule.isWorkingDay(DateTime.fromISO('2023-09-29T08:00:00+08').toJSDate())).toBe(true);
    expect(rule.isWorkingDay(DateTime.fromISO('2023-09-30T08:00:00+08').toJSDate())).toBe(false);
    expect(rule.isWorkingDay(DateTime.fromISO('2023-10-02T08:00:00+08').toJSDate())).toBe(false);
    expect(rule.isWorkingDay(DateTime.fromISO('2023-10-06T09:00:00+08').toJSDate())).toBe(true);
});
