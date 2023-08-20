<template>
    <tabs v-model="activeComponentIdx"
          :components="components">
        <template v-slot:header>
            <div class="tab-header fw-bold">
                管理数据
            </div>
        </template>
    </tabs>
</template>
 
<script lang="ts" setup>
import { ref, shallowReactive, watch, onMounted } from 'vue'
import { useRoute, } from 'vue-router'
import Tabs from '@/components/Tabs.vue'
import ManageRecord from './ManageRecord.vue'
import DeleteRecord from './DeleteRecord.vue'
import EditAuthor from './EditAuthor.vue'
import EditDirname from './EditDirname.vue'
import DataSecurity from './DataSecurity.vue'

const route = useRoute()
const components = shallowReactive<TabsComponent[]>([
    { id: 1, name: '管理记录', component: ManageRecord, disabled: false },
    { id: 2, name: '批量删除', component: DeleteRecord, disabled: false },
    { id: 3, name: '添加作者', component: EditAuthor, disabled: false },
    { id: 4, name: '编辑目录', component: EditDirname, disabled: false },
    { id: 5, name: '数据安全', component: DataSecurity, disabled: false },
])
const activeComponentIdx = ref<number>(0)

const init = () => {
    // 如果是编辑作者，禁用管理记录, 批量删除, 编辑目录; 并且把activeComponentIdx设置为编辑作者 
    if (route.query.author_id) {
        components[0].disabled = true
        components[2].name = '编辑作者'
        activeComponentIdx.value = 2
    } else {
        components[0].disabled = false
        components[2].name = '添加作者'
        activeComponentIdx.value = 0
    }
}

watch(route, init)
// 监听路由改变，更新禁用状态
onMounted(init) 
</script>

<style></style>