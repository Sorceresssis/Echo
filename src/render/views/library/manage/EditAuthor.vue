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
            <el-form-item label="头像"
                          prop="avatar">
                <div class="avatar">
                    <local-image :src="formData.avatar"
                                 class="fit--cover" />
                    <div class="image-select-btn">
                        <span @click="selectAvatar">选择图片</span>
                        <span :class="[formData.avatar === formData.originAvatar ? 'disabled' : '']"
                              @click="resetAvatar">重置</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="名字"
                          prop="name">
                <echo-autocomplete v-model="formData.name"
                                   type="author"
                                   :show-word-limit="true"
                                   placeholder="作者的名字"
                                   maxlength="255" />
            </el-form-item>
            <el-form-item label="介绍"
                          prop="intro">
                <el-input v-model="formData.intro"
                          type="textarea"
                          spellcheck="false"
                          :autosize="inputAutoSize"
                          resize="none"
                          clearable
                          placeholder="作者的介绍" />
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
import { ref, Ref, toRaw, reactive, inject, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { addConfirm, editConfirm } from '@/util/ADEMessageBox'
import Message from '@/util/Message'
import { type FormInstance, type FormRules } from 'element-plus'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import LocalImage from '@/components/LocalImage.vue'

const inputAutoSize = {
    minRows: 4,
    maxRows: 4
}
const route = useRoute()
const submitBtnText = ref('添加')
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>

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
            value.trim().length > 0 ? callback() : callback('姓名不能为空')
        },
        trigger: 'blur'
    }],
})
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (!valid) return
        if (formData.id) {
            editConfirm(() => {
                // 编辑成功重新获取数据
                window.electronAPI.editAuthor(
                    activeLibrary.value,
                    toRaw(formData)
                ).then((result) => {
                    if (result) {
                        Message.success('编辑成功')
                        queryAuthorDetail(formData.id)
                    }
                })
            })
        }
        else {
            addConfirm(() => {
                // 添加成功要清空表单
                window.electronAPI.editAuthor(
                    activeLibrary.value,
                    toRaw(formData)
                ).then((result) => {
                    if (result) {
                        Message.success('添加成功')
                        authorFormRef.value?.resetFields()
                    }
                })
            })
        }
    })
}

const init = () => {
    const id = route.query.author_id as string | undefined
    if (id) {
        submitBtnText.value = '修改'
        queryAuthorDetail(Number.parseInt(id))
    } else {
        submitBtnText.value = '添加'
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