<template>
    <div></div>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
watch(() => route.query.authorID, (newValue) => {
    console.log(newValue);
})


</script>

<style scoped></style>