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
            <el-form-item :label="$t('layout.localSourcePath')"
                          prop="resourse">
                <div style="margin-bottom: 6px;">
                    <echo-autocomplete v-model="formData.dirname"
                                       type="dirname"
                                       :placeholder="$t('layout.editRecordDirnamePlaceholder')" />
                </div>
                <div class="flex-row">
                    <el-input v-model="formData.basename"
                              spellcheck="false"
                              :placeholder="$t('layout.editRecordBasenamePlaceholder')"
                              maxlength="255"
                              show-word-limit
                              clearable />
                    <button2 @click.stop="selectRecordResource('file')"> {{ $t('layout.selectFile') }} </button2>
                    <button2 @click.stop="selectRecordResource('dir')"> {{ $t('layout.selectDir') }} </button2>
                </div>
                <el-popover placement="top-start"
                            :width="500"
                            :title="$t('tips.pathInputSuggestion')"
                            trigger="hover">
                    <template #reference>
                        <span class="tips__reference"> {{ $t('tips.pathInputSuggestion') }}</span>
                    </template>
                    <div class="tips__content">
                        <p> {{ $t('tips.pathInputSuggestionP1') }} </p>
                        <p> {{ $t('tips.pathInputSuggestionP2') }}</p>
                        <p> {{ $t('tips.pathInputSuggestionP3') }} </p>
                    </div>
                </el-popover>
            </el-form-item>
            <el-form-item :label="$t('layout.title')"
                          prop="title">
                <echo-autocomplete v-model="formData.title"
                                   type="record"
                                   show-word-limit
                                   :placeholder="$t('layout.editRecordTitlePlaceholder')" />
            </el-form-item>
            <el-form-item :label="$t('layout.translated_title')"
                          prop="translated_title">
                <el-input v-model="formData.translated_title"
                          :placeholder="$t('layout.editRecordHyperlinkPlaceholder')"
                          maxlength="255"
                          show-word-limit
                          spellcheck="false"
                          clearable />
            </el-form-item>
            <el-form-item :label="$t('layout.hyperlink')">
                <el-input v-model="formData.hyperlink"
                          :placeholder="$t('layout.editRecordHyperlinkPlaceholder')"
                          maxlength="2048"
                          show-word-limit
                          spellcheck="false"
                          clearable />
            </el-form-item>
            <el-form-item :label="$t('layout.cover')">
                <div class="cover">
                    <local-image :src="formData.cover"
                                 class="fit--contain" />
                    <div class="image-select-btn">
                        <span @click.stop="selectCover"> {{ $t('layout.selectImage') }} </span>
                        <span :class="[formData.cover === formData.originCover ? 'disabled' : '']"
                              @click.stop="resetCover"> {{
                                $t('layout.reset') }} </span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('layout.rate')">
                <el-rate v-model="formData.rate" />
            </el-form-item>
            <el-form-item :label="$t('layout.releaseDate')">
                <el-date-picker v-model="formData.releaseDate"
                                type="date"
                                placeholder="YYYY/M/D"
                                format="YYYY/M/D"
                                value-format="YYYY-MM-DD">
                </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('layout.authors')">
                <div class="flex-row">
                    <echo-autocomplete v-model="dispalyFormData.authorInput"
                                       :key="autocompleteKey"
                                       type="author"
                                       :placeholder="$t('layout.editRecordAuthorsPlaceholder')"
                                       :show-selectbtn="true"
                                       :showWordLimit="true"
                                       class="flex-1"
                                       @btn-select="authorAdder" />
                </div>
                <div class="attribute-container scrollbar-y-w4">
                    <div v-if="displayAuthors.length === 0"
                         class="attribute-container__empty">
                        {{ $t('layout.noAuthors') }}
                    </div>
                    <div v-for="author in displayAuthors"
                         class="author flex-center">
                        <local-image :src="author.avatar"
                                     :key="author.id"
                                     class="avatar-icon" />
                        <p>
                            <span class="author_name textover--ellopsis"> {{ author.name }} </span>
                            <el-select v-model="value"
                                       multiple
                                       placeholder="Select"
                                       style="width: 240px">
                                <el-option v-for="item in options"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value" />
                            </el-select>
                            <span v-if="author.roles.length">({{ author.role }})</span>
                        </p>
                        <div class="op">
                            <span class="iconfont"
                                  @click="handleEditAuthorRole(author)"> &#xe722; </span>
                            <span class="iconfont"
                                  @click="authorRemover(author.id)"> &#xe685; </span>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('layout.tags')">
                <div class="flex-row">
                    <echo-autocomplete v-model="dispalyFormData.tagInput"
                                       class="flex-1"
                                       type="tag"
                                       :showWordLimit="true"
                                       :placeholder="$t('layout.editRecordTagsPlaceholder')" />
                    <button2 @click="tagAdder"> {{ $t('layout.add') }} </button2>
                </div>
                <div class="attribute-container scrollbar-y-w4">
                    <div v-if="displayTags.length === 0"
                         class="attribute-container__empty">
                        {{ $t('layout.noTags') }}
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
            <el-form-item :label="$t('layout.series')">
                <div class="flex-row">
                    <echo-autocomplete v-model="dispalyFormData.seriesInput"
                                       class="flex-1"
                                       type="series"
                                       :showWordLimit="true"
                                       :placeholder="$t('layout.editRecordTagsPlaceholder')" />
                    <button2 @click="seriesAdder"> {{ $t('layout.add') }} </button2>
                </div>
                <div class="attribute-container scrollbar-y-w4">
                    <div v-if="displaySeries.length === 0"
                         class="attribute-container__empty">
                        {{ $t('layout.noSeries') }}
                    </div>
                    <div v-for="series in displaySeries "
                         :key="series"
                         class="series">
                        <p class="flex-1 textover--ellopsis"> {{ series }} </p>
                        <span class="deleteIcon"
                              @click="seriesRemover(series)"></span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('layout.sampleImages')">
                <manage-images :paths="displaySampleImages"
                               @add-images="sampleImageAdder"
                               @delete-image="sampleImageRemover" />
            </el-form-item>
            <el-form-item :label="$t('layout.plot')">
                <el-input v-model="formData.plot"
                          type="textarea"
                          spellcheck="false"
                          :autosize="inputAutoSize"
                          resize="none"
                          :placeholder="$t('layout.editRecordPlotPlaceholder')" />
            </el-form-item>
            <el-form-item :label="$t('layout.searchText')">
                <el-input v-model="formData.searchText"
                          type="textarea"
                          spellcheck="false"
                          :autosize="inputAutoSize"
                          resize="none"
                          :placeholder="$t('layout.editRecordSearchTextPlaceholder')" />
            </el-form-item>
            <el-form-item :label="$t('layout.reviews')">
                <el-input v-model="formData.reviews"
                          type="textarea"
                          spellcheck="false"
                          :autosize="inputAutoSize"
                          resize="none"
                          :placeholder="$t('layout.editRecordReviewsPlaceholder')" />
            </el-form-item>
            <el-form-item :label="$t('layout.info')">
                <el-input v-model="formData.info"
                          type="textarea"
                          spellcheck="false"
                          :autosize="inputAutoSize"
                          resize="none"
                          :placeholder="$t('layout.editRecordInfoPlaceholder')" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           @click="submitForm(formRef)">
                    {{ submitBtnText }}
                </el-button>
                <el-button v-if="isAdd"
                           @click="resetFormData">
                    {{ $t('layout.reset') }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, Ref, watch, inject, readonly, onActivated } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { type FormInstance, type FormRules, ElInput, ElForm, ElFormItem, ElSelect, ElOption, ElPopover } from 'element-plus'
