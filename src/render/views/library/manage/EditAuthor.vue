<template>
    <div class="flex-col">
        <el-form class="dashboard__content scrollbar-y-w8"
                 ref="authorFormRef"
                 label-position="left"
                 :model="formData"
                 :rules="rules"
                 label-width="120px"
                 require-asterisk-position="right"
                 status-icon
                 @submit.native.prevent>
            <el-form-item :label="$t('layout.avatar')"
                          prop="avatar">
                <div class="avatar">
                    <local-image :src="displayAvatar"
                                 class="fit--cover" />
                    <div class="image-select-btn">
                        <span @click="selectAvatar"> {{ $t('layout.selectImage') }} </span>
                        <span :class="[displayAvatar === originAvatar ? 'disabled' : '']"
                              @click="resetAvatar"> {{ $t('layout.reset') }} </span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('layout.name')"
                          prop="name">
                <echo-autocomplete v-model="formData.name"
                                   type="author"
                                   :show-word-limit="true"
                                   :placeholder="$t('layout.authorName')"
                                   maxlength="255" />
            </el-form-item>
            <el-form-item :label="$t('layout.sampleImages')">
                <manage-images :paths="displaySampleImages"
                               @add-images="sampleImageAdder"
                               @delete-image="sampleImageRemover" />
            </el-form-item>
            <el-form-item :label="$t('layout.intro')"
                          prop="intro">
                <el-input v-model="formData.intro"
                          type="textarea"
                          spellcheck="false"
                          :autosize="inputAutoSize"
                          resize="none"
                          clearable
                          :placeholder="$t('layout.authorIntro')" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           @click="submitForm(authorFormRef)">
                    {{ submitBtnText }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, toRaw, reactive, inject, onMounted, watch, readonly } from 'vue'
import { useRoute } from 'vue-router'
import { $t } from '@/locale'
import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
import MessageBox from '@/util/MessageBox'
import Message from '@/util/Message'
import { VueInjectKey } from '@/constant/channel_key'
import { type FormInstance, type FormRules } from 'element-plus'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import LocalImage from '@/components/LocalImage.vue'
import ManageImages from '@/components/ManageImages.vue'

const inputAutoSize = {
    minRows: 6,
}
const route = useRoute()
const submitBtnText = ref<string>($t('layout.create'))

const viewsTaskAfterRoutingStore = useViewsTaskAfterRoutingStore()
const winowLoading = inject<Ref<boolean>>(VueInjectKey.WINDOW_LOADING)!
const activeLibrary = readonly(inject<Ref<number>>(VueInjectKey.ACTIVE_LIBRARY)!)
const managePagePathPattern = inject<RegExp>(VueInjectKey.MANAGE_PAGE_PATH_PATTERN)!

const authorFormRef = ref()
const formData = reactive<RP.EditAuthorFormData>({
    id: 0,
    name: '',
    newAvatar: '',
    intro: '',
    editSampleImages: [],
    removeSampleImages: []
})
const displayAvatar = ref<string>('')
let originAvatar = ''

const originSampleImages = new Set<string>()
const displaySampleImages = reactive<Array<string>>([])
const removeSampleImages = new Set<string>()
const sampleImageAdder = (paths: string[]) => {
    paths.forEach(path => {
        if (displaySampleImages.indexOf(path) !== -1) return
        displaySampleImages.push(path)
        originSampleImages.has(path) && removeSampleImages.delete(path)
    })
}
const sampleImageRemover = (path: string) => {
    const idx = displaySampleImages.indexOf(path)
    if (-1 === idx) return
    displaySampleImages.splice(idx, 1)
    originSampleImages.has(path) && removeSampleImages.add(path)
}

const saveOriginData = async (id: number | bigint) => {
    const author = await window.electronAPI.queryAuthorDetail(activeLibrary.value, id)
    if (!author) {
        Message.error($t('msg.authorNotExist'))
        return
    }
    formData.id = author.id
    formData.name = author.name
    formData.intro = author.intro
    author.sample_images.forEach(item => originSampleImages.add(item))
    displaySampleImages.push(...author.sample_images)
    if (author.avatar) displayAvatar.value = originAvatar = author.avatar
}
const selectAvatar = async () => {
    const imgPath = (await window.electronAPI.openDialog('image', false))[0]
    if (imgPath) {
        displayAvatar.value = imgPath
    }
}
const resetAvatar = () => {
    displayAvatar.value = originAvatar
}
const rules = reactive<FormRules>({
    name: [{
        validator: (rule, value: string, callback) => {
            value.trim().length > 0 ? callback() : callback($t('tips.authorNameNotEmpty'))
        },
        trigger: 'blur'
    }],
})
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (!valid) return

        function cb() {
            viewsTaskAfterRoutingStore.setAuthorRecords('refresh')
            viewsTaskAfterRoutingStore.setBashboardAuthors('refresh') // 作者列表刷新

            // 编辑已经存在的author肯被records引用, 所以要刷新record相关的视图
            if (formData.id) {
                viewsTaskAfterRoutingStore.setBashboardRecords('refresh') // 记录列表刷新
                viewsTaskAfterRoutingStore.setAuthorRecords('refresh') // 作者页面刷新
            }


            if (displayAvatar.value !== originAvatar) {
                formData.newAvatar = displayAvatar.value
            }
            // sampleImages
            const originSampleImagesArray = Array.from(originSampleImages)
            const editSampleImages: RP.EditSampleImage[] = []
            displaySampleImages.forEach((path, index) => {
                if (!originSampleImages.has(path)) {
                    // 不存在就在此位置添加一个图片
                    editSampleImages.push({ type: 'add', idx: index + 1, path })
                } else if (path !== originSampleImagesArray[index]) {
                    // 存在, 但是位置不对, 就移动到此位置
                    editSampleImages.push({ type: 'move', idx: index + 1, path })
                }
                // 存在, 位置也对, 就不做任何操作
            })
            formData.editSampleImages = editSampleImages
            formData.removeSampleImages = Array.from(removeSampleImages)

            winowLoading.value = true
            window.electronAPI.editAuthor(activeLibrary.value, toRaw(formData)).then(result => {
                if (formData.id) {
                    Message.success($t('msg.editSuccess'))
                    // resetFormData 会清空formData.id, 所以要先保存
                    const id = formData.id
                    resetFormData()
                    saveOriginData(id)
                } else {
                    Message.success($t('msg.createSuccess'))
                    resetFormData()
                    authorFormRef.value?.resetFields()
                }
            }).catch(() => {
                Message.error($t('msg.duplicateAuthorName'))
            }).finally(() => {
                winowLoading.value = false
            })
        }

        formData.id ? MessageBox.editConfirm().then(cb) : MessageBox.addConfirm().then(cb)
    })
}
const resetFormData = function () {
    formData.id = 0
    formData.name = ''
    formData.newAvatar = ''
    formData.intro = ''

    displayAvatar.value = ''
    originAvatar = ''

    displaySampleImages.splice(0)
    originSampleImages.clear()
    removeSampleImages.clear()
}

const init = () => {
    if (!managePagePathPattern.test(route.fullPath)) return

    const id = route.query.author_id as string | undefined

    // 清空表单
    resetFormData()
    if (id) {
        submitBtnText.value = $t('layout.modify')
        saveOriginData(Number.parseInt(id))
    } else {
        submitBtnText.value = $t('layout.create')
    }
}
watch(route, init)
onMounted(init)
</script>

<style scoped>
.avatar {
    width: 200px;
    height: 200px;
    display: block;
    position: relative;
    border: 1px solid #e1e1e1;
    box-sizing: border-box;
}
</style>