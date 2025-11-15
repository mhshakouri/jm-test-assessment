import type { Ref, MaybeRefOrGetter } from "vue";

interface _UseFetchAsyncData<DataT extends unknown, ErrorT = unknown> {
    data: Ref<DataT>;
    pending: Ref<boolean>;
    execute: () => Promise<void>;
    error: Ref<ErrorT | undefined>;
}

type UseFetchAsyncData<Data extends unknown, Error = unknown> = _UseFetchAsyncData<Data, Error> & Promise<_UseFetchAsyncData<Data, Error>>;

type KeyType = string | (() => string) | MaybeRefOrGetter<string>;

interface UseFetchAsyncDataOptions {
    immediate?: boolean;
    server?: boolean;
}

export declare function useFetchAsyncData<DataT extends unknown, ErrorT = unknown>(
    key: KeyType,
    handler: () => Promise<DataT>,
    options?: UseFetchAsyncDataOptions
): UseFetchAsyncData<DataT, ErrorT>;

export type { UseFetchAsyncData, UseFetchAsyncDataOptions };