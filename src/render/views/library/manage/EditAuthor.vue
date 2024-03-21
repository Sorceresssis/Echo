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
                    <local-image :src="formData.avatar"
                        class="fit--cover" />
                    <div class="image-select-btn">
                        <span @click="selectAvatar"> {{ $t('layout.selectImage') }} </span>
                        <span :class="[formData.avatar === formData.originAvatar ? 'disabled' : '']"
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

<script setup
    lang='ts'>
    import { ref, Ref, toRaw, reactive, inject, onMounted, watch, readonly } from 'vue'
    import { useRoute } from 'vue-router'
    import { $t } from '@/locale'
    import useViewsTaskAfterRoutingStore from '@/store/viewsTaskAfterRoutingStore'
    import MessageBox from '@/util/MessageBox'
    import Message from '@/util/Message'
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
    const activeLibrary = readonly(inject<Ref<number>>('activeLibrary')!)
    const managePathPattern = inject<RegExp>('managePathPattern')!

    const authorFormRef = ref()
    const formData = reactive<DTO.EditAuthorForm>({
        id: 0,
        name: '',
        avatar: '',
        originAvatar: '',
        intro: '',
        addSampleImages: [],
        removeSampleImages: []
    })
    const originSampleImages = new Set<string>()
    const displaySampleImages = reactive<Array<string>>([])
    const addSampleImages = new Set<string>()
    const removeSampleImages = new Set<string>()
    const sampleImageAdder = (paths: string[]) => {
        paths.forEach(path => {
            if (displaySampleImages.indexOf(path) !== -1) return
            displaySampleImages.push(path)
            originSampleImages.has(path) ? removeSampleImages.delete(path) : addSampleImages.add(path)
        })
    }
    const sampleImageRemover = (path: string) => {
        const idx = displaySampleImages.indexOf(path)
        if (-1 === idx) return
        displaySampleImages.splice(idx, 1)
        originSampleImages.has(path) ? removeSampleImages.add(path) : addSampleImages.delete(path)
    }
    const saveOriginData = async (id: number) => {
        const author = await window.electronAPI.queryAuthorDetail(activeLibrary.value, id)
        if (!author) {
            Message.error($t('msg.authorNotExist'))
            return
        }
        formData.id = author.id
        formData.name = author.name
        formData.intro = author.intro
        author.sampleImages.forEach(item => {
            originSampleImages.add(item)
            displaySampleImages.push(item)
        })
        if (author.avatar) {
            formData.avatar = formData.originAvatar = author.avatar
        } else {
            formData.avatar = formData.originAvatar = ''
        }

    }
    const selectAvatar = async () => {
        const imgPath = (await window.electronAPI.openDialog('image', false))[0]
        if (imgPath) {
            formData.avatar = imgPath
        }
    }
    const resetAvatar = () => {
        formData.avatar = formData.originAvatar
    }
    const rules = reactive<FormRules>({
        name: [{
            validator: (rule, value: string, callback) => {
                value.trim().length > 0 ? callback() : callback($t('tips.authorNameNotEmpty'))
            },
            trigger: 'blur'
        }],
    })
    const submitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid) => {
            if (!valid) return

            function cb() {
                viewsTaskAfterRoutingStore.setAuthorRecords('refresh')
                viewsTaskAfterRoutingStore.setBashboardAuthors('refresh') // 作者列表刷新

                // 编辑已经存在的author肯被records引用, 所以要刷新record相关的视图
                if (formData.id) {
                    viewsTaskAfterRoutingStore.setBashboardRecords('refresh') // 记录列表刷新
                    viewsTaskAfterRoutingStore.setAuthorRecords('refresh') // 作者页面刷新
                }

                window.electronAPI.editAuthor(activeLibrary.value, toRaw(formData)).then(result => {
                    if (result) {
                        if (formData.id) {
                            Message.success($t('msg.editSuccess'))
                            // resetFormData 会清空formData.id, 所以要先保存
                            const id = formData.id
                            resetFormData()
                            saveOriginData(id)
                        } else {
                            Message.success($t('msg.createSuccess'))
                            authorFormRef.value?.resetFields()
                        }
                    }
                })
            }

            formData.id ? MessageBox.editConfirm().then(cb) : MessageBox.addConfirm().then(cb)
        })
    }
    const resetFormData = function () {
        formData.id = 0
        formData.name = ''
        formData.avatar = ''
        formData.originAvatar = ''
        formData.intro = ''

        displaySampleImages.splice(0)
        originSampleImages.clear()
        addSampleImages.clear()
        removeSampleImages.clear()
    }

    const init = () => {
        if (!managePathPattern.test(route.fullPath)) return

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