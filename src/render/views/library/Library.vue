<template>
    <router-view></router-view>
</template>
  
<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(async () => {
    // console.log((await window.electronAPI.queryRecordDetail(1, 1)))
})
</script>

<style></style>