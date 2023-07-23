<template>
    <div v-if="records.length == 0">
        该库还没有任何东西哦~
    </div>
    <ul v-else
        class="scrollbar-y">
        <li v-for="record in records"
            :key="record.id">
            {{ record.title }}
        </li>
        <echo-autocomplete v-model="s"
                           @select="handleSelect" />
        <el-card v-for="record in records"
                 style="background-color: #fff; margin: 20px;">
        </el-card>
    </ul>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue'
import EchoAutocomplete from '../../../components/EchoAutocomplete.vue'

const props = withDefaults(defineProps<{
    records: RecordProfile[]
    view: string
}>(), {
    records: () => [],
    view: 'thumbnail'
})

const handleSelect = (item: Record<string, any>) => {
    console.log(item)
}

const s = ref('') 
</script>

<style scoped></style>