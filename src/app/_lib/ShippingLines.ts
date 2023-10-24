import { zip } from 'lodash-es';

export const Values = ['dhl'] as const;

const Labels = ['DHL Delivery'];

export const Mapping: Record<(typeof Values)[number], string> = Object.fromEntries(
    zip(Values, Labels),
);

export const Options = Object.entries(Mapping).map(([value, label]) => ({ value, label }));
