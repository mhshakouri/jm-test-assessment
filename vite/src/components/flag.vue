<template>
    <span>
        <span class="block aspect-video w-full">
            <img :src="flag.png" :alt="name" class="block w-full h-auto aspect-video" :loading="preload ? 'eager' : 'lazy'" :fetchpriority="preload ? 'high' : 'auto'" decoding="async" type="image/png"/>
        </span>
    </span>
</template>
<script setup lang="ts">
import { Flag } from '../types';

defineProps<{
    flag: Flag;
    name: string;
    preload?: boolean;
}>();

</script>