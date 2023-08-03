<template>
    <el-form ref="authorFormRef"
             label-position="left"
             :model="authorForm"
             :rules="rules"
             label-width="100px"
             require-asterisk-position="right"
             status-icon>
        <el-form-item label="头像"
                      prop="avatar">
            <div>
                <img :src="authorForm.avatar"
                     alt="error"
                     class="fit--cover avatar">
                <div class="openImgBtn"
                     @click="selectImage">
                    选择图片
                </div>
            </div>
        </el-form-item>
        <el-form-item label="名字"
                      prop="name"
                      required>
            <echo-autocomplete v-model="authorForm.name"
                               :show-word-limit="true"
                               placeholder="作者的名字"
                               maxlength="255" />
        </el-form-item>
        <el-form-item label="介绍"
                      prop="intro">
            <el-input v-model="authorForm.intro"
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
</template>

<script setup lang='ts'>
import { ref, Ref, toRaw, reactive, inject, onMounted, } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import EchoAutocomplete from '@components/EchoAutocomplete.vue'

const route = useRoute()
const router = useRouter()
const inputAutoSize = {
    minRows: 4,
    maxRows: 4
}
const activeLibrary = inject<Ref<number>>('activeLibrary') as Ref<number>
const originAvatarUrl = ref<string>('../../../assets/images/no-img.png')
const selectImage = async () => {
    const imgPath = (await window.electronAPI.openDialog('image', false))[0]
    authorForm.avatar = imgPath ? `file://${imgPath}` : authorForm.avatar
}
const authorFormRef = ref()
const authorForm = reactive<AuthorForm>({
    id: 0,
    name: '',
    avatar: '',
    intro: '',
})

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
    await formEl.validate((valid, fields) => {
        if (valid) {
            window.electronAPI.editAuthor(activeLibrary.value, toRaw(authorForm)).then(
                (vlaue: boolean) => {
                    ElMessage.success('修改成功')
                })
        }
    })
}

onMounted(async () => {
    const id = route.query.author_id as string | undefined
    if (id) {
        const author = await window.electronAPI.queryAuthorDetail(activeLibrary.value, Number.parseInt(id))
        console.log(author)
        if (author) {
            authorForm.id = author.id
            authorForm.name = author.name
            authorForm.intro = author.intro
            authorForm.avatar = originAvatarUrl.value = author.avatar ? `file://${author.avatar}` : originAvatarUrl.value
            return
        }
    }
    authorForm.avatar = originAvatarUrl.value
})
</script>

<style scoped>
.avatar {
    display: block;
    width: 200px;
    height: 200px;
    border: 1px solid #e1e1e1;
    box-sizing: border-box;
}

.openImgBtn {
    background-color: #e1e1e1;
    color: #000;
    text-align: center;
    width: 200px;
    cursor: pointer;
}

.openImgBtn:hover {
    background-color: #dadada;
    color: var(--echo-theme-color);
}
</style>