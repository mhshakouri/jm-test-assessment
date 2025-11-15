<template>
  <RouterLink
    :class="buttonClasses"
    :to="`/country/${country.alpha3Code.toLowerCase()}`"
  >
    <Flag
      v-if="country.flags?.png"
      :flag="country.flags"
      :name="country.name"
      :preload="preload"
    />
    <span class="self-start"
      ><UiKeyValue v-if="country.name" :title="country.name"
    /></span>
    <span>
      <UiKeyValue
        v-if="country.population !== undefined"
        title="Population:"
        :description="formattedPopulation"
      />
      <UiKeyValue
        v-if="country.region"
        title="Region:"
        :description="country.region"
      />
      <UiKeyValue
        v-if="country.capital"
        title="Capital:"
        :description="country.capital"
      />
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Country } from "../../types";
import UiKeyValue from "../ui/UiKeyValue.vue";
import Flag from "../country/CountryFlag.vue";
import { formatPopulation } from "../../utils/formatPopulation";

const props = defineProps<{
  country: Country;
  preload?: boolean;
}>();
const buttonClasses = computed(
  () =>
    "flex flex-col gap-2 cursor-pointer bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter py-3 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200 w-full md:hover:shadow-md"
);

const formattedPopulation = computed(() =>
  formatPopulation(props.country.population)
);
</script>
