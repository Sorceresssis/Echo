<template>
    <el-form label-width="100px"
             require-asterisk-position="right"
             label-position="left"
             status-icon>
        <el-form-item v-for="(a, i) in attributes"
                      :key="i"
                      :label="a.label"
                      class="divider">
            <echo-autocomplete v-model="oldValues[i]"
                               :type="(a.acType as AcType)"
                               class="padding-b8"
                               :ps="autocompletePs"
                               :placeholder="'选择要修改的旧值'" />
            <el-input v-model="newValues[i]"
                      class="padding-b8"
                      :placeholder="'输入要修改的新值'" />
            <el-button type="primary"
                       @click="editAttribute(i)">修改</el-button>
            <el-button type="default"
                       @click="deleteAttribute(i)">删除</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

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
    { label: '标签', acType: 'tag', },
    { label: '目录', acType: 'dirname', },
    { label: '系列', acType: 'series', },
])
const editAttribute = (id: number) => {
    const o = oldValues.value[id]
    const n = newValues.value[id]
    const type = attributes[id].acType
    ElMessageBox.confirm(
        '确认修改吗',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
    // editAttribute(type, o, n)
}

const deleteAttribute = (id: number) => {
    const o = oldValues.value[id]
    const type = attributes[id].acType
    ElMessageBox.confirm(
        'proxy will permanently delete the file. Continue?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    ).then(() => {
        ElMessage({
            type: 'success',
            message: 'Delete completed',
        })
    })
}


</script>

<style scoped></style>