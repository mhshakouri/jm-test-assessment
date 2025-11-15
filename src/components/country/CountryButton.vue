<template>
  <RouterLink
    :to="`/country/${country.alpha3Code.toLowerCase()}`"
    class="bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200 whitespace-nowrap shrink-0 hover:shadow-md cursor-pointer"
  >
    {{ country.name }}
  </RouterLink>
</template>
<script setup lang="ts">
import type { Country } from "../../types";

defineProps<{
  country: Country;
}>();
</script>
