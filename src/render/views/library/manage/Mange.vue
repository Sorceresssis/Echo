<template>
    <div>
        <div class="tab-header">
            管理数据
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
import { ref, shallowReactive, watch, onMounted } from 'vue'
import { useRoute, } from 'vue-router'
import Tabs from '@/components/Tabs.vue'
import EditRecord from './EditRecord.vue'
import DeleteRecord from './DeleteRecord.vue'
import EditAuthor from './EditAuthor.vue'
import EditDirname from './EditDirname.vue'
import DataSecurity from './DataSecurity.vue'

const route = useRoute()

const activeLabelIdx = ref<number>(0)
const tabs = shallowReactive([
    { id: 1, label: '添加记录', disabled: false },
    { id: 2, label: '批量删除', disabled: false },
    { id: 3, label: '添加作者', disabled: false },
    { id: 4, label: '编辑目录', disabled: false },
    { id: 5, label: '数据安全', disabled: false },
])
const components = [
    EditRecord,
    DeleteRecord,
    EditAuthor,
    EditDirname,
    DataSecurity,
]


const init = () => {
    // 如果是编辑作者，禁用管理记录, 批量删除, 编辑目录; 并且把activeLabelIdx设置为编辑作者 
    if (route.query.author_id) {
        tabs[0].disabled = true
        tabs[2].label = '编辑作者'
        activeLabelIdx.value = 2
    } else {
        tabs[0].disabled = false
        tabs[2].label = '添加作者'
        activeLabelIdx.value = 0
    }
}

watch(route, init)
// 监听路由改变，更新禁用状态
onMounted(init) 
</script>

<style></style>