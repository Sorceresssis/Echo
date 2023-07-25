<template>
    <el-form ref="recordFormRef"
             label-position="left"
             :model="recordForm"
             :rules="rules"
             label-width="100px"
             require-asterisk-position="right"
             status-icon>
        <el-form-item label="目录名"
                      prop="count">
            <el-input v-model="recordForm.title" />
        </el-form-item>
        <el-form-item label="作者"
                      prop="delivery">
        </el-form-item>
        <el-form-item label="标签"
                      prop="type">
        </el-form-item>
        <el-form-item label="系列"
                      prop="resource">
        </el-form-item>
        <el-form-item>
            <el-button type="primary"
                       @click="submitForm(recordFormRef)">
                Create
            </el-button>
            <el-button @click="resetForm(recordFormRef)">Reset</el-button>
        </el-form-item>
    </el-form>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// 1. 根据 目录批量删除，根据作者批量删除，根据标签批量删除，根据系列批量删除
// 删除记录时，是否时候删除该属性，

const colors = ref(['#b5adf7', '#887cf7', '#9e94f7'])
const isBatch = ref(false)

type RecordForm = {
    id?: number,
    dirname: string,
    basename: string,
    hyperlink: string,
    title: string,
    coverImage: string,
    rate: number,
    authors: number[]
    tags: string[],
    series: string[],
    intro: string,
    info: string
}
type Options = {
    type: 0 | 1, // 添加还是修改
    isBatch: boolean, // 是否批量添加
    checkRecordExist: boolean // 添加时是否检查记录是否存在
}


const recordFormRef = ref<FormInstance>()
const recordForm = reactive<RecordForm>({
    dirname: '',
    basename: '',
    hyperlink: '',
    title: '',
    coverImage: '',
    rate: 0,
    authors: [],
    tags: [],
    series: [],
    intro: '',
    info: ''
})

const rules = reactive<FormRules>({
    name: [
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    region: [
        {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change',
        },
    ],
    count: [
        {
            required: true,
            message: 'Please select Activity count',
            trigger: 'change',
        },
    ],
    date1: [
        {
            type: 'date',
            required: true,
            message: 'Please pick a date',
            trigger: 'change',
        },
    ],
    date2: [
        {
            type: 'date',
            required: true,
            message: 'Please pick a time',
            trigger: 'change',
        },
    ],
    type: [
        {
            type: 'array',
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
        },
    ],
    resource: [
        {
            required: true,
            message: 'Please select activity resource',
            trigger: 'change',
        },
    ],
    desc: [
        { required: true, message: 'Please input activity form', trigger: 'blur' },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>
  
<style></style>