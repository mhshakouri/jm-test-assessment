<template>
    <button @click="goToCountry" class="bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200 whitespace-nowrap shrink-0 hover:shadow-md">
        {{ country.name }}
    </button>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Country } from '../../types';
import { useSearch } from '../../composables/useSearch';
import { useRegion } from '../../composables/useRegion';

const props = defineProps<{
    country: Country;
}>();

const { push } = useRouter();
const { searchText } = useSearch();
const { region } = useRegion();

const goToCountry = () => {
  searchText.value = undefined;
  region.value = undefined;

  const code = props.country.alpha3Code?.toLowerCase()?.trim();
  if (!code) return;
  
  push({
    name: "country",
    params: { code },
  });
};
</script>