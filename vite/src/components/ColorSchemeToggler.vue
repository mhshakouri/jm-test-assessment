<template>
    <button @click.capture="toggleColorScheme">
        <Icon :icon="themeIcon" />
    </button>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useColorSchemeToggler } from '../composables/useColorSchemeToggler';

const { toggleColorScheme, themeIcon } = useColorSchemeToggler();
</script>