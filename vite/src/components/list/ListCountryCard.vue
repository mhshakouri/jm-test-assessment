<template>
    <button class="flex flex-col gap-2 cursor-pointer bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter py-3 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200 w-full md:hover:shadow-md">
        <Flag v-if="country.flags.png?.length" :flag="country.flags" :name="country.name" :preload="preload" />
        <span v-if="country.name?.length" class="font-extrabold text-normal self-start">{{ country.name }}</span>
        <span>
            <UiKeyValue v-if="country.population !== undefined" title="Population" :description="(country.population === 'N/A' || country.population === undefined || country.population === 0) ? 'N/A' : country.population.toLocaleString('en-US')" />
            <UiKeyValue v-if="country.region" title="Region" :description="country.region" />
            <UiKeyValue v-if="country.capital" title="Capital" :description="country.capital" />
        </span>
    </button>
</template>
<script setup lang="ts">
import type { Country } from '../../types';
import UiKeyValue from '../ui/UiKeyValue.vue';
import Flag from '../flag.vue';
defineProps<{
    country: Country;
    preload?: boolean;
}>();

</script>