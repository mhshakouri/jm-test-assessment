import { computed, inject, MaybeRefOrGetter, ref, toValue, watch, type Ref } from "vue";
import type { SSRContext } from "vue/server-renderer";
import type {
  UseFetchAsyncData,
  UseFetchAsyncDataOptions,
} from "../types/composables/use-fetch-data";

// NOTE: this composable is hugely inspired by Nuxt's useAsyncData

/**
 * Implements composable similar to Nuxt's useAsyncData,
 * typed as in ../types/composables/use-fetch-data.d.ts
 */
export function useFetchAsyncData<DataT extends unknown, ErrorT = unknown>(
  _key: string | (() => string) | MaybeRefOrGetter<string>,
  _handler: () => Promise<DataT>,
  options: UseFetchAsyncDataOptions = { immediate: true, server: true }
): UseFetchAsyncData<DataT, ErrorT> {
  const ssrContext = inject("ssrContext", null) as SSRContext | null;
  const data: Ref<DataT> = ref<DataT>() as Ref<DataT>;
  const pending = ref<boolean>(false);
  const error = ref<ErrorT | undefined>();

  const key = computed<string>(() => {
    if (typeof _key === "function") {
      return toValue(_key());
    }
    return toValue(_key);
  });
  if (typeof key.value !== "string") {
    throw new TypeError("[useFetchAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[useFetchAsyncData] handler must be a function.");
  }

  async function execute() {
    if (pending.value) return;
    const currentKey = key.value;
    
    pending.value = true;
    error.value = undefined;
    try {
      const result = await _handler();
      data.value = result as DataT;
      
      if (import.meta.env.SSR && ssrContext && options.server) {
        ssrContext.data = ssrContext.data || {};
        ssrContext.data[currentKey] = JSON.stringify(result as DataT);
      }
    } catch (err) {
      error.value = err as unknown as ErrorT;
    } finally {
      pending.value = false;
    }
  }

  // Restore from SSR data if available on client
  if (!import.meta.env.SSR && typeof window !== "undefined") {
    const hydrateData = () => {
      const currentKey = key.value;
      
      // Skip if data already exists
      if (data.value) return;
      
      try {
        const ssrDataRaw = (window as any).__SSR_DATA__?.[currentKey];
        if (ssrDataRaw) {
          const parsedData = JSON.parse(ssrDataRaw) as DataT;
          data.value = parsedData;
        }
      } catch (err) {
        error.value = err as unknown as ErrorT;
      }
    };

    // Try to hydrate immediately
    hydrateData();

    // Watch the key and re-hydrate when it changes
    watch(key, () => {
      hydrateData();
    }, { immediate: false });
  }

  // SSR: trigger execution immediately if required
  if (import.meta.env.SSR && options.server && options.immediate) {
    (async () => await execute())();
  }

  // Client: execute immediately if required
  if (!import.meta.env.SSR && options.immediate && !data.value) {
    (async () => await execute())();
  }

  // Create a promise that executes only when awaited or if immediate is true
  const promise = options.immediate
    ? execute().then(() => ({
        data: data as Ref<DataT>,
        pending,
        execute,
        error,
      }))
    : Promise.resolve({
        data: data as Ref<DataT>,
        pending,
        execute,
        error,
      });

  // Attach async data fields to the returned promise, like Nuxt's useAsyncData
  Object.assign(promise, {
    data: data as Ref<DataT>,
    pending,
    execute,
    error,
  });

  return promise as UseFetchAsyncData<DataT, ErrorT>;
}