import { $t } from '@/locale'
import { VueInjectKey } from '@/constant/channel_key'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import useAuthorsDashStore from '@/store/authorsDashStore'
import Message from '@/util/Message'
import MessageBox from '@/util/MessageBox'
import useEditRecordService from '@/service/editRecordService'
import Button2 from '@/components/Button2.vue'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import LocalImage from '@/components/LocalImage.vue'
import ManageImages from '@/components/ManageImages.vue'

const inputAutoSize = {
    minRows: 6
}
const isAdd = ref<boolean>(true)
const autocompleteKey = ref<number>(0)
const submitBtnText = ref<string>($t('layout.create'))

const route = useRoute()
const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
const authorsDashStore = useAuthorsDashStore()
const winowLoading = inject<Ref<boolean>>(VueInjectKey.WINDOW_LOADING)!
const activeLibrary = readonly(inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!)
const managePathPattern = inject<RegExp>(VueInjectKey.MANAGE_PAGE_PATH_PATTERN)!

const formRef = ref()
// TODO temp start
const value = ref<string[]>([])
const options = [
    {
        value: 'HTML',
        label: 'HTML',
    },
    {
        value: 'CSS',
        label: 'CSS',
    },
    {
        value: 'JavaScript',
        label: 'JavaScript',
    },
]
// TODO temp end
const {
    displayTags,
    tagAdder,
    tagRemover,
    displaySeries,
    seriesAdder,
    seriesRemover,
    displayAuthors,
    authorAdder,
    authorEditRole,
    authorRemover,
    displaySampleImages,
    sampleImageAdder,
    sampleImageRemover,
    formData,
    dispalyFormData,
    selectCover,
    resetCover,
    selectRecordResource,
    saveOriginData,
    submit,
    resetFormData,
} = useEditRecordService()

