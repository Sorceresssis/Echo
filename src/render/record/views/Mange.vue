<template>
    <div class="edit-record">
        <Mange class="flex-1 flex-col overflow-hidden"
               :path-pattern="/^\/manage(.*)$/" />
    </div>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Mange from '@/views/library/manage/Mange.vue'

const route = useRoute()

onMounted(() => {
    // console.log(route.query.record_id)
})

</script> 

<style scoped>
.edit-record {
    padding: 0 20px;
}
</style>