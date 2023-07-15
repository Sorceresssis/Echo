<template>
    <div v-if="records.length == 0">
        该库还没有任何东西哦~
    </div>
    <ul v-else>
        <li v-for="record in records"
            :key="record.id">
            {{ record.title }}
        </li>
        <el-card v-for="record in records"
                 style="background-color: #fff; margin: 20px;">
        </el-card>
    </ul>
</template>

<script setup lang='ts'>
import { ref } from 'vue'


const props = withDefaults(defineProps<{
    records: RecordProfile[]
    view: string
}>(), {
    records: () => [],
    view: 'thumbnail'
})

</script>

<style scoped></style>