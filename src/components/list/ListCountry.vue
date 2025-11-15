<template>
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    <ListCountryCard
      v-for="(country, index) in countries"
      :key="country.alpha3Code"
      :country="country"
      :preload="index <= 3"
    />
    <div v-if="!countries.length" class="col-span-full text-center py-8">
      <p class="text-jm-blue-darker dark:text-jm-gray-lighter">No countries found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ListCountryCard from "./ListCountryCard.vue";
import type { Country } from "../../types";

defineProps<{
  countries: Country[];
}>();
</script>