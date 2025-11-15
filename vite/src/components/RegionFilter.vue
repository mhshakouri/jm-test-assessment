<template>
  <UiSelect
    :optionList="regions"
    :modelValue="selectedRegion"
    @update:model-value="setSelectedRegion"
    class="w-48"
  />
</template>
<script setup lang="ts">
import UiSelect from "./ui/UiSelect.vue";
import type { UiSelectOption } from "../types/ui/select";
import { computed, ref } from "vue";
import { useRegionFilter } from "../composables/useRegionFilter";
import { regionsData } from "../constants/regions";
import { useFetchCountries } from "../composables/useFetchCountries";

const { regionFilter, setRegion } = useRegionFilter();
const { fetchCountries } = useFetchCountries();

const regions = ref(
  regionsData.map((region) => ({ label: region, value: region }))
);
const selectedRegion = computed<UiSelectOption>(() => {
  return (
    regions.value.find((item) => item.value === regionFilter.value) ?? {
      label: "Filter by Region",
      value: undefined,
    }
  );
});

const setSelectedRegion = async (region?: UiSelectOption) => {
  await setRegion(region?.value);
  await fetchCountries();
};
</script>
