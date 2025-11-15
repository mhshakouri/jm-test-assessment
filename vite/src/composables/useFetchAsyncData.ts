import { computed, inject, MaybeRefOrGetter, ref, toValue, watch, type Ref } from "vue";
import type { SSRContext } from "vue/server-renderer";
import type {
  UseFetchAsyncData,
  UseFetchAsyncDataOptions,
} from "../types/composables/use-fetch-data";

// NOTE: this composable is hugely inspired by Nuxt's useAsyncData,

// Global cache for fetched data, keyed by fetch key
// This cache persists across component instances and region changes
// Each cache entry contains the data and timestamp when it was cached
interface CacheEntry {
  data: unknown;
  timestamp: number;
}
const fetchCache = new Map<string, CacheEntry>();

// Default cache time: 5 minutes (300000ms)
const DEFAULT_CACHE_TIME = 1000 * 60 * 5;

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

  // Track if data was hydrated from SSR and which key was hydrated
  let isHydrated = false;
  let hydratedKey: string | null = null;

  // Determine cache settings
  const shouldCache = options.cache !== false; // Default to true if not explicitly false
  const cacheTime = shouldCache 
    ? (options.cacheTime ?? DEFAULT_CACHE_TIME) 
    : 0;

  // Helper function to check if cache entry is valid (not expired)
  const isCacheValid = (entry: CacheEntry): boolean => {
    if (!shouldCache) return false;
    const now = Date.now();
    return (now - entry.timestamp) < cacheTime;
  };

  async function execute() {
    if (pending.value) return;
    const currentKey = key.value;
    
    // Check cache first - if we have valid cached data for this key, use it
    if (!import.meta.env.SSR && shouldCache && fetchCache.has(currentKey)) {
      const cacheEntry = fetchCache.get(currentKey)!;
      if (isCacheValid(cacheEntry)) {
        const cachedData = cacheEntry.data as DataT;
        data.value = cachedData;
        // Mark as hydrated since we're using cached data
        isHydrated = true;
        hydratedKey = currentKey;
        return;
      } else {
        // Cache expired, remove it
        fetchCache.delete(currentKey);
      }
    }
    
    // Skip if data was hydrated from SSR for the SAME key (client-side only)
    // If the key changed, we need to fetch new data
    if (!import.meta.env.SSR && isHydrated && hydratedKey === currentKey) {
      return;
    }
    
    pending.value = true;
    error.value = undefined;
    try {
      const result = await _handler();
      data.value = result as DataT;
      
      // Cache the fetched data (client-side only) if caching is enabled
      if (!import.meta.env.SSR && shouldCache) {
        fetchCache.set(currentKey, {
          data: result,
          timestamp: Date.now(),
        });
        // Reset hydration state after successful fetch - we now have fresh data
        isHydrated = false;
        hydratedKey = null;
      }
      
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
  // Use a watcher to handle reactive keys that might change after route is ready
  if (!import.meta.env.SSR && typeof window !== "undefined") {
    const hydrateData = () => {
      const currentKey = key.value;
      // If already hydrated for this key, skip
      if (isHydrated && hydratedKey === currentKey) return;
      
      // Check cache first (if caching is enabled)
      if (shouldCache && fetchCache.has(currentKey)) {
        const cacheEntry = fetchCache.get(currentKey)!;
        if (isCacheValid(cacheEntry)) {
          const cachedData = cacheEntry.data as DataT;
          data.value = cachedData;
          isHydrated = true;
          hydratedKey = currentKey;
          return;
        } else {
          // Cache expired, remove it
          fetchCache.delete(currentKey);
        }
      }
      
      try {
        const ssrDataRaw = (window as any).__SSR_DATA__?.[currentKey];
        if (ssrDataRaw) {
          const parsedData = JSON.parse(ssrDataRaw) as DataT;
          data.value = parsedData;
          // Cache SSR data as well (if caching is enabled)
          if (shouldCache) {
            fetchCache.set(currentKey, {
              data: parsedData,
              timestamp: Date.now(),
            });
          }
          isHydrated = true;
          hydratedKey = currentKey;
        } else {
          // No SSR data for this key, reset hydration state
          isHydrated = false;
          hydratedKey = null;
        }
      } catch (err) {
        error.value = err as unknown as ErrorT;
        isHydrated = false;
        hydratedKey = null;
      }
    };

    // Try to hydrate immediately
    hydrateData();

    // Watch the key and re-hydrate when it changes
    // This handles the case where the key is computed from route query params or region filter
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