const handleEditAuthorRole = function (author: VO.RecordAuthorRelation) {
    MessageBox.editPrompt(
        (value: string) => {
            const maxLen = 50
            if (value.length > maxLen) return $t('tips.lengthLimitExceeded', { count: maxLen })
            return true
        }, author.role || ''
    ).then(({ value }) => {
        author.role = value.trim() === '' ? null : value
        authorEditRole(author.id, author.role)
    })
}

const rules = reactive<FormRules>({
    title: [
        {
            validator: (rule, value: string, callback) => {
                // 是批量添加，就表示不需要标题, 直接跳过 
                value.trim().length === 0 ? callback($t('layout.titleNotEmpty')) : callback()
            },
            required: true,
            trigger: 'blur'
        },
    ],
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid, fields) => {
        if (!valid) return
        async function cb() {
            viewsTaskAfterRoutingStore.setBashboardRecords('refresh')   // record 展示
            viewsTaskAfterRoutingStore.setBashboardRecycled('refresh')  // 可能是从回收站过来的，所以要刷新一下
            viewsTaskAfterRoutingStore.setBashboardAuthors('refresh')   // 作者的样例作品有引用record
            viewsTaskAfterRoutingStore.setBashboardTags('refresh')      // 可能会新增tag
            viewsTaskAfterRoutingStore.setBashboardDirnames('refresh')  // 可能会新增文件夹
            viewsTaskAfterRoutingStore.setAuthorRecords('refresh')      // record 展示
            winowLoading.value = true
            // 等待后台处理完毕后才重新加载新的数据
            await submit(activeLibrary.value).then((result) => {
                // 如果result是undefined，表示后台出错，有弹框警告 
                if (!result) return
                result.code
                    ? Message.success(isAdd.value ? $t('msg.createSuccess') : $t('msg.editSuccess'))
                    : Message.error((isAdd.value ? $t('msg.createFailed') : $t('msg.editFailed')) + ', ' + result.msg, 2000)
            }).catch(() => { })
            // NOTE 更新role
            authorsDashStore.updateRoles(activeLibrary.value)

            if (isAdd.value) {
                resetFormData()
            } else {
                // 如果是编辑一定要重置，因为编辑的时候会保存原始数据，如果不重置，下次编辑就会出错
                const id = formData.id
                resetFormData()
                saveOriginData(activeLibrary.value, id)
            }
            winowLoading.value = false
        }

        isAdd.value ? MessageBox.addConfirm().then(cb) : MessageBox.editConfirm().then(cb)
    })
}

const init = function () {
    if (!managePathPattern.test(route.fullPath)) return

    const id = route.query.record_id as string | undefined

    // 通过key时间戳来强制刷新autocomplete组件
    autocompleteKey.value = new Date().getTime()
    resetFormData()
    if (id) {
        isAdd.value = false
        submitBtnText.value = $t('layout.modify')
        saveOriginData(activeLibrary.value, Number.parseInt(id))
    } else {
        isAdd.value = true
        submitBtnText.value = $t('layout.create')
    }
}
watch(route, () => {
    needInit = true
})
let needInit = false
onMounted(init)
onActivated(() => {
    if (needInit) {
        init()
        needInit = false
    }
})
</script>

<style scoped>
.divider {
    padding-bottom: 18px;
}

.attribute-container {
    min-height: 38px;
    display: flex;
    margin-top: 15px;
    margin-bottom: 5px;
    flex-wrap: wrap;
    line-height: 38px;
}

.deleteIcon::after {
    content: '\e685';
    cursor: pointer;
    margin-left: 6px;
    font-family: "iconfont" !important;
    font-size: 13px !important;
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
    padding: 8px;
}

.attribute-container .author .author_name {
    color: var(--echo-emphasis-color);
}

.attribute-container .author>p {
    flex: 1;
    margin: 0 18px;
}

.attribute-container .author>img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}

.attribute-container .author .op>* {
    margin-right: 10px;
    cursor: pointer;
}

.attribute-container .author .op>*:hover {
    color: var(--echo-theme-color);
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
    border: 1px solid var(--echo-theme-color-light4);
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
}
</style>