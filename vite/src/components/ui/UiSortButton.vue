<template>
    <button class="bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter py-3 px-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200" @click="onClick" type="button" :aria-label="ariaLabel" :title="ariaLabel">
        <span class="flex items-center gap-2">
            <Icon :icon="currentSortIcon" :ssr="true" data-allow-mismatch/>
            <Icon icon="mdi:chevron-double-right" :ssr="true" data-allow-mismatch/>
            <Icon :icon="toBeSortIcon" :ssr="true" data-allow-mismatch/>
        </span>
    </button>
</template>
<script setup lang="ts">    
import { Icon } from '@iconify/vue';

const props = defineProps<{
    currentSortIcon: string;
    toBeSortIcon: string;
    name: string
    ariaLabel: string;
}>();

const emit = defineEmits<{
    (e: 'click', name: string): void
}>();
const onClick = () => {
    emit('click', props.name);
};
</script>