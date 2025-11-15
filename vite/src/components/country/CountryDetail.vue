<template>
    <div class="flex flex-col gap-2">
        <Flag v-if="country.flags?.png" :flag="country.flags" :name="country.name" :preload="true" />
        <div class="flex flex-col gap-2">
            <h1 class="font-extrabold text-normal self-start">{{ country.name }}</h1>
            <div class="flex flex-row gap-2">
                <div class="flex flex-col gap-2">
                    <UiKeyValue v-if="country.nativeName" title="Native Name" :description="country.nativeName" />
                    <UiKeyValue v-if="country.population !== undefined" title="Population" :description="formattedPopulation" />
                    <UiKeyValue v-if="country.region" title="Region" :description="country.region" />
                    <UiKeyValue v-if="country.subregion" title="Subregion" :description="country.subregion" />
                    <UiKeyValue v-if="country.capital && country.capital !== 'N/A'" title="Capital" :description="country.capital" />
                </div>
                <div class="flex flex-col gap-2">
                    <UiKeyValue v-if="country.topLevelDomain?.length" title="Top Level Domain" :description="country.topLevelDomain.join(', ')" />
                    <UiKeyValue v-if="country.currencies?.length" title="Currencies" >
                        <template #default>
                            <div class="flex flex-row gap-2">
                                <span v-for="currency in country.currencies" :key="currency.code">
                                    {{ currency.name }} ({{ currency.symbol }})
                                </span>
                            </div>
                        </template>
                    </UiKeyValue>
                    <UiKeyValue v-if="country.languages?.length" title="Languages" >
                        <template #default>
                            <div class="flex flex-row gap-2">
                                <span v-for="language in country.languages" :key="language.iso639_1">
                                    {{ language.name }} ({{ language.nativeName }})
                                </span>
                            </div>
                        </template>
                    </UiKeyValue>
                </div>
            </div>
            <div class="flex flex-row gap-2">
                <UiKeyValue v-if="borderCountries.length" title="Border Countries">
                    <template #default>
                        <div class="flex flex-row gap-2">
                            <CountryButton v-for="borderCountry in borderCountries" :key="borderCountry.alpha3Code" :country="borderCountry" />
                        </div>
                    </template>
                </UiKeyValue>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import CountryButton from './CountryButton.vue';
import Flag from './CountryFlag.vue';
import UiKeyValue from '../ui/UiKeyValue.vue';
import type { Country } from '../../types';
import { formatPopulation } from '../../utils/formatPopulation';

const props = defineProps<{
    country: Country;
    borderCountries: Country[];
}>();

const formattedPopulation = computed(() => formatPopulation(props.country.population));
</script>