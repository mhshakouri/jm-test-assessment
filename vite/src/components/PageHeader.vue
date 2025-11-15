<template>
  <div class="flex flex-col items-center gap-12 w-full lg:flex-row lg:justify-between">
    <UiSearch class="w-full lg:w-96" />
    <div class="flex items-center gap-2 w-full content-center self-start justify-between lg:w-auto lg:self-end lg:flex-row-reverse lg:flex-none">
      <RegionFilter class="relative z-10 w-48" />
      <Sort class="self-end lg:self-start" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UiSearch from "./ui/UiSearch.vue";
import RegionFilter from "./RegionFilter.vue";
import Sort from "./Sort.vue";
</script>
