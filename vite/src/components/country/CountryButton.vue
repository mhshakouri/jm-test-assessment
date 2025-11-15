<template>
    <button @click="goToCountry">
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
  console.log('goToCountry', code);
  if (!code) return;
  
  push({
    name: "country",
    params: { code },
  });
};
</script>