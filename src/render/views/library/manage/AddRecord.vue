<template>
    <el-form ref="recordFormRef"
             label-position="left"
             :model="recordForm"
             :rules="rules"
             label-width="120px"
             require-asterisk-position="right"
             status-icon>
        <div v-if="isBatch">
            <el-form-item label="批量导入源">
            </el-form-item>
            <!-- TODO 记录是否存在  将文件夹里的文件名作为标题名快速导入, 添加一个 icon, 用户hover就有提示 -->
            <el-form-item label="过滤存在"
                          v-if="isBatch"></el-form-item>
        </div>
        <div v-else>
            <el-form-item label="文件路径"
                          prop="name">
                <el-row>
                    <el-input v-model="recordForm.dirname"></el-input>
                </el-row>
                <el-row>
                    <el-input v-model="recordForm.basename" />
                </el-row>
                <el-row>
                    <button2>选择文件</button2>
                    <button2>选择文件夹</button2>
                </el-row>
            </el-form-item>
            <el-form-item label="标题"
                          prop="count">
                <el-input v-model="recordForm.title" />
            </el-form-item>
        </div>
        <el-form-item class="divider">
            <el-row>
                <el-button @click="isBatch = !isBatch">批量添加</el-button>
            </el-row>
        </el-form-item>
        <el-form-item label="链接"
                      prop="region">
            <el-input v-model="recordForm.hyperlink" />
        </el-form-item>
        <el-form-item label="选择封面">
            <div class="flex-1 flex-row">
                <el-input v-model="recordForm.coverImage" />
                <button2>选择图片</button2>
            </div>
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
            <div class="flex-row">
                <el-input :placeholder="'点击添加 如果输入的标签不存在，会自动创建标签'" />
                <button2>添加</button2>
            </div>
            <div>
                joifgijfiojiojiojoi
            </div>
        </el-form-item>
        <el-form-item label="系列"
                      prop="resource">
            <div class="flex-row">
                <el-input :placeholder="'点击添加 如果输入的系列不存在，会自动创建系列'" />
                <button2>添加到该系列</button2>
            </div>
            <div>
                fdf
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
import Button2 from '../../../components/Button2.vue'

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

// 添加单个Record和编辑Record
const add = reactive<RecordForm>({
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
// 批量添加Record
const batchAdd = reactive<RecordForm>({
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

    ],
    desc: [
        // { required: true, message: 'Please input activity form', trigger: 'blur' },
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
/* .el-row {
    margin-bottom: 5px;
}

.el-row:last-child {
    margin-bottom: 0;
} */
</style>