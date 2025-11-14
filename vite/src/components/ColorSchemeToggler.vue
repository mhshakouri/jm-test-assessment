<template>
    <button @click="toggleColorScheme">
        <span v-if="theme === 'light'">🌙</span>
        <span v-else>🌞</span>
    </button>
</template>
<script lang="ts" setup>
import { useColorSchemeToggler } from '../composables/useColorSchemeToggler';

const { toggleColorScheme, theme } = useColorSchemeToggler();
</script>