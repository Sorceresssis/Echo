<template>
    <el-form class="scrollbar-y"
             ref="recordFormRef"
             label-position="left"
             :model="recordForm"
             :rules="rules"
             label-width="120px"
             require-asterisk-position="right"
             status-icon>
        <div v-if="option.isBatch"
             style="height: 180px;">
            <el-form-item label="批量导入源">
            </el-form-item>
            <!-- TODO 记录是否存在  将文件夹里的文件名作为标题名快速导入, 添加一个 icon, 用户hover就有提示 -->
            <el-form-item label="过滤存在">
            </el-form-item>
        </div>
        <div v-else
             style="height: 180px;">
            <el-form-item label="文件路径"
                          prop="name">
                <div>
                    <echo-autocomplete v-model="recordForm.dirname"
                                       type="dirname"
                                       :ps="autocompletePs"
                                       :placeholder="'目标所在的目录'" />
                </div>
                <div>
                    <el-input v-model="recordForm.basename"
                              spellcheck="false"
                              :placeholder="'目标名，可以是文件，也可以是文件夹'" />
                </div>
                <div>
                    <button2 @click="selectFile">选择文件</button2>
                    <button2>选择文件夹</button2>
                </div>
            </el-form-item>
            <el-form-item label="标题"
                          prop="count">
                <div>
                    <echo-autocomplete v-model="recordForm.title"
                                       type="record"
                                       :ps="autocompletePs"
                                       :placeholder="'记录的标题'" />
                </div>
            </el-form-item>
        </div>
        <el-form-item class="divider">
            <div>
                <el-popover placement="top-start"
                            title="Title"
                            :width="200"
                            trigger="hover"
                            content="this is content, this is content, this is content">
                    <template #reference>
                        <button2 @click="switchAddMode">批量添加</button2>
                    </template>
                </el-popover>
            </div>
        </el-form-item>
        <el-form-item label="链接"
                      prop="region">
            <el-input v-model="recordForm.hyperlink"
                      :placeholder="'直达超链接'" />
        </el-form-item>
        <el-form-item label="选择封面">
            <div class="flex-row">
                <el-input v-model="recordForm.coverImage"
                          spellcheck="false"
                          :placeholder="'格式: jpg  png  jpeg'" />
                <button2>选择图片</button2>
            </div>
        </el-form-item>
        <el-form-item label="评分">
            <el-rate v-model="recordForm.rate"
                     :colors="colors" />
        </el-form-item>
        <el-form-item label="作者"
                      prop="delivery">
            <div class="flex-row">
                <echo-autocomplete v-model="authorInput"
                                   class="flex-1"
                                   type="author"
                                   :ps="autocompletePs"
                                   :placeholder="'只能添加已经存在的作者'" />
                <button2>添加</button2>
            </div>
            <div>

            </div>
        </el-form-item>
        <el-form-item label="标签"
                      prop="type">
            <div class="flex-row">
                <echo-autocomplete v-model="tagInput"
                                   class="flex-1"
                                   type="tag"
                                   :ps="autocompletePs"
                                   :placeholder="'库中没有则会自动添加'" />
                <button2 @click="handleAddAttrubute('tag')">添加</button2>
            </div>
            <div class="flex-row">
                <div v-for="tag in recordForm.tags">{{ tag }}</div>
            </div>
        </el-form-item>
        <el-form-item label="系列"
                      prop="resource">
            <div class="flex-row">
                <echo-autocomplete v-model="seriesInput"
                                   class="flex-1"
                                   type="series"
                                   :ps="autocompletePs"
                                   :placeholder="'库中没有则会自动添加'" />
                <button2 @click="handleAddAttrubute('series')">添加</button2>
            </div>
            <div style="max-height: 100px   ; overflow: hidden; display: flex;">
                <ul class="flex-1 scrollbar-y">
                    <li v-for="series in recordForm.series">
                        {{ series }}
                    </li>
                </ul>
            </div>
        </el-form-item>
        <el-form-item label="介绍"
                      prop="desc">
            <el-input v-model="recordForm.intro"
                      type="textarea"
                      spellcheck="false"
                      :autosize="inputAutoSize"
                      resize="none"
                      clearable
                      placeholder="记录的介绍" />
        </el-form-item>
        <el-form-item label="信息">
            <el-input v-model="recordForm.info"
                      type="textarea"
                      spellcheck="false"
                      :autosize="inputAutoSize"
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
import Button2 from '@components/Button2.vue'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'


/******************** 基础 ********************/
const colors = ref(['#b5adf7', '#887cf7', '#9e94f7'])
const autocompletePs = 20
const inputAutoSize = {
    minRows: 4,
    maxRows: 4
}

const recordFormRef = ref<FormInstance>()
const option = reactive<RecordFormOption>({
    type: true,
    isBatch: false,
    checkRecordExist: false
})
const formData = {
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
}
const formDataOfBatch = {
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
}
const recordForm = ref<RecordForm>(formData)
// 切换添加模式函数
const switchAddMode = () => {
    option.isBatch = !option.isBatch
    recordForm.value = option.isBatch ? formData : formDataOfBatch
}

const authorInput = ref('')
const tagInput = ref('')
const seriesInput = ref('')

const handleAddAttrubute = (type: 'tag' | 'series') => {
    // TODO 去重
    switch (type) {
        case 'tag':
            if (tagInput.value.trim() === '') return
            recordForm.value.tags.push(tagInput.value)
            tagInput.value = ''
            break
        case 'series':
            if (seriesInput.value.trim() === '') return
            recordForm.value.series.push(seriesInput.value)
            seriesInput.value = ''
            break
    }
}



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
const selectFile = async () => {
    // recordForm.dirname = (await window.electronAPI.openDialog('file', true))[0]
}
</script>
  
<style></style>