<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import { useColorSchemeToggler } from "./composables/useColorSchemeToggler";

const { setupColorScheme } = useColorSchemeToggler();
setupColorScheme();
</script>
<template>
  <main
    class="min-h-screen flex flex-col bg-jm-gray-lighter text-jm-blue-darker dark:bg-jm-blue dark:text-jm-gray-lighter"
  >
    <AppHeader />
    <section class="container mx-auto py-4 px-4 flex-1">
      <Suspense>
        <router-view />
        <template #fallback>
          <div class="flex items-center justify-center min-h-[400px]">
            <p class="text-jm-blue-darker dark:text-jm-gray-lighter">
              Loading...
            </p>
          </div>
        </template>
      </Suspense>
    </section>
  </main>
</template>
