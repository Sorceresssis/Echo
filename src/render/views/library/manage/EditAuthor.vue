<template>
    <div class="flex-col">
        <el-form class="dashboard__content scrollbar-y-w8"
                 ref="authorFormRef"
                 label-position="left"
                 :model="formData"
                 :rules="rules"
                 label-width="100px"
                 require-asterisk-position="right"
                 status-icon>
            <el-form-item label="头像"
                          prop="avatar">
                <div class="avatar">
                    <img :src="formData.avatar"
                         alt="图片不存在"
                         class="fit--cover">
                    <div class="image-select-btn">
                        <span @click="selectAvatar">选择图片</span>
                        <span :class="[editAuthorOptions.avatarChanged ? '' : 'disabled']"
                              @click="resetAvatar">重置</span>
                    </div>
                </div>
                <div>
                </div>
            </el-form-item>
            <el-form-item label="名字"
                          prop="name"
                          required>
                <echo-autocomplete v-model="formData.name"
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
                    Create
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import { ref, Ref, toRaw, reactive, inject, onMounted, } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRoute } from 'vue-router'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'

const inputAutoSize = {
    minRows: 4,
    maxRows: 4
}
const route = useRoute()
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>

onMounted(async () => {
    const id = route.query.author_id as string | undefined
    if (id) {
        const author = await window.electronAPI.queryAuthorDetail(activeLibrary.value, Number.parseInt(id))
        if (author) {
            formData.id = author.id
            formData.name = author.name
            formData.intro = author.intro
            // 保存原始头像地址
            formData.avatar = originAvatarUrl.value = author.avatar ? `file:///${author.avatar}` : originAvatarUrl.value
            return
        }
    }
    formData.avatar = originAvatarUrl.value
})
const originAvatarUrl = ref<string>('../../../assets/images/no-img.png')
const authorFormRef = ref()
const formData = reactive<EditAuthorForm>({
    id: 0,
    name: '',
    avatar: '',
    intro: '',
})
const editAuthorOptions = reactive<EditAuthorOptions>({
    avatarChanged: false,
})

const selectAvatar = async () => {
    const imgPath = (await window.electronAPI.openDialog('image', false))[0]
    if (!imgPath) return
    formData.avatar = imgPath
    editAuthorOptions.avatarChanged = true
}

const resetAvatar = () => {
    formData.avatar = originAvatarUrl.value
    editAuthorOptions.avatarChanged = false
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
        if (valid) {
            window.electronAPI.editAuthor(activeLibrary.value, toRaw(formData), toRaw(editAuthorOptions)).then(
                (vlaue: boolean) => {
                    ElMessage.success('修改成功')
                })
        }
    })
}

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