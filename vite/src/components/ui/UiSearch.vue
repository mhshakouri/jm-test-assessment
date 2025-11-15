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
    base: "flex items-center gap-2 bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter px-4 py-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200 w-full focus-within:ring-2 focus-within:ring-jm-blue-lighter dark:focus-within:ring-jm-gray-lighter",
    slots: {
      input:
        "w-full bg-transparent outline-none focus:ring-0 focus:border-none focus:outline-none text-jm-blue-darker dark:text-jm-gray-lighter placeholder:text-jm-blue-darker dark:placeholder:text-jm-gray-lighter",
    },
  },
  { twMerge: true }
);
const theme = computed(() => uiSearchTheme());
const labelClasses = computed(() => theme.value.base());
const inputClasses = computed(() => theme.value.input());
</script>
