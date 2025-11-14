<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import { useColorSchemeToggler } from './composables/useColorSchemeToggler';

const { setupColorScheme } = useColorSchemeToggler();
setupColorScheme();

</script>
<template>
  <main class="min-h-screen bg-jm-gray-lighter text-jm-blue-darker dark:bg-jm-blue dark:text-jm-gray-lighter">
    <AppHeader />
    <router-view />
  </main>
</template>