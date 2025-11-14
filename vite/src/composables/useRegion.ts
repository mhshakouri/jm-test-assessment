import { ref } from "vue";
import { UiSelectOption } from "../types/ui/select";
import { createSharedComposable } from "@vueuse/core";

const useRegionComposable = () => {
  const region = ref<UiSelectOption["value"]>();
  return {
    region,
  };
};

export const useRegion = createSharedComposable(useRegionComposable);
