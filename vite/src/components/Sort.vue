<template>
  <div class="flex items-center gap-2">
    <UiSortButton
      :key="sortIcon"
      :currentSortIcon="sortIcon"
      :toBeSortIcon="sortIconToBe"
      :ariaLabel="sortIconAriaLabel"
      name="Sort by"
      @click="toggleSort"
    />
    <UiSortButton
      :key="sortOrderIcon"
      :currentSortIcon="sortOrderIcon"
      :toBeSortIcon="sortOrderIconToBe"
      :ariaLabel="sortOrderIconAriaLabel"
      name="Sort order"
      @click="toggleSortOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { useSort } from '../composables/useSort';
import UiSortButton from './ui/UiSortButton.vue';

const {
  toggleSort,
  toggleSortOrder,
  sortIcon,
  sortOrderIcon,
  sortIconAriaLabel,
  sortOrderIconAriaLabel,
  sortIconToBe,
  sortOrderIconToBe,
} = useSort();
</script>