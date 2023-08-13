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
import { ref, shallowReactive } from 'vue'
import { useRoute } from 'vue-router'
import Tabs from '@/components/Tabs.vue'
import AddRecord from './AddRecord.vue'
import DeleteRecord from './DeleteRecord.vue'
import EditAuthor from './EditAuthor.vue'
import EditAttributes from './EditAttributes.vue'

const route = useRoute()
const components = shallowReactive([
    { id: 1, name: '添加记录', component: AddRecord },
    { id: 2, name: '批量删除', component: DeleteRecord },
    { id: 3, name: '编辑作者', component: EditAuthor },
    { id: 4, name: '编辑目录', component: EditAttributes },
])
const activeComponentIdx = ref<number>(route.query.author_id ? 2 : 0) 
</script>

<style></style>