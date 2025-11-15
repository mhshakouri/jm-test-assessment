<template>
  <UiSelect
    :optionList="regions"
    :modelValue="selectedRegion"
    @update:model-value="setSelectedRegion"
    class="w-48"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import UiSelect from "./ui/UiSelect.vue";
import type { UiSelectOption } from "../types/ui/select";
import { useRegionFilter } from "../composables/useRegionFilter";
import { regionsData } from "../constants/regions";
import { useFetchCountries } from "../composables/useFetchCountries";

const { regionFilter, setRegion } = useRegionFilter();
const { fetchCountries } = useFetchCountries();

const regions: UiSelectOption[] = regionsData.map((region) => ({
  label: region,
  value: region,
}));

const DEFAULT_REGION_OPTION: UiSelectOption = {
  label: "Filter by Region",
  value: undefined,
};

const selectedRegion = computed<UiSelectOption>(() =>
  regions.find((item) => item.value === regionFilter.value) ?? DEFAULT_REGION_OPTION
);

const setSelectedRegion = async (region?: UiSelectOption) => {
  await setRegion(region?.value);
  await fetchCountries();
};
</script>
