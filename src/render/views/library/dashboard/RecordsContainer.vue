<template>
    <div v-if="records.length == 0"
         class="flex-1">
        该库还没有任何东西哦~
    </div>
    <ul v-else
        class="scrollbar-y flex-1">
        <li v-for="record in records"
            :key="record.id">
            {{ record.title }}
        </li>
        <div style="width: 300px; height: 300px;">
            <img class="img--contain"
                 src="file://F:\Desktop\images\2.jpg"
                 alt="">
        </div>
        <el-card style="background-color: #fff; margin: 20px;">fd
        </el-card>
    </ul>
    <div class="pagination">
        <el-select v-model="value"
                   width="150px"
                   style="width: 130px;"
                   class="m-2"
                   placeholder="Select"
                   size="small">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
        </el-select>
        <el-pagination v-model:current-page="currentPage1"
                       background
                       :page-sizes="[10, 20, 30, 40]"
                       small
                       :page-size="10"
                       :pager-count="5"
                       layout="prev, pager, next, jumper"
                       :total="100"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" />
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref, } from 'vue'

const props = withDefaults(defineProps<{
    records: RecordProfile[]
    view: string
}>(), {
    records: () => [],
    view: 'thumbnail'
})

onMounted(() => {
    props.records = [

    ]
})

const handleSelect = (item: Record<string, any>) => {
    console.log(item)
}



const value = ref('')

const options = [
    {
        value: 'Option1',
        label: 'Option1',
    },
    {
        value: 'Option2',
        label: 'Option2',
    },
    {
        value: 'Option3',
        label: 'Option3',
    },
    {
        value: 'Option4',
        label: 'Option4',
    },
    {
        value: 'Option5',
        label: 'Option5',
    },
]
const s = ref('')

const currentPage1 = ref(5)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
}
const handleCurrentChange = (val: number) => {
}
</script>

<style scoped>
.pagination {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
}
</style>