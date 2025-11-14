<template>
  <div class="flex items-center desktop:flex-row flex-col gap-12">
    <UiSearch class="w-full desktop:w-auto" />
    <RegionFilter class="w-48 desktop:w-auto self-start relative z-10" />
  </div>
</template>
<script setup lang="ts">
import UiSearch from "./ui/UiSearch.vue";
import RegionFilter from "./RegionFilter.vue";
</script>
