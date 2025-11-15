<template>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <template v-if="countries.length">
            <ListCountryCard v-for="(country, index) in countries" :key="`${country.name}-${country.alpha3Code}`" :country="country" :preload="index <= 3" />
        </template>
        <template v-else>
            <div>
                <p>No countries </p>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import ListCountryCard from './ListCountryCard.vue';
import { Country } from '../../types';
defineProps<{
    countries: Country[];
}>();
</script>