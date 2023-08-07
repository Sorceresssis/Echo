<template>
    <router-view></router-view>
</template>
  
<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(async () => {
    // console.log((await window.electronAPI.queryRecordProfiles(1, { type: 0, queryWord: 'fdf', ps: 2 })))
})

</script>

<style></style>