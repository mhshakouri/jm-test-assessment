<template>
  <PageHeader type="detail" class="mb-12"/>
  <CountryDetail
    v-if="country"
    :country="country"
    :borderCountries="borderCountries"
  />
</template>
<script setup lang="ts">
import type { Country } from "../types";
import { useRoute } from "vue-router";
import { useCountries } from "../composables/useCountries";
import { useFetchCountries } from "../composables/useFetchCountries";
import { computed, ref, watch } from "vue";
import CountryDetail from "../components/country/CountryDetail.vue";
import PageHeader from "../components/PageHeader.vue";

const route = useRoute();
const { getCountryByCode } = useCountries();
const { fetchCountryByCode, borderCountriesData } = useFetchCountries();

const code = computed(() => {
  const routeCode = route.params.code as string;
  return routeCode?.toLowerCase()?.trim();
});

// Store fetched country in a ref for SSR reactivity
const countryRef = ref<Country | undefined>();
const borderCountriesRef = ref<Country[]>([]);

const syncBorderCountries = (countries?: Country[]) => {
  borderCountriesRef.value = (countries ?? []).filter(
    (borderCountry): borderCountry is Country =>
      Boolean(borderCountry?.alpha3Code)
  );
};

// Fetch country on initial load (for SSR - this ensures renderToString waits)
if (code.value) {
  const fetched = await fetchCountryByCode(code.value);
  if (fetched) {
    countryRef.value = fetched;
    syncBorderCountries(borderCountriesData.value);
  }
}

const country = computed<Country | undefined>(() => {
  // Use ref first (for SSR), then fallback to repository (for reactivity)
  if (countryRef.value) {
    return countryRef.value;
  }
  const currentCode = code.value;
  if (!currentCode) return undefined;
  return getCountryByCode(currentCode);
});

// Fetch country when code changes (for client-side navigation)
watch(code, async (newCode) => {
  if (newCode) {
    const fetched = await fetchCountryByCode(newCode);
    if (fetched) {
      countryRef.value = fetched;
      syncBorderCountries(borderCountriesData.value);
    }
  } else {
    countryRef.value = undefined;
    borderCountriesRef.value = [];
  }
});

watch(
  borderCountriesData,
  (newBorderCountries) => {
    syncBorderCountries(newBorderCountries);
  },
  { immediate: true, deep: true }
);

const borderCountries = computed<Country[]>(() => borderCountriesRef.value);
</script>
