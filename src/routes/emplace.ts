export const emplace = <K, V>(
    map: Map<K, V>,
    key: K,
    {insert, update}: {insert: () => V, update: (existing: V) => V},
) => {
    if (map.has(key)) {
        map.set(key, update(map.get(key)!));
    } else {
        map.set(key, insert());
    }
};

export const update = <K, V>(
    map: Map<K, V>,
    key: K,
    fn: (existing: V) => V,
) => {
    if (!map.has(key)) return;

    map.set(key, fn(map.get(key)!));
};