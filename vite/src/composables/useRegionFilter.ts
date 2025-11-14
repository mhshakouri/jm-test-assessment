import { useRouter, useRoute } from "vue-router";
import { UiSelectOption } from "../types/ui/select";
import { useRegion } from "./useRegion";
import { computed, watch, ref, nextTick } from "vue";

export const useRegionFilter = () => {
  const { region } = useRegion();
  const route = useRoute();
  const router = useRouter();

  const regionRouteQuery = computed(() => route.query.region)
  const hasRegionRouteQuery = computed(() => regionRouteQuery.value !== undefined)

  // Flag to prevent infinite loop when syncing from route
  const isSyncingFromRoute = ref(false);

  const updateRegionRouteQuery = async () => {
    // Don't update route if we're syncing from route changes
    if (isSyncingFromRoute.value) return;

    if (region.value) {
      const newQuery = { ...route.query, region: region.value }
      await router.push({ ...route, query: newQuery })
      return
    }
    if (hasRegionRouteQuery.value) {
      const newQuery = { ...route.query }
      delete newQuery.region
      await router.push({ ...route, query: newQuery })
    }
  }

  const setRegion = async (regionValue?: UiSelectOption["value"]) => {
    region.value = regionValue;
    await updateRegionRouteQuery()
  };

  // Watch for route query changes (e.g., browser back/forward) and sync region state
  watch(regionRouteQuery, async (newRegionQuery) => {
    const newRegionValue = newRegionQuery as UiSelectOption["value"] | undefined;
    // Only update if the value actually changed to avoid unnecessary updates
    if (region.value !== newRegionValue) {
      isSyncingFromRoute.value = true;
      region.value = newRegionValue;
      // Reset flag after reactive update completes
      await nextTick();
      isSyncingFromRoute.value = false;
    }
  });

  const setupRegionFilter = async () => {
    if (hasRegionRouteQuery.value) {
        region.value = regionRouteQuery.value as UiSelectOption["value"]
    }
  }

  return {
    region,
    setRegion,
    setupRegionFilter
  };
};
