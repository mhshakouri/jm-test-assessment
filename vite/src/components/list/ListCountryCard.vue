<template>
  <button
    :class="buttonClasses"
    @click="goToCountry"
  >
    <Flag
      v-if="country.flags?.png"
      :flag="country.flags"
      :name="country.name"
      :preload="preload"
    />
    <span class="font-extrabold text-normal self-start">{{ country.name }}</span>
    <span>
      <UiKeyValue
        v-if="country.population !== undefined"
        title="Population"
        :description="formattedPopulation"
      />
      <UiKeyValue v-if="country.region" title="Region" :description="country.region" />
      <UiKeyValue v-if="country.capital" title="Capital" :description="country.capital" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Country } from "../../types";
import UiKeyValue from "../ui/UiKeyValue.vue";
import Flag from "../country/CountryFlag.vue";
import { formatPopulation } from "../../utils/formatPopulation";
import { useSearch } from "../../composables/useSearch";
import { useRegion } from "../../composables/useRegion";

const props = defineProps<{
  country: Country;
  preload?: boolean;
}>();

const { push } = useRouter();
const { searchText } = useSearch();
const { region } = useRegion();

const buttonClasses = computed(() =>
  "flex flex-col gap-2 cursor-pointer bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter py-3 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200 w-full md:hover:shadow-md"
);

const formattedPopulation = computed(() => formatPopulation(props.country.population));

const goToCountry = () => {
  const code = props.country.alpha3Code?.toLowerCase()?.trim();
  if (!code) return;
  
  // Clear search and region filters when navigating to country detail
  // This ensures a clean state when viewing country details
  searchText.value = undefined;
  region.value = undefined;
  
  push({
    name: "country",
    params: { code },
  });
};
</script>