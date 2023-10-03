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
                              prop="resourse">
                    <div style="margin-bottom: 6px;">
                        <echo-autocomplete v-model="formData.dirname"
                                           type="dirname"
                                           :placeholder="`资源所在的目录，是一个绝对路径(dirname), 注意根目录要写成'C:\\'或'/'`" />
                    </div>
                    <div class="flex-row">
                        <el-input v-model="formData.basename"
                                  spellcheck="false"
                                  :placeholder="'basename,可以是文件也可以是文件夹'"
                                  maxlength="255"
                                  show-word-limit
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
                            <p> 程序不会去检查你填写的路径是否在设备上存在，但是会检查路径是否合法, 比如basename不能超过255个字</p>
                            <p> 最好使用当前平台的路径格式，因为后台会强制把其他平台的路径格式转换成当前平台的路径格式。可能会导致路径错误。</p>
                            <p> windows路径分隔符是'\', 输入类似于C:\foo。其他的路径分隔符是'/'。输入类似于/root </p>
                        </div>
                    </el-popover>
                </el-form-item>
                <el-form-item label="标题"
                              prop="title">
                    <echo-autocomplete v-model="formData.title"
                                       type="record"
                                       show-word-limit
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
                          maxlength="2048"
                          show-word-limit
                          spellcheck="false"
                          clearable />
            </el-form-item>
            <el-form-item label="选择封面">
                <div class="cover">
                    <local-image :src="formData.cover"
                                 class="fit--contain" />
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
                        <local-image :src="author.avatar"
                                     :key="author.id"
                                     class="img-icon" />
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
                    <button2 @click="tagAdder">添加</button2>
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
                    <button2 @click="seriesAdder">添加</button2>
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
                           :loading="btnLoading"
                           @click="submitForm(formRef)">
                    {{ submitBtnText }}
                </el-button>
                <el-button v-if="isAdd"
                           @click="resetFormData">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script lang="ts" setup>
import { onMounted, reactive, ref, Ref, watch, inject, readonly } from 'vue'
import { useRoute } from 'vue-router'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import Message from '@/util/Message'
import MessageBox from '@/util/MessageBox'
import useEditRecordServic from '@/service/editRecordService'
import type { FormInstance, FormRules } from 'element-plus'
import Button2 from '@/components/Button2.vue'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import LocalImage from '@/components/LocalImage.vue'

const rateColors = ['#b5adf7', '#887cf7', '#9e94f7'] // 评分颜色 
const inputAutoSize = {
    minRows: 6,
    maxRows: 6,
}
const route = useRoute()
const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()

const activeLibrary = readonly(inject<Ref<number>>('activeLibrary')!)
const isAdd = ref<boolean>(true)
const btnLoading = ref<boolean>(false)
const submitBtnText = ref<string>('添加')
const formRef = ref()

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
    dispalyFormData,
    options,
    switchBatch,
    selectCover,
    resetCover,
    selectRecordResource,
    selectBatchDir,
    saveOriginData,
    submit,
    resetFormData,
} = useEditRecordServic()

const rules = reactive<FormRules>({
    resourse: [
        {
            validator: (rule, value: string, callback) => {
                const dirname = formData.dirname.trim()
                const basename = formData.basename.trim()
                // 不能单独填写basename
                if ((!options.batch)
                    && dirname.length === 0
                    && basename.length !== 0
                ) { callback('不能单独填写basename') } else { callback() }
            },
            trigger: 'blur'
        },
    ],
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
        viewsTaskAfterRoutingStore.setBashboardTags('refresh')
        viewsTaskAfterRoutingStore.setBashboardDirnames('refresh')
        function cb() {
            btnLoading.value = true
            submit(activeLibrary.value).then((result) => {
                // 如果result是undefined，表示后台出错，有弹框警告 
                if (!result) return
                result.code
                    ? Message.success(submitBtnText.value + '成功')
                    : Message.error(submitBtnText.value + '失败' + ', ' + '建议检查路径和目录', 2000)
            }).catch(() => { })
            // 如果是编辑一定要重置，因为编辑的时候会保存原始数据，如果不重置，下次编辑就会出错
            if (!isAdd.value) { init() }
            btnLoading.value = false
        }

        isAdd.value ? MessageBox.addConfirm(cb) : MessageBox.editConfirm(cb)
    })
}

const init = async function () {
    const id = route.query.record_id as string | undefined
    resetFormData()
    if (id) {
        isAdd.value = false
        submitBtnText.value = '修改'
        saveOriginData(activeLibrary.value, Number.parseInt(id))
    } else {
        isAdd.value = true
        submitBtnText.value = '添加'
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
    max-height: 178px;
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
    border-radius: 50%;
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
    border: 1px solid var(--echo-emphasis-color);
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