import { createSharedComposable } from "@vueuse/core";
import { ref } from "vue";

const useSearchComposable = () => {
  const searchText = ref<string>();

  return {
    searchText,
  };
};

export const useSearch = createSharedComposable(useSearchComposable);
