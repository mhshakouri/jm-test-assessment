import { createSharedComposable, watchDebounced } from "@vueuse/core";
import { ref } from "vue";

const useSearchComposable = () => {
  const searchText = ref<string>();
  const searchAll = ref(false);
  const isSearching = ref(false);

  watchDebounced(
    searchText,
    (newSearchText?: string) => {
      isSearching.value = Boolean(newSearchText?.length);
    },
    { debounce: 250, maxWait: 500 }
  );

  return {
    searchText,
    searchAll,
    isSearching
  };
};

export const useSearch = createSharedComposable(useSearchComposable);
