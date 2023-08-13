<template>
    <div class="flex-col">
        <el-form class="dashboard__content scrollbar-y-w8"
                 label-width="100px"
                 require-asterisk-position="right"
                 label-position="left"
                 status-icon>
            <el-form-item v-for="(a, i) in attributes"
                          :key="i"
                          :label="a.label">
                <echo-autocomplete v-model="oldValues[i]"
                                   :type="(a.acType as AcType)"
                                   class="padding-b8"
                                   :ps="autocompletePs"
                                   :placeholder="'输入要被替换的值'" />
                <el-input v-model="newValues[i]"
                          class="padding-b8"
                          :placeholder="'输入新值'" />
                <el-button type="primary"
                           @click="editAttribute(i)">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'


// 提示用户操作前可以先备份数据库
// 目录前缀更改
const autocompletePs = 20

const oldValues = ref([
    '',
    '',
    '',
])
const newValues = ref([
    '',
    '',
    '',
])
const attributes = reactive([
    { label: '目录', acType: 'dirname', },
])
const editAttribute = (id: number) => {
    const o = oldValues.value[id]
    const n = newValues.value[id]
    const type = attributes[id].acType

    // editAttribute(type, o, n)
}
</script>

<style scoped></style>