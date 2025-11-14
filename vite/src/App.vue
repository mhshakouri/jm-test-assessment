<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import { useColorSchemeToggler } from './composables/useColorSchemeToggler';

const { setupColorScheme } = useColorSchemeToggler();
setupColorScheme();

</script>
<template>
  <main class="min-h-screen bg-brand-gray-lighter text-brand-blue-lighter dark:bg-brand-blue-darker dark:text-brand-white">
    <AppHeader />
  </main>
</template>