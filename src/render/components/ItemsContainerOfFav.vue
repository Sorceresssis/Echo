<template>
    <div>
        <Items :items="items"></Items>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, inject, watch, onMounted } from 'vue'
import Items from './Items.vue';
import { debounce } from '../util/debounce';

const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>
const items = ref<item[]>([])

onMounted(async () => {
    items.value = await window.electronAPI.getItems(activeLibrary.value.id)
})

const isVisibleLoading = ref<boolean>(false)
watch([activeLibrary], debounce(async (newValue) => {
    isVisibleLoading.value = true
    items.value = await window.electronAPI.getItems(newValue[0].id);
    isVisibleLoading.value = false
}, 200), {
    deep: true
})
</script>

<style scoped></style>