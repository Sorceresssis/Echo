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
import { type FormInstance, type FormRules } from 'element-plus'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import LocalImage from '@/components/LocalImage.vue'

const inputAutoSize = {
    minRows: 8,
    maxRows: 8,
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
})
const queryAuthorDetail = async (id: number) => {
    const author = await window.electronAPI.queryAuthorDetail(activeLibrary.value, id)
    if (author) {
        formData.id = author.id
        formData.name = author.name
        formData.intro = author.intro
        if (author.avatar) {
            formData.avatar = formData.originAvatar = author.avatar
        } else {
            formData.avatar = formData.originAvatar = ''
        }
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
            if (formData.id) {
                // 编辑已经存在的author肯被records引用, 所以要刷新record相关的视图
                viewsTaskAfterRoutingStore.setBashboardAuthors('refresh')
                viewsTaskAfterRoutingStore.setBashboardRecords('refresh')
                viewsTaskAfterRoutingStore.setAuthorRecords('refresh')
            }

            window.electronAPI.editAuthor(activeLibrary.value, toRaw(formData)).then(result => {
                if (result) {
                    if (formData.id) {
                        Message.success($t('msg.editSuccess'))
                        queryAuthorDetail(formData.id)
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

const init = () => {
    if (!managePathPattern.test(route.fullPath)) return

    const id = route.query.author_id as string | undefined
    if (id) {
        submitBtnText.value = $t('layout.modify')
        queryAuthorDetail(Number.parseInt(id))
    } else {
        submitBtnText.value = $t('layout.create')
        // 清空表单
        formData.id = 0
        formData.name = ''
        formData.avatar = ''
        formData.originAvatar = ''
        formData.intro = ''
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