<template>
  <span class="block aspect-video w-full">
    <img
      :src="flag.png"
      :alt="`Flag of ${name}`"
      :loading="loadingStrategy"
      :fetchpriority="fetchPriority"
      decoding="async"
      class="block w-full h-auto aspect-video"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Flag } from "../../types";

const props = defineProps<{
  flag: Flag;
  name: string;
  preload?: boolean;
}>();

const loadingStrategy = computed<"eager" | "lazy">(() =>
  props.preload ? "eager" : "lazy"
);

const fetchPriority = computed<"high" | "auto">(() =>
  props.preload ? "high" : "auto"
);
</script>