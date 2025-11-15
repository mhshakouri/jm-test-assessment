<template>
  <header class="bg-jm-white dark:bg-jm-blue-lighter sticky top-0 z-10">
    <div class="container mx-auto py-4 px-4 flex items-center justify-between">
      <RouterLink to="/" class="text-normal font-semibold hover:underline">{{ slogan }}</RouterLink>
      <ColorSchemeToggler />
    </div>
  </header>
</template>

<script lang="ts" setup>
import ColorSchemeToggler from "./ColorSchemeToggler.vue";
import { RouterLink } from 'vue-router';

withDefaults(defineProps<{ slogan?: string }>(), {
  slogan: "Where in the world?",
});
</script>
