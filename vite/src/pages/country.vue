<template>
    <CountryDetail v-if="country" :country="country" :borderCountries="borderCountries" />
</template>
<script setup lang="ts">
import type { Country } from '../types';
import { useRouter } from 'vue-router';
import { useCountries } from '../composables/useCountries';
import { useFetchCountries } from '../composables/useFetchCountries';
import { computed, ref, watch } from 'vue';
import CountryDetail from '../components/country/CountryDetail.vue';

const { currentRoute } = useRouter();
const { getCountryByCode } = useCountries();
const { fetchCountryByCode } = useFetchCountries();

const code = computed(() => {
  const routeCode = currentRoute.value.params.code as string;
  return routeCode?.toLowerCase()?.trim();
});

const country = ref<Country | undefined>(undefined);

// Fetch country when code changes
watch(code, async (newCode) => {
  if (newCode) {
    country.value = await fetchCountryByCode(newCode);
  } else {
    country.value = undefined;
  }
}, { immediate: true });

const borderCountries = computed<Country[]>(() => {
  if (!country.value?.borders?.length) {
    return [];
  }
  
  return country.value.borders
    .map(borderCode => getCountryByCode(borderCode))
    .filter((borderCountry): borderCountry is Country => borderCountry !== undefined);
});
</script>