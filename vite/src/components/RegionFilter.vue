<template>
    <UiSelect :optionList="regions" :modelValue="selectedRegion" @update:model-value="setSelectedRegion" class="w-48" />
</template>
<script setup lang="ts">
import UiSelect from './ui/UiSelect.vue';
import type { UiSelectOption } from '../types/ui/select';
import { computed } from 'vue';
import { useRegionFilter } from '../composables/useRegionFilter';

const { region, setRegion, setupRegionFilter } = useRegionFilter()

const regions: UiSelectOption[] = [
    { label: 'Africa', value: 'africa' },
    { label: 'America', value: 'america' },
    { label: 'Asia', value: 'asia' },
    { label: 'Europe', value: 'europe' },
    { label: 'Oceania', value: 'oceania' },
]

const selectedRegion = computed<UiSelectOption>(() => {
    return regions.find(item => item.value === region.value) ?? { label: 'Filter by Region', value: undefined }
})

const setSelectedRegion = (region?: UiSelectOption) => {
    setRegion(region?.value)
}

setupRegionFilter()
</script>