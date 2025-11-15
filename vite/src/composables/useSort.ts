import { computed, ref } from "vue";
import type { SortOptions, SortOrders } from "../types/composables/sort";
import { createSharedComposable } from "@vueuse/core";

const useSortComposable = (sortBy: SortOptions = 'name', sortOrderBy: SortOrders = 'asc') => {
    const sort = ref<SortOptions>(sortBy);
    const sortOrder = ref<SortOrders>(sortOrderBy);

    const sortIcon = computed(() => sort.value === 'name' ? 'mdi:sort-alphabetical-variant' : 'mdi:sort-numeric-variant');
    const sortIconToBe = computed(() => sort.value === 'name' ? 'mdi:sort-numeric-variant' : 'mdi:sort-alphabetical-variant');
    const sortIconAriaLabel = computed(() => sort.value === 'name' ? 'Sort by name' : 'Sort by population');

    const sortOrderIcon = computed(() => sort.value === 'name' ? sortOrder.value === 'asc' ? 'mdi:sort-alphabetical-ascending' : 'mdi:sort-alphabetical-descending' : sortOrder.value === 'asc' ? 'mdi:sort-numeric-ascending' : 'mdi:sort-numeric-descending');

    const sortOrderIconToBe = computed(() => sort.value === 'name' ? sortOrder.value === 'asc' ? 'mdi:sort-alphabetical-descending' : 'mdi:sort-alphabetical-ascending' : sortOrder.value === 'asc' ? 'mdi:sort-numeric-descending' : 'mdi:sort-numeric-ascending');

    const sortOrderIconAriaLabel = computed(() => sort.value === 'name' ? 'Change sort order to ' + (sortOrder.value === 'asc' ? 'descending' : 'ascending') : 'Change sort order to ' + (sortOrder.value === 'asc' ? 'descending' : 'ascending'));
    const toggleSortOrder = () => {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    };

    const toggleSort = () => {
        sort.value = sort.value === 'name' ? 'population' : 'name';
    };

    return {
        sort,
        sortOrder,
        sortIcon,
        sortIconToBe,
        sortIconAriaLabel,
        sortOrderIcon,
        sortOrderIconToBe,
        sortOrderIconAriaLabel,
        toggleSort,
        toggleSortOrder,
    };
};

export const useSort = createSharedComposable(useSortComposable);