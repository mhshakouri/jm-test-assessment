<template>
    <header class="flex items-center justify-between p-4 bg-jm-white dark:bg-jm-blue-lighter">
        <h1 class="text-normal font-semibold">{{ slogan }}</h1>
        <ColorSchemeToggler />
    </header>
</template>
<script lang="ts" setup>
import ColorSchemeToggler from './ColorSchemeToggler.vue'
withDefaults(defineProps<{slogan?: string}>(), {
    slogan: 'Where in the world?'
})
</script>