import { computed, ref } from "vue";
import type { SortOptions, SortOrders } from "../types/composables/sort";
import { createSharedComposable } from "@vueuse/core";

const ICONS = {
    name: {
        variant: 'mdi:sort-alphabetical-variant',
        ascending: 'mdi:sort-alphabetical-ascending',
        descending: 'mdi:sort-alphabetical-descending',
    },
    population: {
        variant: 'mdi:sort-numeric-variant',
        ascending: 'mdi:sort-numeric-ascending',
        descending: 'mdi:sort-numeric-descending',
    },
} as const;

const useSortComposable = (sortBy: SortOptions = 'name', sortOrderBy: SortOrders = 'asc') => {
    const sort = ref<SortOptions>(sortBy);
    const sortOrder = ref<SortOrders>(sortOrderBy);

    const currentIcons = computed(() => ICONS[sort.value]);
    const nextSort = computed<SortOptions>(() => sort.value === 'name' ? 'population' : 'name');
    const nextIcons = computed(() => ICONS[nextSort.value]);
    const nextSortOrder = computed<SortOrders>(() => sortOrder.value === 'asc' ? 'desc' : 'asc');

    const sortIcon = computed(() => currentIcons.value.variant);
    const sortIconToBe = computed(() => nextIcons.value.variant);
    const sortIconAriaLabel = computed(() => `Sort by ${sort.value === 'name' ? 'name' : 'population'}`);

    const sortOrderIcon = computed(() => 
        currentIcons.value[sortOrder.value === 'asc' ? 'ascending' : 'descending']
    );
    const sortOrderIconToBe = computed(() => 
        currentIcons.value[nextSortOrder.value === 'asc' ? 'ascending' : 'descending']
    );
    const sortOrderIconAriaLabel = computed(() => 
        `Change sort order to ${nextSortOrder.value === 'asc' ? 'ascending' : 'descending'}`
    );

    const toggleSortOrder = () => {
        sortOrder.value = nextSortOrder.value;
    };

    const toggleSort = () => {
        sort.value = nextSort.value;
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