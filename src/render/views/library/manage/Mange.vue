<template>
    <div>
        <div class="module-header module_title">
            {{ $t('layout.manageData') }}
        </div>
        <tabs v-model="activeLabelIdx"
              :key="tabsKey"
              :tabs="tabs">
        </tabs>
        <keep-alive>
            <component class="flex-1 overflow-hidden"
                       :is="components[activeLabelIdx]">
            </component>
        </keep-alive>
    </div>
</template>

<script lang="ts" setup>
import { ref, shallowReactive, onMounted, watch, provide } from 'vue'
import { useRoute, } from 'vue-router'
import { $t } from '@/locale'
import Tabs from '@/components/Tabs.vue'
import EditRecord from './EditRecord.vue'
import AddRecordFromMetadata from './AddRecordFromMetadata.vue'
import RecycleRecordByAttribute from './RecycleRecordByAttribute.vue'
import EditAuthor from './EditAuthor.vue'
import EditRoles from './EditRoles.vue'
import EditDirname from './EditDirname.vue'

const props = defineProps({
    pathPattern: {
        type: RegExp,
        default: /^\/library\/(\d+)\/manage(.*)$/,
    },
})

provide('managePathPattern', props.pathPattern)

const route = useRoute()

const tabsKey = ref<number>(0)
const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: $t('layout.addRecord'), disabled: false },
    { id: 2, label: $t('layout.addRecordFromMetadata'), disabled: false },
    { id: 3, label: $t('layout.batchRecycleRecord'), disabled: false },
    { id: 4, label: $t('layout.addAuthor'), disabled: false },
    { id: 5, label: $t('layout.authorRoles'), disabled: false },
    { id: 5, label: $t('layout.editDir'), disabled: false },
])
const components = [
    EditRecord,
    AddRecordFromMetadata,
    RecycleRecordByAttribute,
    EditAuthor,
    EditRoles,
    EditDirname,
]

const init = () => {
    if (!props.pathPattern.test(route.fullPath)) return

    if (route.query.author_id) {
        // 编辑作者操作: 把activeLabelIdx设置为编辑作者页; 禁用管理记录, 批量删除, 编辑目录; 并且
        activeLabelIdx.value = 3

        tabs[0].disabled = tabs[1].disabled = true
        tabs[3].label = $t('layout.editAuthor')
    } else {
        activeLabelIdx.value = 0
        tabs[0].disabled = tabs[1].disabled = false

        tabs[0].label = route.query.record_id ? $t('layout.editRecord') : $t('layout.addRecord')
        tabs[3].label = $t('layout.addAuthor')
    }

    tabsKey.value = new Date().getTime()
}

watch(route, init)
onMounted(init) 
</script>