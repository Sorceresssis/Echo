<template>
    <div class="flex-col">
        <el-form class="dashboard__content scrollbar-y-w8"
                 ref="recordFormRef"
                 label-position="left"
                 :model="delectRecordForm"
                 label-width="120px"
                 require-asterisk-position="right"
                 status-icon>
            <el-form-item v-for="f in formItems"
                          :label="f.label"
                          prop="count">
                <echo-autocomplete v-model="delectRecordForm.dirnamePath"
                                   type="dirname"
                                   :show-word-limit="true"
                                   placeholder="作者的名字"
                                   maxlength="255" />
            </el-form-item>
            <el-form-item label="并删除属性"
                          prop="resource">
                <el-switch v-model="delectRecordForm.deleteAttribute" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           @click="submitForm(recordFormRef)">
                    删除
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'

// 提示， 要完全匹配才能删除

const formItems = reactive([
    { id: 1, label: '目录名', prop: 'dirnamePath', type: 'dirname', placeholder: '作者的名字', maxlength: 255 },
    { id: 2, label: '标签', prop: 'tagTitle', type: 'tag', placeholder: '作者的名字', maxlength: 255 },
    { id: 3, label: '系列', prop: 'seriesName', type: 'series', placeholder: '作者的名字', maxlength: 255 },
])
// 1. 根据 目录批量删除，根据作者批量删除，根据标签批量删除，根据系列批量删除
// 删除记录时，是否时候删除该属性，
const delectRecordForm = reactive({
    tagTitle: '',
    dirnamePath: '',
    authorName: '',
    seriesName: '',
    deleteAttribute: false,
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // 等待结果 显示加载 disabled
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
} 
</script>
  
<style></style>