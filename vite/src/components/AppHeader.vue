<template>
  <header class="bg-jm-white dark:bg-jm-blue-lighter sticky top-0 z-10">
    <div class="container mx-auto py-4 px-4 flex items-center justify-between">
      <h1 class="text-normal font-semibold">{{ slogan }}</h1>
      <ColorSchemeToggler />
    </div>
  </header>
</template>

<script lang="ts" setup>
import ColorSchemeToggler from "./ColorSchemeToggler.vue";

withDefaults(defineProps<{ slogan?: string }>(), {
  slogan: "Where in the world?",
});
</script>
