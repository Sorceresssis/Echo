<template>
    <div>标签列表</div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const props = defineProps<{
    activeLibrary: library
}>()
</script>

<style scoped></style>