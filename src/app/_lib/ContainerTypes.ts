export const Values = [
    '20GP',
    '40GP',
    '40HQ',
    '45HQ',
    '20 OPEN TOP',
    '40 OPEN TOP',
    '20 FLAT RACK',
    '40 FLAT RACK',
    '20RF',
    '40RF',
    'ISOTANK',
] as const;

export const Mapping: Record<string, string> = Object.fromEntries(
    Values.map((value) => [value, value]),
);

export const Options = Object.entries(Mapping).map(([value, label]) => ({ value, label }));
