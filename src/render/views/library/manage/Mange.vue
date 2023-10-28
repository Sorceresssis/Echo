<template>
    <div>
        <div class="module-header module_title">
            {{ $t('layout.manageData') }}
        </div>
        <tabs v-model="activeLabelIdx"
              :tabs="tabs">
        </tabs>
        <keep-alive>
            <component class="flex-1 overflow-hidden"
                       :is="components[activeLabelIdx] ">
            </component>
        </keep-alive>
    </div>
</template>
 
<script lang="ts" setup>
import { ref, shallowReactive, onMounted, watch, provide } from 'vue'
import { useRoute, } from 'vue-router'
import Tabs from '@/components/Tabs.vue'
import EditRecord from './EditRecord.vue'
import RecycleRecordByAttribute from './RecycleRecordByAttribute.vue'
import EditAuthor from './EditAuthor.vue'
import EditDirname from './EditDirname.vue'
import { $t } from '@/locale'

const props = defineProps({
    pathPattern: {
        type: RegExp,
        default: /^\/library\/(\d+)\/manage(.*)$/,
    },
})

provide('managePathPattern', props.pathPattern)

const route = useRoute()


const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: $t('layout.addRecord'), disabled: false },
    { id: 2, label: $t('layout.batchRecycleRecord'), disabled: false },
    { id: 3, label: $t('layout.addAuthor'), disabled: false },
    { id: 4, label: $t('layout.editDir'), disabled: false },
])
const components = [
    EditRecord,
    RecycleRecordByAttribute,
    EditAuthor,
    EditDirname,
]

const init = () => {
    if (!props.pathPattern.test(route.fullPath)) return

    // 如果是编辑作者，禁用管理记录, 批量删除, 编辑目录; 并且把activeLabelIdx设置为编辑作者 
    if (route.query.author_id) {
        tabs[0].disabled = true
        tabs[2].label = $t('layout.editAuthor')
        activeLabelIdx.value = 2
    } else {
        tabs[0].disabled = false
        tabs[2].label = $t('layout.addAuthor')
        activeLabelIdx.value = 0
    }

    if (route.query.record_id) {
        tabs[0].label = $t('layout.editRecord')
    } else {
        tabs[0].label = $t('layout.addRecord')
    }

}

watch(route, init)
onMounted(init) 
</script>