<template>
    <CountryDetail v-if="country" :country="country" :borderCountries="borderCountries" />
</template>
<script setup lang="ts">
import type { Country } from '../types';
import { useRouter } from 'vue-router';
import { useCountries } from '../composables/useCountries';
import { useFetchCountries } from '../composables/useFetchCountries';
import { computed, watch } from 'vue';
import CountryDetail from '../components/country/CountryDetail.vue';

const { currentRoute } = useRouter();
const { getCountryByCode } = useCountries();
const { fetchCountryByCode } = useFetchCountries();

const code = computed(() => {
  const routeCode = currentRoute.value.params.code as string;
  return routeCode?.toLowerCase()?.trim();
});

const country = computed<Country | undefined>(() => {
  const currentCode = code.value;
  if (!currentCode) return undefined;
  return getCountryByCode(currentCode);
});

// Fetch country when code changes
watch(code, async (newCode) => {
  if (newCode) {
    await fetchCountryByCode(newCode);
  }
}, { immediate: true });

const borderCountries = computed<Country[]>(() => {
  const currentCountry = country.value;
  if (!currentCountry?.borders?.length) {
    return [];
  }
  
  return currentCountry.borders
    .map(borderCode => getCountryByCode(borderCode))
    .filter((borderCountry): borderCountry is Country => borderCountry !== undefined);
});
</script>