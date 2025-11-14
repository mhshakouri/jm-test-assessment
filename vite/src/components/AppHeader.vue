<template>
    <header>
        <h1>{{ slogan }}</h1>
        <ColorSchemeToggler />
    </header>
</template>
<script lang="ts" setup>
import ColorSchemeToggler from './ColorSchemeToggler.vue'
withDefaults(defineProps<{slogan?: string}>(), {
    slogan: 'Where in the world?'
})
</script>