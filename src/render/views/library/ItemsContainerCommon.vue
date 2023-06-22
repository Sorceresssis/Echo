<template>
    <div>
        <Items :items="items"
               v-loading="isVisibleLoading"></Items>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, watch, inject, onMounted } from 'vue'
import Items from './Items.vue'
import { debounce } from '../../util/debounce';


const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>
const items = ref<itemProfile[]>([])


// 第一次启动，更新activeLibrary
onMounted(async () => {
    isVisibleLoading.value = true
    items.value = await window.electronAPI.getItems(activeLibrary.value.id);
    isVisibleLoading.value = false
})

let itemsSrollPosition = 0

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