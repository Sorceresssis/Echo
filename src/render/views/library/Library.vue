<template>
    <router-view></router-view>
</template>
  
<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(async () => {
    // console.log((await window.electronAPI.queryRecordProfiles(1, 2)))
})

</script>

<style scoped></style>