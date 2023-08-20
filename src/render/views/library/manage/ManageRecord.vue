<template>
    <div class="flex-col">
        <el-form ref="formRef"
                 :model="formData"
                 :rules="rules"
                 class="dashboard__content scrollbar-y-w8"
                 label-width="120px"
                 label-position="left"
                 require-asterisk-position="right"
                 status-icon>
            <div v-if="options.batch"
                 class="form-header">
                <el-form-item label="批量导入目录"
                              prop="batchDir">
                    <div class="flex-row">
                        <echo-autocomplete v-model="formData.batchDir"
                                           type="dirname"
                                           :placeholder="'资源所在目录的绝对路径, 注意window盘符要写成C:\\'"
                                           class="flex-1"
                                           :maxlength="'4000'" />
                        <button2 @click="selectBatchDir()">选择文件夹</button2>
                    </div>
                </el-form-item>
                <el-form-item label="过滤存在">
                    <el-switch v-model="options.distinct" /> 当basename和已存在的记录标题相同时，跳过添加。
                </el-form-item>
                <el-form-item>
                    <el-popover placement="top-start"
                                :width="500"
                                :title="'批量导入'"
                                trigger="hover">
                        <template #reference>
                            <span class="tips__reference">什么是批量导入</span>
                        </template>
                        <div class="tips__content">
                            <p> 通过读取给定的目录，软件会遍历该目录下所有的文件和文件夹，以然后以basename当作记录(文件的扩展名会被去掉)的标题将其添加到数据库中。</p>
                            <p> 表单下面的属性，会给批量导入的所有记录都添加上</p>
                        </div>
                    </el-popover>
                </el-form-item>
            </div>
            <div v-else
                 class="form-header">
                <el-form-item label="本地资源路径"
                              prop="dirname">
                    <div style="margin-bottom: 6px;">
                        <echo-autocomplete v-model="formData.dirname"
                                           type="dirname"
                                           :placeholder="`资源所在的目录，是一个绝对路径(dirname), 注意根目录要写成'C:\\'或'/'`" />
                    </div>
                    <div class="flex-row">
                        <el-input v-model="formData.basename"
                                  spellcheck="false"
                                  :placeholder="'basename,可以是文件也可以是文件夹'"
                                  clearable />
                        <button2 @click="selectRecordResource('file')">选择文件</button2>
                        <button2 @click="selectRecordResource('dir')">选择文件夹</button2>
                    </div>
                    <el-popover placement="top-start"
                                :width="500"
                                :title="'路径格式'"
                                trigger="hover">
                        <template #reference>
                            <span class="tips__reference">路径输入建议</span>
                        </template>
                        <div class="tips__content">
                            <p> 最好使用当前平台的路径格式，因为后台会强制把其他平台的路径格式转换成当前平台的路径格式。可能会导致路径错误。</p>
                            <p> windows路径分隔符是'\', 输入类似于C:\foo。其他的路径分隔符是'/'。输入类似于/root </p>
                        </div>
                    </el-popover>
                    <div class="tips">
                    </div>
                </el-form-item>
                <el-form-item label="标题"
                              prop="title">
                    <echo-autocomplete v-model="formData.title"
                                       type="record"
                                       :placeholder="'记录的标题'" />
                </el-form-item>
            </div>
            <el-form-item v-if="isAdd"
                          class="divider">
                <button2 @click="switchBatch">批量添加</button2>
            </el-form-item>
            <el-form-item label="链接">
                <el-input v-model="formData.hyperlink"
                          :placeholder="'希望指向的网址(例：www.google.com)'"
                          spellcheck="false"
                          clearable />
            </el-form-item>
            <el-form-item label="选择封面">
                <div class="cover">
                    <img :src="formData.cover ? `file:///${formData.cover}` : noImg"
                         alt="图片失效"
                         class="fit--contain">
                    <div class="image-select-btn">
                        <span @click="selectCover">选择图片</span>
                        <span :class="[formData.cover === formData.originCover ? 'disabled' : '']"
                              @click="resetCover">重置</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="评分">
                <el-rate v-model="formData.rate"
                         :colors="rateColors" />
            </el-form-item>
            <el-form-item label="作者">
                <div class="flex-row">
                    <echo-autocomplete v-model="dispalyFormData.authorInput"
                                       type="author"
                                       :placeholder="'只能添加已经存在的作者'"
                                       :show-selectbtn="true"
                                       class="flex-1"
                                       @btn-select="authorAdder" />
                </div>
                <div class="attribute-container scrollbar-y-w4">
                    <div v-if="displayAuthors.length === 0"
                         class="attribute-container__empty">
                        没有添加作者
                    </div>
                    <div v-for="author in displayAuthors"
                         class="author flex-center">
                        <img :src="author.avatar ? `file:///${author.avatar}` : noImg"
                             :key="author.id"
                             class="author-icon"
                             @error="($event.target as HTMLImageElement).src = noImg">
                        <p class="textover--ellopsis">{{ author.name }}</p>
                        <span class="deleteIcon"
                              @click="authorRemover(author.id)"></span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="标签">
                <div class="flex-row">
                    <echo-autocomplete v-model="dispalyFormData.tagInput"
                                       class="flex-1"
                                       type="tag"
                                       :placeholder="'库中没有则会自动添加'" />
                    <button2 @click="tagAdder(dispalyFormData.tagInput)">添加</button2>
                </div>
                <div class="attribute-container scrollbar-y-w4">
                    <div v-if="displayTags.length === 0"
                         class="attribute-container__empty">
                        没有添加标签
                    </div>
                    <div v-for="tag in displayTags"
                         :key="tag"
                         class="tag">
                        <span>{{ tag }}</span>
                        <span class="deleteIcon"
                              @click="tagRemover(tag)" />
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="系列">
                <div class="flex-row">
                    <echo-autocomplete v-model="dispalyFormData.seriesInput"
                                       class="flex-1"
                                       type="series"
                                       :placeholder="'库中没有则会自动添加'" />
                    <button2 @click="seriesAdder(dispalyFormData.seriesInput)">添加</button2>
                </div>
                <div class="attribute-container scrollbar-y-w4">
                    <div v-if="displaySeries.length === 0"
                         class="attribute-container__empty">
                        没有加入系列
                    </div>
                    <div v-for="series in displaySeries"
                         :key="series"
                         class="series">
                        <p class="flex-1 textover--ellopsis"> {{ series }} </p>
                        <span class="deleteIcon"
                              @click="seriesRemover(series)"></span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="介绍">
                <el-input v-model="formData.intro"
                          type="textarea"
                          spellcheck="false"
                          :autosize="inputAutoSize"
                          resize="none"
                          placeholder="记录的介绍" />
            </el-form-item>
            <el-form-item label="信息">
                <el-input v-model="formData.info"
                          type="textarea"
                          spellcheck="false"
                          :autosize="inputAutoSize"
                          resize="none"
                          placeholder="记录的额外信息，比如文件备份的保存位置。" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           @click="submitForm(formRef)">
                    {{ submitBtnText }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import useManageRecordService from '@/service/manageRecordService'
import Button2 from '@/components/Button2.vue'
import type { FormInstance, FormRules } from 'element-plus'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import noImg from '@/assets/images/no-img.png'

const rateColors = ref(['#b5adf7', '#887cf7', '#9e94f7']) // 评分颜色 
const inputAutoSize = {
    minRows: 4,
    maxRows: 4
}
const route = useRoute()
const isAdd = ref<boolean>(true)
const submitBtnText = ref<string>('添加')

const formRef = ref()
const dispalyFormData = reactive({
    authorInput: '',
    tagInput: '',
    seriesInput: ''
})
const {
    displayTags,
    tagAdder,
    tagRemover,
    displaySeries,
    seriesAdder,
    seriesRemover,
    displayAuthors,
    authorAdder,
    authorRemover,
    formData,
    options,
    switchBatch,
    selectCover,
    resetCover,
    selectRecordResource,
    selectBatchDir,
    saveOriginData,
    submit,
    resetFormData,
} = useManageRecordService()

const rules = reactive<FormRules>({
    title: [
        {
            validator: (rule, value: string, callback) => {
                // 是批量添加，就表示不需要标题, 直接跳过 
                (!options.batch && value.trim().length === 0) ? callback('标题不能为空') : callback()
            },
            required: true,
            trigger: 'blur'
        },
    ],
    batchDir: [
        {
            validator: (rule, value: string, callback) => {
                (options.batch && value.trim().length === 0) ? callback('导入文件夹不能为空') : callback()
            },
            required: true,
            trigger: 'blur'
        },
    ]
})
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (!valid) return
        submit()
    })
}

