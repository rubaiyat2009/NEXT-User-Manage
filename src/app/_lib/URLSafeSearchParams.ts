import superjson from 'superjson';
import rison from 'rison';

export function serialize(value: unknown) {
    const { meta, json } = superjson.serialize(value);

    return {
        meta: meta ? rison.encode(meta) : undefined,
        json: rison.encode(json),
    };
}

export function deserialize<T>({ meta, json }: { meta?: string; json: string }): T {
    return superjson.deserialize({
        meta: meta ? rison.decode(meta) : undefined,
        json: rison.decode(json),
    });
}

const URLSafeSearchParams = {
    serialize,
    deserialize,
};

export default URLSafeSearchParams;
