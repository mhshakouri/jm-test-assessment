<template>
  <div>
    <PageHeader />
    <ListCountry v-if="!pending && !error && countriesList?.length" :countries="countriesList" class="py-6"/>
  </div>
</template>
<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import { useFetchCountries } from "../composables/useFetchCountries";
import { useRegionFilter } from "../composables/useRegionFilter";
import ListCountry from "../components/list/ListCountry.vue";

const { setupRegionFilter } = useRegionFilter();
const { fetchCountries, pending, error, countriesList } = useFetchCountries();

// Fetch data on SSR and client
setupRegionFilter();
await fetchCountries()
</script>
