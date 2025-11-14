<template>
  <div>
    <label for="search" :class="labelClasses">
      <Icon icon="mdi:search" />
      <input
        type="text"
        id="search"
        v-model.trim="searchText"
        placeholder="Search for a country..."
        :class="inputClasses"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useSearch } from "../../composables/useSearch";
import { computed } from "vue";
import { tv } from "tailwind-variants";

const { searchText } = useSearch();

// Theme
const uiSearchTheme = tv(
  {
    base: "flex items-center gap-2 bg-jm-white text-jm-gray dark:text-jm-gray-lighter dark:bg-jm-blue-lighter rounded-md px-4 py-2 w-full",
    slots: {
      input:
        "w-full bg-transparent outline-none focus:ring-0 focus:border-none focus:outline-none",
    },
  },
  { twMerge: true }
);
const theme = computed(() => uiSearchTheme());
const labelClasses = computed(() => theme.value.base());
const inputClasses = computed(() => theme.value.input());
</script>
