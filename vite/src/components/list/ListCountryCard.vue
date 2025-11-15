<template>
    <button>
        <Flag v-if="country.flags.png?.length" :flag="country.flags" :name="country.name" :preload="preload" />
        <span v-if="country.name?.length" class="font-extrabold text-normal">{{ country.name }}</span>
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