const init = () => {
    const id = route.query.record_id as string | undefined
    if (id) {
        isAdd.value = false
        submitBtnText.value = '修改'
        saveOriginData(Number.parseInt(id))
    } else {
        isAdd.value = true
        submitBtnText.value = '添加'
        resetFormData()
    }
}
watch(route, init)
onMounted(init)
</script>

<style scoped>
.form-header {
    height: 168px;
}

.divider {
    padding-bottom: 18px;
}

.attribute-container {
    min-height: 38px;
    max-height: 128px;
    display: flex;
    margin-top: 15px;
    margin-bottom: 5px;
    flex-wrap: wrap;
    line-height: 38px;
}

.deleteIcon::after {
    content: '\e668';
    cursor: pointer;
    margin-left: 6px;
    font-family: "iconfont" !important;
    font-size: 14px !important;
}

.deleteIcon:hover {
    color: var(--echo-warning-color);
}

.attribute-container__empty {
    width: 100%;
    text-align: center;
    color: #6d757a;
}

.attribute-container .author {
    width: 100%;
    position: relative;
    margin: 8px;
}

.attribute-container .author>p {
    flex: 1;
    margin: 0 18px;
    color: var(--echo-emphasis-color);
}

.attribute-container .author>img {
    width: 80px;
    height: 80px;
}

.attribute-container .tag {
    height: 30px;
    margin: 4px 10px 4px 0;
    padding: 0 16px 0 18px;
    border-radius: 4px;
    background: var(--echo-theme-color);
    line-height: 30px;
    font-size: 12px;
    color: #fff;
}

.attribute-container .series {
    height: 30px;
    width: 100%;
    display: flex;
    margin: 4px 4px;
    padding: 0 16px 0 18px;
    border: 1px solid var(--echo-theme-color);
    border-radius: 4px;
    line-height: 30px;
    font-size: 12px;
    overflow: hidden;
    box-sizing: border-box;
}

.cover {
    width: 240px;
    height: 240px;
    display: block;
    position: relative;
    border: 1px solid #e1e1e1;
    box-sizing: border-box;
}
</style>