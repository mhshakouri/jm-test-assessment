<template>
  <PageHeader />
  <pre v-if="!isLoading && !hasError">
        {{ countriesList }}
    </pre
  >
  <pre v-if="isLoading">
        Loading...
    </pre
  >
  <pre v-if="hasError">
        Error: {{ hasError }}
    </pre
  >
</template>
<script setup lang="ts">
import PageHeader from "../components/PageHeader.vue";
import { useCountries } from "../composables/useCountries";
import { useRegionFilter } from "../composables/useRegionFilter";
const { fetchCountries, hasError, isLoading, countriesList } = useCountries();
const { setupRegionFilter } = useRegionFilter();

// Fetch data on SSR and client
setupRegionFilter();
await fetchCountries();

// onMounted(async() => {
//     if ((!countries.value?.length || hasError.value !== undefined) && !isLoading.value) {
//         await fetchCountries();
//     }
// });
</script>
