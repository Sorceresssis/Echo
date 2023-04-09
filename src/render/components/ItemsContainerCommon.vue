<template>
    <div>
        <Items :items="items"
               v-loading="isVisibleLoading"></Items>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, watch, inject, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'
import Items from './Items.vue'
import { debounce } from '../util/debounce';


const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>
const items = ref<item[]>([])

let itemsSrollPosition = 0
// onMounted(() => {
//     console.log("组件加载");
// })
// // 获取onDeactivea获取items的滚动位置， onActiveat在赋值给item。
// onActivated(() => {
//     console.log("keep加载");
// })
// onDeactivated(() => {
//     console.log("keep卸载");
// })
// onUnmounted(() => {
//     console.log("组件卸载");
// })

const isVisibleLoading = ref<boolean>(false)
items.value = await window.electronAPI.getItems(activeLibrary.value.id)
watch([activeLibrary], debounce(async (newValue) => {
    isVisibleLoading.value = true
    items.value = await window.electronAPI.getItems(newValue[0].id);
    isVisibleLoading.value = false
}, 200), {
    deep: true
})


</script>

<style scoped></style>