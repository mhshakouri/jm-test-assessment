<template>
    <div v-if="country">
        Country page: {{ country.name }},
        <pre>
            data: {{ country }}
        </pre>
    </div>
    <div v-else-if="pending || countryPending">
        Loading...
    </div>
    <div v-else-if="error || countryError">
        Error: {{ error || countryError }}
    </div>
    <div v-else>
        Country not found
    </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useCountries } from '../composables/useCountries';
import { useFetchCountries } from '../composables/useFetchCountries';
import { computed } from 'vue';

const { params } = useRoute();
const { getCountryByName } = useCountries();
const { pending, error, fetchCountry, countryPending, countryError } = useFetchCountries();

const countryName = computed(() => {
    const name = params.name?.toString?.();
    return name?.trim()?.toLowerCase() || undefined;
});

const country = computed(() => countryName.value ? getCountryByName(countryName.value) : undefined);

// Check if country exists and has full details
// If not, fetch the full country details
const needsFullDetails = computed(() => {
    if (!country.value) return true;
    // Check if country has borders or currencies (indicates full details were fetched)
    // Some countries might not have borders, so check currencies as well
    return !country.value.borders && !country.value.currencies?.length;
});

// Fetch full country details if needed
if (needsFullDetails.value && countryName.value) {
    await fetchCountry(countryName.value);
}
</script>