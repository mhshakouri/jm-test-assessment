<template>
  <div class="flex flex-col items-center gap-12 w-full lg:flex-row lg:justify-between">
    <template v-if="!isDetail">
      <UiSearch class="w-full lg:w-96" />
      <div class="flex items-center gap-2 w-full content-center self-start justify-between lg:w-auto lg:self-end lg:flex-row-reverse lg:flex-none">
        <RegionFilter class="relative z-10 w-48" />
        <Sort class="self-end lg:self-start" />
      </div>
    </template>
    <button v-else @click="goBack" class="self-start flex items-center gap-2 text-small font-light bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200 whitespace-nowrap shrink-0 hover:shadow-md cursor-pointer">
      <Icon icon="mdi:arrow-back" :ssr="true" data-allow-mismatch />
      <span>Back</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import UiSearch from "./ui/UiSearch.vue";
import RegionFilter from "./RegionFilter.vue";
import Sort from "./Sort.vue";
import { computed, inject } from "vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";

const props = withDefaults(defineProps<{
  type?: "detail" | "list";
}>(), {
  type: "list",
});

const router = useRouter();
const navigationStack = inject('navigationStack', [] as string[]);
const isDetail = computed(() => props.type === "detail");

const goBackOrPushFallback = (fallbackPath: string) => {
  if (navigationStack.length > 0) {
    router.back();
  } else {
    router.push(fallbackPath as string);
  }
};
const goBack = () => {
  goBackOrPushFallback("/");
};
</script>
