<template>
    <div class="flex-col">
        <el-form class="dashboard__content scrollbar-y-w8"
                 ref="formRef"
                 label-position="left"
                 :model="formData"
                 :rules="rules"
                 label-width="120px"
                 require-asterisk-position="right"
                 status-icon>
            <el-form-item label="目录"
                          prop="dirnamePath">
                <echo-autocomplete v-model="formData.dirnamePath"
                                   type="dirname"
                                   show-word-limit
                                   placeholder="目录路径"
                                   maxlength="255" />
            </el-form-item>
            <el-form-item label="标签"
                          prop="tagTitle">
                <echo-autocomplete v-model="formData.tagTitle"
                                   type="tag"
                                   show-word-limit
                                   placeholder="标签名"
                                   maxlength="255" />
            </el-form-item>
            <el-form-item label="系列"
                          prop="seriesName">
                <echo-autocomplete v-model="formData.seriesName"
                                   type="series"
                                   show-word-limit
                                   placeholder="系列名"
                                   maxlength="255" />
            </el-form-item>
            <el-form-item label="并删除属性"
                          prop="resource">
                <el-switch v-model="formData.deleteAttribute" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           @click="submitForm(formRef)">
                    删除
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules, } from 'element-plus'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'

const formRef = ref<FormInstance>()
const formData = reactive<DTO.BatchDeleteForm>({
    dirnamePath: '',
    tagTitle: '',
    seriesName: '',
    deleteAttribute: false,
})

const emptyFormValidator = (rule: any, value: string, callback: (error?: string | Error | undefined) => void) => {
    return formData.dirnamePath || formData.tagTitle || formData.seriesName ? callback() : callback(new Error('请至少填写一个表单项'))
}
const rules: FormRules = {
    dirnamePath: [{ validator: emptyFormValidator, trigger: 'blur' }],
    tagTitle: [{ validator: emptyFormValidator, trigger: 'blur' }],
    seriesName: [{ validator: emptyFormValidator, trigger: 'blur' }],
}
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (!valid) return
        // window.electronAPI.batchDeleteRecord(formData)
    })
} 
</script>
  
<style></style>