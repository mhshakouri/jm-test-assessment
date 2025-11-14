<template>
    <div>Index Page</div>

    <PageHeader />
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import PageHeader from '../components/PageHeader.vue';

onMounted(() => {
    console.log('Index Page mounted')
})
</script>