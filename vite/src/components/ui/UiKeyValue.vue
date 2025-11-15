<template>
  <span class="flex gap-2">
    <span class="font-semibold text-normal">{{ title }}:</span>
    <slot>
      <span class="font-light text-normal">{{ description }}</span>
    </slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>