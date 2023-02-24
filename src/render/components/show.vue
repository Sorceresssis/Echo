<template></template>
<script setup lang="ts">
// defineProps<{ msg: string }>()

import { onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUpdated, onUnmounted, ref, } from 'vue'

// 创建前
onBeforeMount(() => {

})
// 创建后
onMounted(() => {
    // 创建后才能获取到dom
})
// 更新前
onBeforeUpdate(() => {
    // 获取到更新前的dom
})
// 更新后
onUpdated(() => {
    // 获取到更新后的dom
})
// 卸载前
onBeforeUnmount(() => {
})
// 卸载后
onUnmounted(() => {

})


</script>


<style scoped>
.read-the-docs {
    color: #888;
}
</style> 
