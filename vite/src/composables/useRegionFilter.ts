import { useRouter } from "vue-router";
import { UiSelectOption } from "../types/ui/select";
import { useRegion } from "./useRegion";
import { computed, watch, ref, nextTick } from "vue";

export const useRegionFilter = () => {
  const { region } = useRegion();
  const { currentRoute, push } = useRouter();
  const regionRouteQuery = computed(() => currentRoute.value.query.region);
  const hasRegionRouteQuery = computed(
    () => regionRouteQuery.value !== undefined
  );

  // Flag to prevent infinite loop when syncing from route
  const isSyncingFromRoute = ref(false);

  const regionFilter = computed(() => region.value ?? regionRouteQuery.value);

  const updateRegionRouteQuery = async () => {
    // Don't update route if we're syncing from route changes
    if (isSyncingFromRoute.value) return;

    if (region.value) {
      const newQuery = { ...currentRoute.value.query, region: region.value };
      await push({ ...currentRoute.value, query: newQuery });
      return;
    }
    if (hasRegionRouteQuery.value) {
      const newQuery = { ...currentRoute.value.query };
      delete newQuery.region;
      await push({ ...currentRoute.value, query: newQuery });
    }
  };

  const setRegion = async (regionValue?: UiSelectOption["value"]) => {
    region.value = regionValue;
    await updateRegionRouteQuery();
  };

  // Watch for route query changes (e.g., browser back/forward) and sync region state
  watch(regionRouteQuery, async (newRegionQuery) => {
    const newRegionValue = newRegionQuery as
      | UiSelectOption["value"]
      | undefined;
    // Only update if the value actually changed to avoid unnecessary updates
    if (region.value !== newRegionValue) {
      isSyncingFromRoute.value = true;
      region.value = newRegionValue;
      // Reset flag after reactive update completes
      await nextTick();
      isSyncingFromRoute.value = false;
    }
  });

  const setupRegionFilter = () => {
    if (!hasRegionRouteQuery.value) return;
    region.value = regionRouteQuery.value as UiSelectOption["value"];
  };

  return {
    region,
    regionFilter,
    setRegion,
    setupRegionFilter,
  };
};
