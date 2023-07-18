<template>
    <tabs :components="components">
        <template v-slot:header>
            <div class="tab-header fw-bold">
                管理数据
            </div>
        </template>
    </tabs>
</template>
 
<script lang="ts" setup>
import { ref, shallowReactive } from 'vue'
import Tabs from '../../../components/Tabs.vue'
import AddRecord from './AddRecord.vue'
import DeleteRecord from './DeleteRecord.vue'
import EditAuthor from './EditAuthor.vue'
import EditAttributes from './EditAttributes.vue'

const components = shallowReactive([
    { id: 1, name: '添加记录', component: AddRecord },
    { id: 2, name: '批量删除', component: DeleteRecord },
    { id: 4, name: '编辑作者', component: EditAuthor },
    { id: 3, name: '编辑属性', component: EditAttributes },
])
const idxActiveComponent = ref<number>(0)
const switchComponent = (idx: number) => {
    idxActiveComponent.value = idx
}
</script>

<style scoped>
.tab-header {
    height: 40px;
    line-height: 40px;
    font-size: 30px;
    padding: 10px 0;
}
</style>