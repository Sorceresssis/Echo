<template>
    <router-view></router-view>
</template>
  
<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(async () => {
    setInterval(async () => {
        console.log(await window.electronAPI.queryRecordProfiles(1, 2))
    }, 1000)
})

</script>

<style scoped></style>