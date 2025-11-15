<template>
  <div class="flex flex-col items-center gap-12 lg:flex-row lg:justify-between w-full">
    <UiSearch class="w-full lg:w-96" />
    <div class="flex-auto flex items-center gap-2 self-start justify-between lg:self-end lg:flex-row-reverse w-full lg:w-auto lg:flex-none content-center">
      <RegionFilter class="relative z-10 w-48 lg:w-48 " />
      <Sort class="self-end lg:self-start" />
    </div>
  </div>
</template>
<script setup lang="ts">
import UiSearch from "./ui/UiSearch.vue";
import RegionFilter from "./RegionFilter.vue";
import Sort from "./Sort.vue";
</script>
