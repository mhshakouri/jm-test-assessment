<template>
    <button @click.capture="toggleColorScheme" class="cursor-pointer flex items-center gap-2 py-4">
        <Icon :icon="themeIcon" />
        <span aria-label="Toggle color scheme" class="text-small font-light">{{ theme === 'light' ? 'Dark' : 'Light' }} mode</span>
    </button>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useColorSchemeToggler } from '../composables/useColorSchemeToggler';

const { toggleColorScheme, themeIcon, theme } = useColorSchemeToggler();
</script>