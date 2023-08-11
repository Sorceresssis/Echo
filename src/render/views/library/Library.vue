<template>
    <router-view></router-view>
</template>
  
<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(async () => {
    // console.log((await window.electronAPI.queryDirnames(26, { queryWork: '', sortField: 'date', asc: false, pn: 1, ps: 10 })))
})

</script>

<style></style>