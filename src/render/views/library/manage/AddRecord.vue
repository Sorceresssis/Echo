<template>
    <el-form ref="recordFormRef"
             label-position="left"
             :model="recordForm"
             :rules="rules"
             label-width="100px"
             require-asterisk-position="right"
             status-icon>
        <el-form-item label="文件路径"
                      v-if="!isBatch"
                      prop="name">
            <div class="flex-1">
                <el-row>
                    <el-input v-model="recordForm.dirname"></el-input>
                </el-row>
                <el-row>
                    <el-input v-model="recordForm.basename" />
                </el-row>
                <el-row>
                    <el-button>批量添加</el-button>
                </el-row>
            </div>
        </el-form-item>
        <el-form-item label="链接"
                      prop="region"
                      class="divider">
            <el-input v-model="recordForm.hyperlink" />
        </el-form-item>
        <el-form-item label="标题"
                      prop="count">
            <el-input v-model="recordForm.title" />
        </el-form-item>
        <el-form-item label="封面">
            <el-row>
                <el-col :span="12">
                    <el-input v-model="recordForm.coverImage" />
                </el-col>
                <el-col :span="12">
                    <el-button>选择图片</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label="评分">
            <el-rate v-model="recordForm.rate"
                     :colors="colors" />
        </el-form-item>
        <el-form-item label="作者"
                      prop="delivery">

        </el-form-item>
        <el-form-item label="标签"
                      prop="type">

        </el-form-item>
        <el-form-item label="系列"
                      prop="resource">
            <div class="flex-1">
                <!-- <el-input v-model="  "
                      :placeholder="'如果输入的系列不存在，会自动创建系列'" /> -->

            </div>
        </el-form-item>
        <el-form-item label="介绍"
                      prop="desc">
            <el-input v-model="recordForm.intro"
                      type="textarea"
                      :autosize="{ minRows: 4 }"
                      resize="none"
                      clearable
                      placeholder="记录的介绍" />
        </el-form-item>
        <el-form-item label="信息">
            <el-input v-model="recordForm.info"
                      type="textarea"
                      :autosize="{ minRows: 4 }"
                      resize="none"
                      clearable
                      placeholder="记录的额外信息，比如文件备份的保存位置。" />
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
  
<style>
.el-row {
    margin-bottom: 5px;
}

.el-row:last-child {
    margin-bottom: 0;
}
</style>